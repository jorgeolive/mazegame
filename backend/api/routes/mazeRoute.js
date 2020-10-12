module.exports = function(app) {
    var mazes = require('../controller/mazeController');

app.route('/maze')
.post(mazes.get_maze);
}

