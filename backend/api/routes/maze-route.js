module.exports = function(app) {
    var mazes = require('../controller/maze-controller');

app.route('/maze')
.post(mazes.get_maze);
}

