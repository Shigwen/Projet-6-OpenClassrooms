const mongoose = require('mongoose');

// schéma pour nos objets. On ne met pas ID dedans car l'ID est automatiquement donnée par Mongoose
const thingSchema = mongoose.Schema({
	userId: { type: String, required: true },
	name: { type: String, required: true },
	manufacturer: { type: String, required: true },
	description: { type: String, required: true },
	mainPepper: { type: String, required: true },
	imageUrl: { type: String, required: true },
	heat: { type: Number, required: true },
	likes: { type: Number },
	dislikes: { type: Number },
	usersLiked: { type: Array },
	usersDisliked: { type: Array },
});

// On exporte le modèle qui s'appellera "thing" et qui sera notre thingSchema
module.exports = mongoose.model('Thing', thingSchema);