import Bullet from "../Bullet.js";
import WithMeleeAttack from "./meleeAttack.js";
import BaseEntity from "../BaseEntity.js";

const WithRangeAttack = (entity, options) => {
    entity._shootEntityData = null;
    entity._lastShootTime = 1;

    entity._shootRate =
        options && options.initialShootRate ?
        options.initialShootRate :
        entity._entity.rangeAttack.shootRate;

    entity._shootDistance = entity._entity.rangeAttack.shootDistance;
    entity._shootDamage =
        options && options.initialShootDamage ?
        options.initialShootDamage :
        entity._bullet.meleeAttack.attackDamage;

    entity._isShooting = false;
    entity._bulletsList = [];
    entity._entityBeingRangeAttacked = null;

    entity._canFinishShootingInterval = (60 * 1000) / entity._shootRate / 2;

    entity._canShoot = (currentTime) => {
        if (!entity._lastShootTime) entity._lastShootTime = currentTime;
        const shootInterval =
            (BaseEntity._factor * (60 * 1000)) / entity._shootRate;

        if (
            currentTime - entity._lastShootTime > shootInterval &&
            entity._isShooting
        ) {
            return true;
        }
        return false;
    };

    entity._shooting = (bulletData) => {
        if (bulletData) {
            entity._isShooting = true;
            entity._shootEntityData = bulletData;
        } else {
            entity._isShooting = false;
            entity._shootEntityData = null;
        }
    };

    entity.increaseShootRatePercent = (value) => {
        entity._shootRate = Math.round(entity._shootRate * (1 + value));
        return entity._shootRate;
    };

    entity.decreaseShootRatePercent = (value) => {
        entity._shootRate = Math.round(entity._shootRate * (1 - value));
        return entity._shootRate;
    };

    entity.increaseShootDamagePercent = (value) => {
        entity._shootDamage = Math.round(entity._shootDamage * (1 + value));
        return entity._shootDamage;
    };

    entity.decreaseShootDamagePercent = (value) => {
        entity._shootDamage = Math.round(entity._shootDamage * (1 - value));
        return entity._shootDamage;
    };

    entity._shoot = (currentTime) => {
        if (entity._canShoot(currentTime)) {
            entity._dispatchBullet(currentTime);
            return true;
        }
        return false;
    };

    entity.rangeAttack = (entityBeingAttacked) => {
        entity._changeAction("rangeAttacking", { x: 0, y: 0 });
        const data = {
            cell: entity._cell,
            position: entity._position,
            id: entity._bulletsCanvasId,
            decorationsId: "bullets",
            baseVelocity: {
                x: entity._bullet.baseVelX,
                y: entity._bullet.baseVelY,
            },
            initialVelocity: {
                x: entity._bullet.baseVelX,
                y: entity._bullet.baseVelY,
            },
            attackDamage: entity._shootDamage,
        };
        entity._entityBeingRangeAttacked = entityBeingAttacked;
        entity._shooting(data);
    };

    entity._dispatchBullet = (currentTime) => {
        const bullet = new Bullet(
            entity._bullet,
            entity._shootEntityData,
            entity._board,
            entity._events
        );
        entity._bulletsList.push(WithMeleeAttack(bullet));
        entity._lastShootTime = currentTime;
        entity._events.app.emit("bullet-fired", entity._type);
    };

    entity.updateBullets = (currentTime) => {
        entity._bulletsList.forEach((bullet) => {
            bullet.update(currentTime);
        });
        entity._bulletsList = [
            ...entity._bulletsList.filter((bullet) => !bullet.isOut()),
        ];
    };

    entity.getBullets = () => {
        return entity._bulletsList;
    };

    entity._updateRangeAttack = (currentTime) => {
        entity._shoot(currentTime);

        if (
            entity._isShooting &&
            currentTime - entity._lastShootTime > entity._canFinishShootingInterval
        ) {
            entity._finishShoot();
            entity._removeDecoration();
        }
    };
    return entity;
};

export default WithRangeAttack;