import BaseEntity from "./BaseEntity.js";
import WithHealth from "./behaviors/healthStatus.js";

export default class Wall extends BaseEntity {
    static create = (data, col) => {
        const initialMaxHealth = Wall.maxHealth;
        const healthOptions = { initialMaxHealth };
        return WithHealth(new Wall(data, col), healthOptions);
    };

    static maxHealth = 0;

    static setMaxHealth = (value) => {
        Wall.maxHealth = value;
    };

    constructor({ wall, number, board, events }, col) {
        const cellX = col;

        const id = `wall-${number}`;
        const decorationsId = "walls";

        const options = {
            //centralizedInCol: true,
            fillCell: true,
        };
        const data = {
            id,
            decorationsId,
            cell: { x: cellX, y: col === 0 ? 1 : number },
            baseVelocity: { x: 0, y: 0 },
            initialVelocity: { x: 0, y: 0 },
            options,
            //position: { x: 0, y: 0 }, //optional
        };

        super(wall, data, board, events);
        this._heal = 0.05;
        this._events.game.on("increaseWallHealth", (value) =>
            this.increaseHealthPercent(value)
        );
        this._events.game.on("increaseWallMaxHealth", (value) =>
            this.increaseMaxHealthPercent(value)
        );
    }

    update = (currentTime) => {
        this._update(currentTime);
        this.receiveHeal(this._heal);
        this._updateHealthStatus(currentTime);
        if (this.isDead()) {
            this._events.app.emit("remove-entity", this._id);
            this._clearDecoration();
            return;
        }
        if (this._currentAction === "beingAttacked")
            this._changeAction("idling", 0, 0);
    };
}