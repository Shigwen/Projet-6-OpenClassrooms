//On a besoin du module express pour faire fonctionner notre application correctement.
const express = require("express");

// Pour recueillir les informations postées par les utilisateurs de l'app, qui veulent mettre des objets en ligne
const bodyParser = require('body-parser');

// On connecte la base de donnée mongoose
const mongoose = require("mongoose");

const stuffRoutes = require("./routes/stuff");
const userRoutes = require('./routes/user');

// Pour accéder principalement au dossier images
const path = require('path');

// On connecte à la base de donnée mongoDB
mongoose.connect('mongodb+srv://AppUser:1234test@cluster0.vwanv.mongodb.net/test?retryWrites=true&w=majority',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('Connexion à MongoDB réussie !'))
	.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();



// On paramètre notre app pour qu'elle gère les requêtes et les réponses (qu'elle renverra en Json, voir suite)
// Note : res (response) renvoie au serveur, que l'on pourra voir sur postman par exemple. console.log renvoie au terminal ici.


app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	// Oublier cette ligne next empêche de renvoyer une réponse et de terminer la requête pour passer à la suivante
	next();
});

// Permet de transformer le corps de la requête de l'utilisateur en objet json exploitable
app.use(bodyParser.json());

// Racine de tout ce qui est root lié aux images
app.use('/images', express.static(path.join(__dirname, 'images')));
// Racine de tout ce qui est root lié aux objets
app.use("/api/sauces", stuffRoutes);
// Racine de tout ce qui est root lié à l'authentification
app.use('/api/auth', userRoutes);


// Il faudra l'exporter pour y avoir accès depuis d'autres fichiers, notamment celui du serveur (cours 4)
module.exports = app;
