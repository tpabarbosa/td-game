import BaseEntity from "../BaseEntity.js";

const DEFAULT_RECEIVE_DAMAGE_OPTIONS = { selfDamage: false };

const WithHealth = (entity, options) => {
    entity._hasDraw = false;
    entity._maxHealth =
        options && options.initialMaxHealth ?
        options.initialMaxHealth :
        entity._entity.health.maxHealth;

    entity._lastDrawHealth = null;
    entity._health = entity._maxHealth;
    entity._isDead = false;

    entity._drawHealthBar = () => {
        if (entity._maxHealth !== entity._health) {
            const healthPercent = entity._health / entity._maxHealth;
            const data = {
                id: entity._id,
                position: entity._position,
                width: entity._size.width,
                healthPercent,
            };
            entity._events.app.emit("draw-health-bar", data);
            entity._lastDrawHealth = entity._health;
            entity._hasDraw = true;
        }
    };

    entity._clearHealthBar = (type = "last") => {
        const data = {
            id: entity._id,
            position: type === "last" ? entity._lastPosition : entity._position,
            width: entity._size.width,
        };
        entity._events.app.emit("clear-health-bar", data);
        entity._hasDraw = false;
    };

    entity.receiveDamage = (damage, options = DEFAULT_RECEIVE_DAMAGE_OPTIONS) => {
        const opt = {...DEFAULT_RECEIVE_DAMAGE_OPTIONS, ...options };

        entity._changeAction("beingAttacked", {
            x: 0,
            y: 0,
        });

        if (entity._health > damage) {
            entity._health -= damage;
        } else {
            entity._health = 0;
            entity._isDead = true;
            entity._clearHealthBar("current");
        }

        if (!opt.selfDamage) {
            entity._events.app.emit("received-damage", entity._type);
        }
    };

    entity.receiveHeal = (heal) => {
        entity._health += heal;
        if (entity._health >= entity._maxHealth) {
            entity._health = entity._maxHealth;
        }
    };

    entity.increaseHealthPercent = (value) => {
        entity.receiveHeal(Math.round(entity._health * value));
        return entity._health;
    };

    entity.decreaseHealthPercent = (value) => {
        entity.receiveDamage(Math.round(entity._health * value));
        return entity._health;
    };

    entity.increaseMaxHealthPercent = (value) => {
        entity._maxHealth += Math.round(entity._maxHealth * value);
        return entity._maxHealth;
    };

    entity.decreaseMaxHealthPercent = (value) => {
        entity._maxHealth -= Math.round(entity._maxHealth * value);
        return entity._maxHealth;
    };

    entity.isDead = () => {
        return entity._isDead;
    };

    entity._updateHealthStatus = (currentTime) => {
        if (
            entity._health !== entity._maxHealth &&
            BaseEntity._graphicsMode !== "slow" &&
            (entity._lastDrawHealth !== entity._health ||
                entity._position.x !== entity._lastPosition.x ||
                entity._position.y !== entity._lastPosition.y ||
                (entity._position.x === entity._lastPosition.x &&
                    entity._position.y === entity._lastPosition.y))
        ) {
            entity._clearHealthBar();
            if (!entity._isDead) {
                entity._drawHealthBar();
                return;
            }
        }
        if (BaseEntity._graphicsMode === "slow" && entity._hasDraw) {
            entity._clearHealthBar("current");
            return;
        }
    };

    return entity;
};
export default WithHealth;