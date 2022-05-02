const updateIntervalDirections = 1;
const updateIntervalDecorations = 50;

const hero_bullet = (entityImg, firingImg, explosionImg) => {
    return {
        moving: {
            right: {
                img: entityImg,
                width: 10,
                height: 6,
                heightProportion: 0.2,
                relX: 0,
                relY: 2,
                frames: [
                    [21, 14]
                ],
            },
            decoration: {
                img: firingImg,
                width: 13,
                height: 13,
                heightProportion: 0.5,
                loop: false,
                frames: [
                    [71, 13],
                    [87, 12],
                    [103, 11],
                ],
            },
        },
        attacking: {
            right: {
                img: entityImg,
                width: 10,
                height: 6,
                heightProportion: 0.2,
                relX: 0,
                relY: 2,
                frames: [
                    [21, 14]
                ],
            },
            decoration: {
                img: explosionImg,
                width: 80,
                height: 120,
                heightProportion: 5,
                loop: true,
                frames: [
                    [920, 20],
                    [790, 20],
                    [660, 20],
                    [530, 20],
                ],
            },
        },
    };
};

export default hero_bullet;