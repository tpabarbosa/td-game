const images = [
    // hero
    //{ id: "floor", src: "./images/floor.png" },
    { id: "hero_entity", src: "./images/20.png" },
    { id: "hero_attacking_decoration", src: "./images/pngegg (3).png" },
    { id: "hero_static", src: "./images/hero.png" },

    // hero_bullet
    { id: "hero_bullet", src: "./images/M484BulletCollection1-removebg.png" },
    {
        id: "hero_bullet_moving_decoration",
        src: "./images/M484BulletCollection1-removebg.png",
    },
    { id: "hero_bullet_attacking_decoration", src: "./images/pngegg (3).png" },

    // wall
    { id: "wall_entity", src: "./images/pngwing.com.png" },
    { id: "wall_beingAttacked_decoration", src: "./images/pngegg (3).png" },

    // enemies
    { id: "skeleton_entity", src: "./images/1.png" },
    { id: "zombie_entity", src: "./images/6.png" },
    { id: "mage_entity", src: "./images/8.png" },
    { id: "warrior_entity", src: "./images/9.png" },
    { id: "enemy_static", src: "./images/monster.png" },
    { id: "enemies_beingAttacked_decoration", src: "./images/pngegg (3).png" },
    { id: "enemies_attacking_decoration", src: "./images/pngegg (3).png" },

    // mage_bullet
    { id: "mage_bullet", src: "./images/M484BulletCollection1-removebg.png" },
    {
        id: "mage_bullet_moving_decoration",
        src: "./images/M484BulletCollection1-removebg.png",
    },
    { id: "mage_bullet_attacking_decoration", src: "./images/pngegg (3).png" },

    // chest
    {
        id: "chest_entity",
        src: "./images/5dZiMMw.png",
    },
    { id: "chest_static", src: "./images/openChest.png" },

    // coins
    { id: "coin_copper_entity", src: "./images/coin_copper.png" },
    { id: "coin_silver_entity", src: "./images/coin_silver.png" },
    { id: "coin_gold_entity", src: "./images/coin_gold.png" },
    {
        id: "pile_of_coins_static",
        src: "./images/coins_static.png",
    },

    // game
    {
        id: "end_of_game_static",
        src: "./images/kisspng-computer-icons-trophy-encapsulated-postscript-winner-5abb2925c72b39.3639625415222152058158.png",
    },
];

const imagesLoader = (eventEmitter) => {
    const imagesSources = new Set();
    images.forEach((image) => {
        imagesSources.add(image.src);
    });

    const imagesToLoad = [...imagesSources];

    const loadedImages = new Map();
    let loading = 0;

    const loadNext = () => {
        if (loading === imagesToLoad.length) {
            const finalImages = new Map();
            images.forEach((image) => {
                finalImages.set(image.id, loadedImages.get(image.src));
            });
            eventEmitter.emit("images-loaded", finalImages);
            return;
        }
        const image = new Image();
        image.onload = () => {
            loadedImages.set(imagesToLoad[loading], image);
            loading += 1;
            loadNext();
        };
        image.src = imagesToLoad[loading];
    };

    loadNext();
};

export default imagesLoader;