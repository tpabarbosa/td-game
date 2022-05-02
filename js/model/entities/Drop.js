import BaseEntity from "./BaseEntity.js";
import WithHealth from "./behaviors/healthStatus.js";

export default class Drop extends BaseEntity {
    static nextId = 0;

    static nextDropId = () => {
        Drop.nextId += 1;
        return Drop.nextId;
    };

    static create = (data) => {
        const drop = new Drop(data);
        return WithHealth(drop);
    };

    constructor({ drop, position, board, events }) {
        const id = `drop-${Drop.nextId}`;
        const decorationsId = "drops";

        const options = { centralizedInCol: true, centralizedInRow: true };

        const data = {
            id,
            decorationsId,
            cell: { x: 0, y: 0 },
            position: { x: position.x, y: position.y + board.cellsHeight / 4 },
            initialVelocity: { x: 0, y: 0 },
            baseVelocity: { x: 0, y: 0 },
            options,
        };

        super(drop, data, board, events);
        Drop.nextDropId();
        this._drop = drop;
        this._damage = 0.4;
        this._isCollected = false;
    }

    updateDrop = (currentTime) => {
        this._update(currentTime);
        this.receiveDamage(this._damage, { selfDamage: true });
        this._updateHealthStatus();

        // if (this.isDead()) {
        //     this._clearDecoration();
        //     this._clearHealthBar();
        //     this.remove();
        //     return;
        // }
    };

    onClick = (clientX, clientY) => {
        if (
            clientX >= this._position.x &&
            clientX <= this._position.x + this._size.width &&
            clientY >= this._position.y &&
            clientY <= this._position.y + this._size.height
        ) {
            return true;
        }
        return false;
    };

    collect = () => {
        this.receiveDamage(this._drop.maxHealth, { selfDamage: true });
        this._clearDecoration();
        this._clearHealthBar();
        this.remove();
    };

    get type() {
        return this._drop.type;
    }

    get text() {
        return this._drop.text;
    }

    get image() {
        return this._drop.image;
    }

    get value() {
        return this._drop.value;
    }
    get isCollected() {
        return this._isCollected;
    }
}