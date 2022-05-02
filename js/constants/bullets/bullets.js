import hero_bullet from "./hero_bullet.js";
import mage_bullet from "./mage_bullet.js";

const bullets = {
    hero_bullet: {
        meleeAttack: {
            attackDamage: 10,
            attackRate: 1000000,
        },
        bulletVelocity: 5,
        animations: null,
        baseVelX: 20,
        baseVelY: 0,
        initialAction: "moving",
        initialDirection: "right",
        initialVelocity: { x: 0, y: 20 },
        updateIntervalDecorations: 50,
        updateInterval: 51,
    },
    mage_bullet: {
        meleeAttack: {
            attackDamage: 10,
            attackRate: 1000000,
        },
        bulletVelocity: 5,
        animations: null,
        baseVelX: -20,
        baseVelY: 0,
        initialAction: "moving",
        initialDirection: "left",
        initialVelocity: { x: 0, y: -20 },
        updateIntervalDecorations: 50,
        updateInterval: 51,
    },
};

const loadBullets = (imagesLoaded, eventEmitter) => {
    bullets.hero_bullet.animations = hero_bullet(
        imagesLoaded.get("hero_bullet"),
        imagesLoaded.get("hero_bullet_moving_decoration"),
        imagesLoaded.get("hero_bullet_attacking_decoration")
    );
    bullets.mage_bullet.animations = mage_bullet(
        imagesLoaded.get("mage_bullet"),
        imagesLoaded.get("mage_bullet_moving_decoration"),
        imagesLoaded.get("mage_bullet_attacking_decoration")
    );
    eventEmitter.emit("entities-group-loaded", {...bullets });
};

export default loadBullets;