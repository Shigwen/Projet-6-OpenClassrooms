// Le runtime Node permet d'exécuter du code JS côté serveur.
// Pour créer le serveur avec Node :
// on importe tout d'abord le package http de node; cet objet http va nous permettre de créer le server.
const http = require('http');
// Exemple de serveur de base avec requête et réponse : 
// const server = http.createServer((req, res) => 
//  {
// 	 res.end("voià la réponse du serveur")
//  }
// );

// On veut ensuite pouvoir écouter ce qui se passe sur ce serveur, ici le port 4200 pour ce projet
// server.listen(process.end.port || "4200");

// Comme on veut que le serveur serve, ou retourne notre application et pas la fonction ci-dessus qui était juste à titre d'exemple, on fait ceci :
const app = require('./app');

// On dit à l'app quel port on veut qu'elle utilise, l'environnement ou 4200.
// app.set('port', process.env.PORT || "4200");
// const server = http.createServer(app);

// Explications : cours 4 (en bas)
const normalizePort = val => {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
	if (error.syscall !== 'listen') {
		throw error;
	}
	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges.');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use.');
			process.exit(1);
			break;
		default:
			throw error;
	}
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
	console.log('Listening on ' + bind);
});

server.listen(port);


//On démarre le server en tapant "nodemon server.js" dans le terminal. Nodemon est le module qui permet au serveur de s'actualiser à chaque changement.