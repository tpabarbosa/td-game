import coin from "./coin.js";

const coins = {
    copper: {
        animations: null,
        type: "copper",
        image: null,
        value: 10,
        baseVelX: 10,
        baseVelY: 50,
        initialAction: "moving",
        initialDirection: "up",
        initialVelocity: { x: 10, y: -50 },
        updateIntervalDecorations: 50,
        updateInterval: 100,
    },
    silver: {
        animations: null,
        type: "silver",
        image: null,
        value: 25,
        baseVelX: 10,
        baseVelY: 50,
        initialAction: "moving",
        initialDirection: "up",
        initialVelocity: { x: 10, y: -50 },
        updateIntervalDecorations: 50,
        updateInterval: 100,
    },
    gold: {
        animations: null,
        type: "gold",
        image: null,
        value: 50,
        baseVelX: 10,
        baseVelY: 50,
        initialAction: "moving",
        initialDirection: "up",
        initialVelocity: { x: 10, y: -50 },
        updateIntervalDecorations: 50,
        updateInterval: 100,
    },
};

const loadCoins = (imagesLoaded, eventEmitter) => {
    coins.copper.animations = coin(imagesLoaded.get("coin_copper_entity"));
    coins.silver.animations = coin(imagesLoaded.get("coin_silver_entity"));
    coins.gold.animations = coin(imagesLoaded.get("coin_gold_entity"));
    eventEmitter.emit("entities-group-loaded", {...coins });
};

export default loadCoins;