const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require('jsonwebtoken');

// S'inscrire. 
exports.signup = (req, res, next) => {
	//On va hasher le mot de passe (le "saler") grâce à une méthode asynchrome (then, catch), ici pour 10 tours
	bcrypt.hash(req.body.password, 10)
		.then(hash => {
			// On va créer le nouvel utilisateur...
			const user = new User({
				// ... grâce à l'adresse mail passée dans le corps de la requête...
				email: req.body.email,
				// ... avec un nouveau mot de passe tout de suite crypté...
				password: hash
			});
			// ... que l'on sauvegarde dans la BD...
			user.save()
				// En renvoyant les messages appropriés si cela marche ou échoue.
				.then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
				.catch(error => res.status(400).json({ error }));
		})
		.catch(error => res.status(500).json({ error }));
};

// Se connecter
exports.login = (req, res, next) => {
	// On veut trouver un utilisateur précis (findOne) dans la BD. Pour cela, on compare son mail avec ceux de la BD.
	User.findOne({ email: req.body.email })
		.then(user => {
			// S'il ne s'y trouve pas, on renvoie un message d'erreur.
			if (!user) {
				return res.status(401).json({ error: 'Utilisateur non trouvé !' });
			}
			// Si on trouve un match, on compare le hash de mot de passe de l'utilisateur avec ceux de la BD...
			bcrypt.compare(req.body.password, user.password)
				.then(valid => {
					// Si il n'y a pas de match pour le mot de passe, on renvoie un message d'erreur (401 : non authorisé)
					if (!valid) {
						return res.status(401).json({ error: 'Mot de passe incorrect !' });
					}
					// S'il y a un match, on renvoie un token (ici juste une chaine de caractères en place holder)
					res.status(200).json({
						userId: user._id,
						// fonction sign encode un nouveau token
						token: jwt.sign(
							// ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token)
							{ userId: user._id },
							// nous utilisons une chaîne secrète de développement temporaire RANDOM_SECRET_KEY pour encoder notre token 
							// (à remplacer par une chaîne aléatoire beaucoup plus longue pour la production) ;
							'RANDOM_TOKEN_SECRET',
							// durée de validité du token définie à 24 heures.
							{ expiresIn: '24h' }
						)
					});
				})
				// Le catch est surtout là en cas de problème de connection, de mongoDB, etc. (500 = erreur serveur)
				.catch(error => res.status(500).json({ error }));
		})
		.catch(error => res.status(500).json({ error }));
};