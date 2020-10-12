let express = require('express');
let app = express();
var cors = require('cors')
var http = require('http').createServer(app);
var io = require('socket.io')(http);
let port = process.env.PORT || 3000;
let bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

let mazeRoute = require('./api/routes/mazeRoute');
mazeRoute(app);

let gameRoute = require('./api/routes/gameRoute');
gameRoute(app, io);


app.listen(port);

console.log('MazeGame API server started on: ' + port);
