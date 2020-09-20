
const Thing = require('../models/thing');
const fs = require('fs');

exports.createThing = (req, res, next) => {
	// On extraie l'objet Json du corps de la requête
	const thingObject = JSON.parse(req.body.thing);
	// On lui retire son ID encore une fois pour éviter un conflit avec l'ID que MongoDB va lui donner automatiquement
	delete thingObject._id;
	const thing = new Thing({
		...thingObject,
		// On crée un chemin dynamique qui va s'adapter pour répondre à nos besoins 
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
	});
	thing.save()
		.then(() => res.status(201).json({ message: 'Objet enregistré !' }))
		.catch(error => res.status(400).json({ error }));
};

exports.getOneThing = (req, res, next) => {
	Thing.findOne({
		_id: req.params.id
	}).then(
		(thing) => {
			res.status(200).json(thing);
		}
	).catch(
		(error) => {
			res.status(404).json({
				error: error
			});
		}
	);
};

exports.modifyThing = (req, res, next) => {
	// On regarde si req.file existe ou pas
	const thingObject = req.file ?
		// Si oui, on traite l'objet dans la requête.
		{
			...JSON.parse(req.body.thing),
			imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
		}
		// Si non, on on traite juste la requête.
		: { ...req.body };
	// On crée une instance de Thing à partir de thingObject pour effectuer les modifications nécessaires	
	Thing.updateOne(
		{ _id: req.params.id },
		{ ...thingObject, _id: req.params.id }
	)
		.then(() => res.status(200)
			.json({ message: 'Objet modifié !' }))
		.catch(error => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => {
	// Pour supprimer notre thing, on le trouve d'abord par son ID dans la BD...
	Thing.findOne(
		{ _id: req.params.id }
	).then(thing => {
		// On récupère le nom du fichier à partir de son URL. Pour cela, on split autour du /images/.
		const filename = thing.imageUrl
			.split('/images/')[1];
		// Avec ce nom de fichier, on utilise la fonction du package fs qui s'appelle unlink...
		// Argument 1 : La chaîne de charactères qui correspond à l'URL de ce fichier (on remet donc /images/). 
		// Argument 2 : le callback (ce qu'il faut faire une fois le fichier supprimé).
		// En gros, d'abord on supprime l'image...
		fs.unlink(`images/${filename}`, () => {
			// et une fois que c'est fait on supprime l'objet.
			Thing.deleteOne({ _id: req.params.id })
				.then(() => res.status(200).json({ message: 'Objet supprimé !' }))
				.catch(error => res.status(400).json({ error }));
		});
	}
	).catch(error => res.status(500).json({ error }));
};

exports.getAllStuff = (req, res, next) => {
	Thing.find().then(
		(things) => {
			res.status(200).json(things);
		}
	).catch(
		(error) => {
			res.status(400).json({
				error: error
			});
		}
	);
};
