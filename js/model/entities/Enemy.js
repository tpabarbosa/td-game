import BaseEntity from "./BaseEntity.js";
import WithMeleeAttack from "./behaviors/meleeAttack.js";
import WithRangeAttack from "./behaviors/rangeAttack.js";
import WithHealth from "./behaviors/healthStatus.js";

export default class Enemy extends BaseEntity {
    static nextId = 0;

    static nextEnemyId = () => {
        Enemy.nextId += 1;
        return Enemy.nextId;
    };

    static nextEnemyTimer = (type) => {
        const time = type === "normal" ? 4000 : 2000;
        const minTime = type === "normal" ? 2000 : 1000;
        return Math.floor(Math.random() * time) + minTime;
    };

    static create = (data) => {
        let enemy = new Enemy(data);
        let multiplier = 1 * Math.pow(1 + 0.35, data.level - 1);
        if (data.isBoss) {
            multiplier *= 5;
        }
        if (data.enemy.meleeAttack) {
            const initialAttackDamage = Math.round(
                data.enemy.meleeAttack.attackDamage * multiplier
            );

            const meleeAttackOptions = { initialAttackDamage };
            enemy = WithMeleeAttack(enemy, meleeAttackOptions);
        }

        if (data.enemy.rangeAttack) {
            const initialShootDamage = Math.round(
                data.bullets[`${data.enemy.type}_bullet`].meleeAttack.attackDamage *
                multiplier
            );

            const rangeAttackOptions = { initialShootDamage };
            enemy = WithRangeAttack(enemy, rangeAttackOptions);
        }

        const initialMaxHealth = Math.round(
            data.enemy.health.maxHealth * multiplier
        );

        const healthOptions = { initialMaxHealth };

        const final = WithHealth(enemy, healthOptions);

        return final;
    };

    constructor({ enemy, bullets, board, events, isBoss }) {
        const cellX = board.cols;
        const cellY = isBoss ?
            Math.floor(Math.random() * (board.rows - 2)) + 1 :
            Math.floor(Math.random() * (board.rows - 2)) + 2;

        const id = `enemy-${Enemy.nextId}`;
        const decorationsId = "enemies";
        const options = {
            heightProportion: isBoss ? 2 : 1,
            relativeX: 0,
            relativeY: 0,
        };
        const data = {
            id,
            decorationsId,
            cell: { x: cellX, y: cellY },
            initialVelocity: { x: -enemy.baseVelX, y: enemy.baseVelY },
            baseVelocity: { x: enemy.baseVelX, y: enemy.baseVelY },
            options,
        };

        super(enemy, data, board, events);

        this._isBoss = isBoss;

        if (enemy.rangeAttack) {
            this._bullet = bullets[`${enemy.type}_bullet`];
            this._bulletsCanvasId = `${id}-bullets`;
        }

        Enemy.nextEnemyId();
    }

    updateEnemy = (currentTime) => {
        if (this._position.x <= 0 - this._size.width) {
            this._velocity.y = 0;
        }
        this._updateHealthStatus(currentTime);
        this._updateMeleeAttack(currentTime);
        this._update(currentTime);

        if (this.hasRangeAttack()) {
            this._updateRangeAttack(currentTime);
        }

        if (this.isDead()) {
            this.remove();
            this._clearDecoration();
            if (this.hasRangeAttack()) {
                this._bulletsList.forEach((bullet) => {
                    bullet._isOut = true;
                });
            }
            return;
        }

        if (this._action === "beingAttacked") this._changeToLastAction();
    };

    _move = () => {
        this._changeAction("moving", {
            x: -this._baseVelocity.x,
            y: this._baseVelocity.y,
        });
        this._attacking(null);
        if (this.hasRangeAttack()) this._shooting(null);
    };

    _changeToLastAction = () => {
        if (this._lastAction === "moving") {
            this._move();
        }
        if (this._lastAction === "meleeAttacking") {
            this.meleeAttack(this._entityBeenAttacked);
        }
    };

    _finishAttack = () => {
        this._move();
    };

    _finishShoot = () => {
        this._move();
    };

    isMeleeAttacking = () => {
        return this._action === "meleeAttacking";
    };

    isRangeAttacking = () => {
        return this._action === "rangeAttacking";
    };

    hasMeleeAttack = () => {
        return !!this._entity.meleeAttack;
    };

    hasRangeAttack = () => {
        return !!this._entity.rangeAttack;
    };

    get isBoss() {
        return this._isBoss;
    }
}