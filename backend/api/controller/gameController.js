'use strict';

const { Game } = require("../model/game");
const Player = require("../model/Player");
const { Games } = require("../model/activeGames");

exports.create_game = function (req, res) {

    let game = new Game(Math.random() * 1000, 20, 20, 2, 5);
    let player = new Player(Math.random() * 1000);
    game.addPlayer(player);

    let games = new Games();

    games.addGame(game);

    res.json({
        gameId: game.id,
        playerId: player.id,
        adjancecyList: Object.fromEntries(game.maze.adjacencyList),
        cells: game.maze.cells
    });

    console.log("Finished game creation request.");
}

