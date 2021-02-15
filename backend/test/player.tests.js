const assert = require('assert');
const { Player} = require('../api/model/Player');
const RxOp = require('rxjs/operators');

describe('Player behaviour tests', () => {
    
    it('should emit a playerCaught eventType when killed', () => {

        let isKilled = false;

        const player = new Player(1, "Jorge");
        player.playerEvents$.
        pipe(RxOp.filter(x => x.eventType == "playerCaught")).subscribe(x => isKilled = true);

        player.kill();

        assert.strictEqual(isKilled, true);
    });

    it('when capturing goodie, its points are increased', () => {
    
        const player = new Player(1, "Jorge");    
        player.captureGoodie(500);

        assert.strictEqual(player.points, 500);
    });
});