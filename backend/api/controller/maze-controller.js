'use strict';

const { Maze } = require("../model/maze");

exports.get_maze = function (req, res) {

    let maze = new Maze(req.body.width, req.body.height);
    res.json({ adjancecyList: Object.fromEntries(maze.adjacencyList), cells: maze.cells });
    console.log("Finished request.");
}