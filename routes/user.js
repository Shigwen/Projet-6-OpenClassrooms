const express = require('express');
const router = express.Router();

// Contrôleur pour associer les fonctions aux différentes routes
const userCtrl = require('../controllers/user');

// Création des deux routes post pour s'inscrire et se connecter
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;