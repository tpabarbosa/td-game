import BaseEntity from "./BaseEntity.js";

export default class Coin extends BaseEntity {
    static nextId = 0;

    static nextCoinId = () => {
        Coin.nextId += 1;
        return Coin.nextId;
    };

    static create = (data) => {
        return new Coin(data);
    };

    static cumulativeProbabilities = new Map([
        ["copper", 0.6],
        ["silver", 0.9],
        ["gold", 1],
    ]);

    constructor({ coin, position, board, events, isDroppedByBoss }) {
        const id = `coin-${Coin.nextId}`;
        const decorationsId = "drops";

        const options = { centralizedInRow: true };

        const data = {
            id,
            decorationsId,
            cell: { x: 0, y: 0 },
            position: { x: position.x, y: position.y + board.cellsHeight / 4 },
            initialVelocity: { x: coin.baseVelX, y: -coin.baseVelY },
            baseVelocity: { x: coin.baseVelX, y: coin.baseVelY },
            options,
        };

        super(coin, data, board, events);
        Coin.nextCoinId();
        this._coin = coin;
        this._coinValue = isDroppedByBoss ? coin.value * 5 : coin.value;
        this._isCollected = false;
    }

    updateCoin = (currentTime) => {
        this._update(currentTime);
        if (
            this._position.y <= 0 - this._size.height ||
            this._position.x >= this._board.width
        ) {
            this._velocity.y = 0;
            this._velocity.x = 0;
            this._isCollected = true;
        }
        if (this.isCollected()) {
            this.remove();
        }
        this._velocity.x += 0.1;
        if (this._velocity.y < -1) this._velocity.y += 0.05;
    };

    get type() {
        return this._coin.type;
    }

    get value() {
        return this._coinValue;
    }

    isCollected = () => {
        return this._isCollected;
    };
}