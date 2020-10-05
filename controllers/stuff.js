"use strict";
const Thing = require('../models/thing');
const fs = require('fs');


exports.createThing = async (req, res, next) => {
	try {
		// On extraie l'objet Json du corps de la requête
		const thingObject = JSON.parse(req.body.sauce);
		// On lui retire son ID encore une fois pour éviter un conflit avec l'ID que MongoDB va lui donner automatiquement
		delete thingObject._id;
		const thing = new Thing({
			...thingObject,
			// On crée un chemin dynamique qui va s'adapter pour répondre à nos besoins 
			imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
			// On initialise les valeurs à 0 pour ne pas avoir un NaN
			likes : 0,
			dislikes : 0,
		});
		await thing.save();
		res.status(201).json({ message: 'Objet enregistré !' });
	}

	catch (error) {
		console.log(error);
		fs.unlink(
			`${__dirname}/../images/${req.file.filename}`, 
			() => 
			{
				console.info(`deleted file : ${__dirname}/../images/${req.file.filename}`);
			}
		);
		res.status(400).json({ error });
	}
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

exports.modifyThing = async (req, res, next) => {

	const OLDTHING = await Thing.findOne({ _id: req.params.id }).exec();
	const OLDIMAGE = OLDTHING.get("imageUrl");

	const thingObject = req.body;
	if (req.file) 
	{
		thingObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
	}

	// On crée une instance de Thing à partir de thingObject pour effectuer les modifications nécessaires dans Mongoose
	Thing.updateOne(
		{ _id: req.params.id },
		{ ...thingObject, _id: req.params.id }
	)
		.then(
			() => 
			{
				if (req.file)
				{
					const PATH = OLDIMAGE.replace(/.*(\/images\/.+)$/, "$1");
					try
					{
						fs.unlink(
							`${__dirname}/..${PATH}`,
							() => 
							{
								console.info(`deleted file : ${__dirname}/..${PATH}`);
							}
						);
						res.status(200).json({ message: 'Objet modifié !' });
					}
					catch(error)
					{
						console.error(error);
					}
				}
			}
		)

		.catch(
			(error) => {
				console.error(error);
				res.status(404).json({
					error: error
				});
			}
		);
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

exports.likeThing = async (req, res, next) => {

	try {

		// On trouve d'abord la sauce par son ID dans la BD...
		const SAUCE = await Thing.findOne(
			{ _id: req.params.id }
		);
		console.log(SAUCE);
		// Pour pouvoir utiliser :
		// SAUCE.likes;
		// SAUCE.dislikes;
		// SAUCE.usersLiked;
		// SAUCE.usersDisliked;
		const USER_ID = req.body.userId;
		const LIKE = req.body.like;
		
		if (LIKE > 0)
		{
			if (!SAUCE.usersLiked.includes(USER_ID))
			{
				SAUCE.usersLiked.push(USER_ID);
			}
		}
		else
		{
			if (SAUCE.usersLiked.includes(USER_ID))
			{
				const USER_ID_INDEX = SAUCE.usersLiked.indexOf(USER_ID);
				SAUCE.usersLiked.splice(USER_ID_INDEX);
			}
		}

		if (LIKE < 0)
		{
			if (!SAUCE.usersDisliked.includes(USER_ID))
			{
				SAUCE.usersDisliked.push(USER_ID);
			}
		}
		else
		{
			if (SAUCE.usersDisliked.includes(USER_ID))
			{
				const USER_ID_INDEX = SAUCE.usersDisliked.indexOf(USER_ID);
				SAUCE.usersDisliked.splice(USER_ID_INDEX);
			}
		}

		SAUCE.likes = SAUCE.usersLiked.length;
		SAUCE.dislikes = SAUCE.usersDisliked.length;
		SAUCE.save();
		res.status(200).end();
	}
	catch (error) 
	{
		console.log("likeThing", error);
		res.status(500).json({ error });
	}
};