// import skeleton from "./skeleton.js ";
// import mummy from "./mummy.js";
// import mage from "./mage.js";
import enemy from "./enemy.js";

const velocity = new Map([
    ["slower", 2],
    ["slow", 4],
    ["normal", 6],
    ["fast", 8],
    ["faster", 10],
]);

const damage = new Map([
    ["weaker", 10],
    ["weak", 20],
    ["normal", 30],
    ["strong", 40],
    ["stronger", 50],
]);

const health = new Map([
    ["weaker", 30],
    ["weak", 50],
    ["normal", 70],
    ["strong", 90],
    ["stronger", 110],
]);

const rate = new Map([
    ["slower", 30],
    ["slow", 40],
    ["normal", 50],
    ["fast", 70],
    ["faster", 90],
]);

const distance = new Map([
    ["closer", 3],
    ["close", 4],
    ["normal", 5],
    ["far", 6],
    ["farther", 7],
]);

const enemies = {
    skeleton: {
        type: "skeleton",
        meleeAttack: {
            attackDamage: damage.get("weaker"),
            attackRate: rate.get("slower"), //attacks per minute
        },
        health: {
            maxHealth: health.get("weaker"),
        },
        animations: null,
        baseVelX: velocity.get("faster"),
        baseVelY: 0,
        initialAction: "moving",
        initialDirection: "left",
        initialVelocity: { x: 0, y: velocity.get("faster") },
        updateIntervalDecorations: 50,
        updateInterval: 150,
    },
    zombie: {
        type: "zombie",
        meleeAttack: {
            attackDamage: damage.get("weak"),
            attackRate: rate.get("slow"),
        },
        health: {
            maxHealth: health.get("weaker"),
        },
        animations: null,
        baseVelX: velocity.get("slower"),
        baseVelY: 0,
        initialAction: "moving",
        initialDirection: "left",
        initialVelocity: { x: 0, y: velocity.get("slower") },
        updateIntervalDecorations: 50,
        updateInterval: 150,
    },
    mage: {
        type: "mage",
        meleeAttack: {
            attackDamage: damage.get("normal"),
            attackRate: rate.get("slow"),
        },
        rangeAttack: {
            shootRate: rate.get("normal"), // shoots per min
            shootDistance: distance.get("close"),
        },
        health: {
            maxHealth: health.get("normal"),
        },
        animations: null,
        baseVelX: velocity.get("normal"),
        baseVelY: 0,
        initialAction: "moving",
        initialDirection: "left",
        initialVelocity: { x: 0, y: velocity.get("normal") },
        updateIntervalDecorations: 50,
        updateInterval: 150,
    },
    warrior: {
        type: "warrior",
        meleeAttack: {
            attackDamage: damage.get("strong"),
            attackRate: rate.get("normal"),
        },
        health: {
            maxHealth: health.get("stronger"),
        },
        animations: null,
        baseVelX: velocity.get("slow"),
        baseVelY: 0,
        initialAction: "moving",
        initialDirection: "left",
        initialVelocity: { x: 0, y: velocity.get("slow") },
        updateIntervalDecorations: 50,
        updateInterval: 150,
    },
};

const loadEnemies = (imagesLoaded, eventEmitter) => {
    enemies.skeleton.animations = enemy(
        imagesLoaded.get("skeleton_entity"),
        imagesLoaded.get("enemies_beingAttacked_decoration"),
        imagesLoaded.get("enemies_attacking_decoration")
    );
    enemies.zombie.animations = enemy(
        imagesLoaded.get("zombie_entity"),
        imagesLoaded.get("enemies_beingAttacked_decoration"),
        imagesLoaded.get("enemies_attacking_decoration")
    );
    enemies.mage.animations = enemy(
        imagesLoaded.get("mage_entity"),
        imagesLoaded.get("enemies_beingAttacked_decoration"),
        imagesLoaded.get("enemies_attacking_decoration")
    );
    enemies.warrior.animations = enemy(
        imagesLoaded.get("warrior_entity"),
        imagesLoaded.get("enemies_beingAttacked_decoration"),
        imagesLoaded.get("enemies_attacking_decoration")
    );
    eventEmitter.emit("entities-group-loaded", {...enemies });
};

export default loadEnemies;