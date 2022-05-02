import chest from "./chest.js";

const drops = {
    increaseHeroBulletRate: {
        animations: null,
        health: {
            maxHealth: 400,
        },
        type: "increaseHeroBulletRate",
        text: "Aumento de 10% na taxa de disparos do herói",
        image: null,
        value: 0.1,
        baseVelX: 0,
        baseVelY: 0,
        initialAction: "idling",
        initialDirection: "down",
        initialVelocity: { x: 0, y: 0 },
        updateIntervalDecorations: 50,
        updateInterval: 150,
    },
    increaseHeroBulletDamage: {
        animations: null,
        health: {
            maxHealth: 400,
        },
        type: "increaseHeroBulletDamage",
        text: "Aumento de 10% no dano do disparo do herói",
        image: null,
        value: 0.1,
        baseVelX: 0,
        baseVelY: 0,
        initialAction: "idling",
        initialDirection: "down",
        initialVelocity: { x: 0, y: 0 },
        updateIntervalDecorations: 50,
        updateInterval: 150,
    },
    increaseWallMaxHealth: {
        animations: null,
        health: {
            maxHealth: 400,
        },
        type: "increaseWallMaxHealth",
        text: "Aumento de 5% na vida Máxima dos muros de defesa",
        image: null,
        value: 0.05,
        baseVelX: 0,
        baseVelY: 0,
        initialAction: "idling",
        initialDirection: "down",
        initialVelocity: { x: 0, y: 0 },
        updateIntervalDecorations: 50,
        updateInterval: 150,
    },
    increaseHeroVelocity: {
        animations: null,
        health: {
            maxHealth: 400,
        },
        type: "increaseHeroVelocity",
        text: "Aumento de 10% na velocidade do herói",
        image: null,
        value: 0.1,
        baseVelX: 0,
        baseVelY: 0,
        initialAction: "idling",
        initialDirection: "down",
        initialVelocity: { x: 0, y: 0 },
        updateIntervalDecorations: 50,
        updateInterval: 150,
    },
};

const loadDrops = (imagesLoaded, eventEmitter) => {
    const chestAnimation = chest(imagesLoaded.get("chest_entity"));
    const chestImage = imagesLoaded.get("chest_static");
    drops.increaseHeroBulletRate.animations = chestAnimation;
    drops.increaseHeroBulletDamage.animations = chestAnimation;
    drops.increaseWallMaxHealth.animations = chestAnimation;
    drops.increaseHeroVelocity.animations = chestAnimation;
    drops.increaseHeroBulletRate.image = chestImage;
    drops.increaseHeroBulletDamage.image = chestImage;
    drops.increaseWallMaxHealth.image = chestImage;
    drops.increaseHeroVelocity.image = chestImage;
    eventEmitter.emit("entities-group-loaded", {...drops });
};

export default loadDrops;