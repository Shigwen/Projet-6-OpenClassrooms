const multer = require('multer');

const MIME_TYPES = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png'
};

// contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants
const storage = multer.diskStorage({
	// destination : le dossier images
	destination: (req, file, callback) => {
		callback(null, 'images');
	},
	filename: (req, file, callback) => {
		// On enlève les espaces dans les noms de fichiers et on les remplace par des underscore
		const name = file.originalname.split(' ').join('_');
		// On s'assure du type de fichiers que l'on enregistre
		const extension = MIME_TYPES[file.mimetype];
		// On date le fichier à la milliseconde près, et on met le timestamp dans son nouveau nom, ce qui le rendra encore plus unique
		callback(null, name + Date.now() + '.' + extension);
	}
});

module.exports = multer({ storage: storage }).single('image');