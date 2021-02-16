const { Game } = require("../api/model/game");
const RxOp = require('rxjs/operators');
const {Player} = require("../api/model/player");
const assert = require('assert');

describe('Game tests', () => {

    it('should emit progress events when initialized', async () => {

        const game = new Game(1, 5, 5, 1, 1, 1);
        let oneHundredProgressEvent = false;

        game.gameEvents$.
            pipe(RxOp.filter(x => x.eventType === "progressStatus" && x.progress == 100)).
            subscribe(x => { oneHundredProgressEvent = true });

        game.addPlayer(new Player(1,"jorge"));  

        await game.init();

        assert.strictEqual(oneHundredProgressEvent, true);
        }),

    it('should change its state to started once initialized', async () => {

        const game = new Game(1, 4, 4, 1, 0, 1);
        let oneHundredProgressEvent = false;

        game.addPlayer(new Player(1,"jorge"));  

        await game.init();  
        game.start();

        assert.strictEqual(game.gameState.isStarted, true);

        game.stop();
        })
    }
    /*,

    it('should throw error if starting game not initialized', async () => {

        const game = new Game(1, 4, 4, 1, 1, 1);
        let oneHundredProgressEvent = false;

        game.addPlayer(new Player(1,"jorge"));  

        game.start();
    }*/
);