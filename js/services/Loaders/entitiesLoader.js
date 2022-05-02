import loadEnemies from "../../constants/enemies/enemies.js";
import loadFriends from "../../constants/friends/friends.js";
import loadDrops from "../../constants/drops/drops.js";
import loadCoins from "../../constants/coins/coins.js";
import loadBullets from "../../constants/bullets/bullets.js";

const entities = [
    { group: "enemies", cb: loadEnemies },
    { group: "friends", cb: loadFriends },
    { group: "drops", cb: loadDrops },
    { group: "coins", cb: loadCoins },
    { group: "bullets", cb: loadBullets },
];

const entitiesLoader = (imagesLoaded, eventEmitter) => {
    eventEmitter.on("entities-group-loaded", (entities) => {
        loadedEntities.set(group, entities);
        loading += 1;
        loadNext();
    });

    const loadedEntities = new Map();
    let loading = 0;
    let group = "";

    const loadNext = () => {
        if (loading === entities.length) {
            eventEmitter.emit("entities-loaded", loadedEntities);
            return;
        }

        group = entities[loading].group;
        entities[loading].cb(imagesLoaded, eventEmitter);
    };

    loadNext();
};

export default entitiesLoader;