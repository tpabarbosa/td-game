import BaseEntity from "../BaseEntity.js";

const WithMeleeAttack = (entity, options) => {
    entity._entityBeingMeleeAttacked = null;
    entity._lastMeleeAttackTime = null;
    entity._meleeAttackRate = entity._entity.meleeAttack.attackRate;
    entity._meleeAttackDamage =
        options && options.initialAttackDamage ?
        options.initialAttackDamage :
        entity._entity.meleeAttack.attackDamage;
    entity._isMeleeAttacking = false;

    entity._canAttack = (currentTime) => {
        if (!entity._lastMeleeAttackTime) entity._lastMeleeAttackTime = currentTime;
        const attackInterval =
            (BaseEntity._factor * (60 * 1000)) / entity._meleeAttackRate;
        if (
            currentTime - entity._lastMeleeAttackTime > attackInterval &&
            entity._isMeleeAttacking
        ) {
            return true;
        }
        return false;
    };

    entity._attacking = (entityBeingMeleeAttacked) => {
        if (entityBeingMeleeAttacked) {
            entity._isMeleeAttacking = true;
            entity._entityBeingMeleeAttacked = entityBeingMeleeAttacked;
        } else {
            entity._isMeleeAttacking = false;
            entity._entityBeingMeleeAttacked = null;
        }
    };

    entity._increaseAttackRatePercent = (value) => {
        entity._meleeAttackRate = Math.round(entity._meleeAttackRate * (1 + value));
    };

    entity._decreaseAttackRatePercent = (value) => {
        entity._meleeAttackRate = Math.round(entity._meleeAttackRate * (1 - value));
    };

    entity._increaseAttackDamagePercent = (value) => {
        entity._meleeAttackDamage = Math.round(
            entity._meleeAttackDamage * (1 + value)
        );
    };

    entity._decreaseAttackDamagePercent = (value) => {
        entity._meleeAttackDamage = Math.round(
            entity._meleeAttackDamage * (1 - value)
        );
    };

    entity._attack = (currentTime) => {
        if (entity._canAttack(currentTime)) {
            entity._dispatchAttack(currentTime);
            return true;
        }
        return false;
    };

    entity._dispatchAttack = (currentTime) => {
        entity._lastMeleeAttackTime = currentTime;
        entity._entityBeingMeleeAttacked.receiveDamage(entity._meleeAttackDamage);
    };

    entity.meleeAttack = (entityBeingMeleeAttacked) => {
        entity._changeAction("meleeAttacking", { x: 0, y: 0 });
        entity._attacking(entityBeingMeleeAttacked);
    };

    entity._updateMeleeAttack = (currentTime) => {
        entity._attack(currentTime);
        if (
            (entity._entityBeingMeleeAttacked &&
                entity._entityBeingMeleeAttacked.isDead()) ||
            (!entity._entityBeingMeleeAttacked && entity.isMeleeAttacking())
        ) {
            entity._finishAttack();
            entity._removeDecoration();
        }
    };

    return entity;
};

export default WithMeleeAttack;