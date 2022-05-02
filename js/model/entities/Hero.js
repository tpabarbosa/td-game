import BaseEntity from "./BaseEntity.js";
import WithRangeAttack from "./behaviors/rangeAttack.js";

export default class Hero extends BaseEntity {
    static create = (data) => {
        const initialShootDamage = data.playerStats.damage;
        const initialShootRate = data.playerStats.shootRate;
        const rangeAttackOptions = { initialShootDamage, initialShootRate };
        return WithRangeAttack(new Hero(data), rangeAttackOptions);
    };

    constructor({ hero, bullet, board, events, playerStats }) {
        const cellX = 0; //board.cols + 1;
        const cellY = 2; //Math.floor(Math.random() * (board.rows - 1)) + 2; //

        const options = { centralizedInCol: true };
        const id = "hero";
        const decorationsId = "player";

        const data = {
            id,
            decorationsId,
            cell: { x: cellX, y: cellY },
            baseVelocity: { x: 0, y: hero.baseVelY },
            initialVelocity: { x: 0, y: 0 },
            initialUpdateInterval: playerStats.updateInterval,
            options,
            //position: { x: 0, y: 0 }, //optional
        };

        super(hero, data, board, events);

        this._bullet = bullet;
        this._bulletsCanvasId = "hero-bullets";
        this._addEventsListener();
        this._mustCorrect = false;
    }

    _addEventsListener = () => {
        const appEvents = [
            { ev: "key-down", cb: this._onKeyDown },
            { ev: "key-up", cb: this._onKeyUp },
            { ev: "mouse-down", cb: this._onTouchStart },
            { ev: "mouse-up", cb: this._onTouchEnd },
            { ev: "touch-start", cb: this._onTouchStart },
            { ev: "touch-end", cb: this._onTouchEnd },
        ];
        appEvents.forEach((event) => this._events.app.on(event.ev, event.cb));
    };

    increaseBaseVelY = (value) => {
        this.updateBaseVelocity({ x: 0, y: value });
        this.updateVelocity({ x: 0, y: this._baseVelocity.y });
        return this._baseVelocity.y;
    };

    update = (currentTime) => {
        if (this._isIdling()) {
            this.rangeAttack();
        }

        if (
            this._position.y >=
            this._board.cellsHeight * (this._board.rows - 1) + this._baseVelocity.y
        ) {
            this._position.y = this._board.cellsHeight * (this._board.rows - 1);
            this._mustCorrect = true;
        }
        if (this._position.y < 2 * this._board.cellsHeight) {
            this._position.y = 2 * this._board.cellsHeight;
            this._mustCorrect = true;
        }
        this._update(currentTime);
        this._updateRangeAttack(currentTime);
    };

    _correctGlitch = () => {
        if (!this._mustCorrect) return;
        this._mustCorrect = false;
        const data = {
            id: this._id,
            position: { x: 0, y: 0 },
            size: {
                width: this._board.width,
                height: this._board.height,
            },
        };
        this._events.app.emit("clear-entity", data);
    };

    _moveDown = () => {
        if (this._action !== "moving") this._events.app.emit("hero-moving");
        this._changeAction("moving", {
            x: this._baseVelocity.x,
            y: this._baseVelocity.y,
        });
        this._direction = "down";
        this._shooting(null);
    };

    _idle = () => {
        this._changeAction("idling", { x: 0, y: 0 });
        this._direction = "right";
        this._shooting(null);
        this._events.app.emit("hero-stop-moving");
    };

    _moveUp = () => {
        if (this._action !== "moving") this._events.app.emit("hero-moving");
        this._changeAction("moving", {
            x: this._baseVelocity.x,
            y: -this._baseVelocity.y,
        });
        this._direction = "up";
        this._shooting(null);
    };

    _finishShoot = () => {
        this._idle();
    };

    _onTouchStart = (clientX, clientY) => {
        const cellX = Math.floor(clientX / this._board.cellsWidth);
        const cellY = Math.floor(clientY / this._board.cellsHeight);
        if (cellX === this._cell.x && cellY > this._cell.y) {
            this._moveDown();
        } else if (cellX === this._cell.x && cellY < this._cell.y) {
            this._moveUp();
        }
    };

    _onTouchEnd = (event) => {
        this._idle();
        this._correctGlitch();
    };

    _onKeyDown = (key) => {
        if (key === "ArrowDown") {
            this._moveDown();
        } else if (key === "ArrowUp") {
            this._moveUp();
        }
    };

    _onKeyUp = (key) => {
        this._idle();
        this._correctGlitch();
    };

    _isIdling = () => {
        return this._action === "idling";
    };

    isShooting = () => {
        return this._action === "attacking";
    };
}