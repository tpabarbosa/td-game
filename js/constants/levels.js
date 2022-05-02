export const levels = {
    1: [{
            type: "normal",
            enemies: 10,
            enemiesAllowed: ["skeleton"],
            drops: 2,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
        {
            type: "wave",
            enemies: 20,
            enemiesAllowed: ["skeleton"],
            drops: 3,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
        {
            type: "normal",
            enemies: 10,
            enemiesAllowed: ["skeleton"],
            drops: 2,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
    ],
    2: [{
            type: "normal",
            enemies: 10,
            enemiesAllowed: ["skeleton", "zombie"],
            drops: 3,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
        {
            type: "wave",
            enemies: 20,
            enemiesAllowed: ["zombie"],
            drops: 2,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
        {
            type: "normal",
            enemies: 10,
            enemiesAllowed: ["skeleton", "zombie"],
            drops: 2,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
    ],
    3: [{
            type: "normal",
            enemies: 10,
            enemiesAllowed: ["skeleton", "mage"],
            drops: 2,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
        {
            type: "wave",
            enemies: 20,
            enemiesAllowed: ["zombie", "mage", "skeleton"],
            drops: 4,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
        {
            type: "boss",
            enemies: 1,
            enemiesAllowed: ["skeleton"],
            drops: 0,
            dropsAllowed: [],
        },
    ],
    4: [{
            type: "normal",
            enemies: 10,
            enemiesAllowed: ["warrior", "zombie"],
            drops: 2,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
        {
            type: "wave",
            enemies: 10,
            enemiesAllowed: ["warrior", "skeleton"],
            drops: 4,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
        {
            type: "normal",
            enemies: 10,
            enemiesAllowed: ["mage", "warrior"],
            drops: 3,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
    ],
    5: [{
            type: "normal",
            enemies: 10,
            enemiesAllowed: ["warrior", "mage"],
            drops: 2,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
        {
            type: "wave",
            enemies: 10,
            enemiesAllowed: ["warrior", "mage", "zombie"],
            drops: 4,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
        {
            type: "boss",
            enemies: 2,
            enemiesAllowed: ["zombie"],
            drops: 0,
            dropsAllowed: [],
        },
    ],
    6: [{
            type: "normal",
            enemies: 10,
            enemiesAllowed: ["mage"],
            drops: 2,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
        {
            type: "wave",
            enemies: 10,
            enemiesAllowed: ["mage", "zombie"],
            drops: 4,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
        {
            type: "normal",
            enemies: 10,
            enemiesAllowed: ["zombie", "warrior"],
            drops: 3,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
    ],
    7: [{
            type: "normal",
            enemies: 10,
            enemiesAllowed: ["mage", "skeleton"],
            drops: 2,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
        {
            type: "wave",
            enemies: 20,
            enemiesAllowed: ["zombie"],
            drops: 4,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
        {
            type: "boss",
            enemies: 3,
            enemiesAllowed: ["warrior"],
            drops: 0,
            dropsAllowed: [],
        },
    ],
    8: [{
            type: "normal",
            enemies: 15,
            enemiesAllowed: ["mage", "skeleton", "zombie"],
            drops: 2,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
        {
            type: "wave",
            enemies: 20,
            enemiesAllowed: ["mage", "warrior"],
            drops: 4,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
        {
            type: "normal",
            enemies: 12,
            enemiesAllowed: ["warrior", "skeleton"],
            drops: 4,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
    ],
    9: [{
            type: "normal",
            enemies: 15,
            enemiesAllowed: ["skeleton", "zombie"],
            drops: 2,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
        {
            type: "wave",
            enemies: 20,
            enemiesAllowed: ["skeleton", "mage", "zombie", "warrior"],
            drops: 4,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
        {
            type: "normal",
            enemies: 12,
            enemiesAllowed: ["skeleton", "mage", "zombie", "warrior"],
            drops: 4,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
    ],
    10: [{
            type: "normal",
            enemies: 15,
            enemiesAllowed: ["skeleton", "mage", "zombie", "warrior"],
            drops: 2,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
        {
            type: "boss",
            enemies: 5,
            enemiesAllowed: ["skeleton", "mage", "zombie", "warrior"],
            drops: 4,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
        {
            type: "boss",
            enemies: 10,
            enemiesAllowed: ["skeleton", "mage", "zombie", "warrior"],
            drops: 4,
            dropsAllowed: [
                "increaseHeroBulletDamage",
                "increaseHeroBulletRate",
                "increaseHeroVelocity",
                "increaseWallMaxHealth",
            ],
        },
    ],
};