let sockets = require('./api/rooms/waiting-room');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');

var cors = require('cors');
app.use(cors());

var server = require('http').createServer(app);

let port = process.env.PORT || 3000;

server.listen(port);
sockets.gameRoomChannel(server);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//let mazeRoute = require('./api/routes/maze-route');
//mazeRoute(app);

//let gameRoute = require('./api/routes/game-route');
//gameRoute(app);

console.log('MazeGame API server started on: ' + port);
