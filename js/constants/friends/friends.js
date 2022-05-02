import hero from "./hero.js";
// import hero_bullet from "./hero_bullet.js";
import wall from "./wall.js";

const friends = {
    hero: {
        type: "hero",
        animations: null,
        rangeAttack: {
            shootRate: 60, //60 shoots per min
            shootDistance: null,
        },
        baseVelX: 0,
        baseVelY: 10,
        initialAction: "idling",
        initialDirection: "right",
        initialVelocity: { x: 0, y: 0 },
        updateIntervalDecorations: 50,
        updateInterval: 150,
    },
    wall: {
        type: "wall",
        health: {
            maxHealth: 500,
        },
        animations: null,
        baseVelX: 0,
        baseVelY: 0,
        initialAction: "idling",
        initialDirection: "right",
        initialVelocity: { x: 0, y: 0 },
        updateIntervalDecorations: 50,
        updateInterval: 10000,
    },
};

const loadFriends = (imagesLoaded, eventEmitter) => {
    friends.hero.animations = hero(
        imagesLoaded.get("hero_entity"),
        imagesLoaded.get("hero_attacking_decoration")
    );
    friends.wall.animations = wall(
        imagesLoaded.get("wall_entity"),
        imagesLoaded.get("wall_beingAttacked_decoration")
    );
    eventEmitter.emit("entities-group-loaded", {...friends });
};

export default loadFriends;