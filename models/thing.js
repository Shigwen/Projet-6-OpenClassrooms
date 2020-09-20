const mongoose = require('mongoose');

// schéma pour nos objets. On ne met pas ID dedans car l'ID est automatiquement donnée par Mongoose
const thingSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  price: { type: Number, required: true },
});

// On exporte le modèle qui s'appellera "thing" et qui sera notre thingSchema
module.exports = mongoose.model('Thing', thingSchema);