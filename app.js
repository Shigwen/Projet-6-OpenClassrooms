//On a besoin du module express pour faire fonctionner notre application correctement.
const express = require("express");

// Pour recueillir les informations postées par les utilisateurs de l'app, qui veulent mettre des objets en ligne
const bodyParser = require('body-parser');

// On connecte la base de donnée mongoose
const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://MD:test1234@cluster0.vwanv.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// const http pas nécessaire ?
//const http = require("http");




// On paramètre notre app pour qu'elle gère les requêtes et les réponses (qu'elle renverra en Json, voir suite)
// Note : res (response) renvoie au serveur, que l'on pourra voir sur postman par exemple. console.log renvoie au terminal ici.
// Ce sera notre premier "middleware", ici, une fonction pour express
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	// Oublier cette ligne next empêche de renvoyer une réponse et de terminer la requête pour passer à la suivante
	next();
});

// Permet de transformer le corps de la requête de l'utilisateur en objet json exploitable
app.use(bodyParser.json());

app.post('/api/stuff', (req, res, next) => {
	console.log(req.body);
	res.status(201).json(
		{
			message : 'objet créé !'
		}
	);
});

app.use('/api/stuff', (req, res, next) => {
	const stuff = [
		{
			_id: 'oeihfzeoi',
			title: 'Mon premier objet',
			description: 'Les infos de mon premier objet',
			imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
			price: 4900,
			userId: 'qsomihvqios',
		},
		{
			_id: 'oeihfzeomoihi',
			title: 'Mon deuxième objet',
			description: 'Les infos de mon deuxième objet',
			imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
			price: 2900,
			userId: 'qsomihvqios',
		},
	];
	res.status(200).json(stuff);
});

// Il faudra l'exporter pour y avoir accès depuis d'autres fichiers, notamment celui du serveur (cours 4)
module.exports = app;
