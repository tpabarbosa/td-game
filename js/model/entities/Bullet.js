import BaseEntity from "./BaseEntity.js";

export default class Bullet extends BaseEntity {
    static nextId = 0;
    static nextBulletId = () => {
        Bullet.nextId += 1;
        return Bullet.nextId;
    };

    constructor(bullet, data, board, events) {
        data.id = `${data.id}-${Bullet.nextId}`;

        super(bullet, data, board, events);
        Bullet.nextBulletId();
        this._initialAttackDamage = data.attackDamage;

        this._isOut = false;
        this._hasCollided = false;
        this._addDecoration();
    }

    update = (currentTime) => {
        this._updateMeleeAttack(currentTime);
        if (this._hasCollided) {
            this._attacking(null);
            this._isOut = true;
        }

        if (this._position.x >= this._board.width) {
            this._velocity.x = 0;
            this._isOut = true;
        }

        if (this._position.x < 0) {
            this._velocity.x = 0;
            this._isOut = true;
        }

        this._update(currentTime);
        if (this._isOut) {
            this.remove();
        }
    };

    collide = (entity) => {
        if (!this._hasCollided) this.meleeAttack(entity);
        this._hasCollided = true;
    };

    _finishAttack = () => {
        this._changeAction("moving", 0, 0);
        this._attacking(null);
    };

    isMeleeAttacking = () => {
        return this._currentAction === "meleeAttacking";
    };

    isOut = () => {
        return this._isOut;
    };

    hasCollided = () => {
        return this._hasCollided;
    };
}