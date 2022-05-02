const mage = (entityImg, decorationsImg) => {
    return {
        moving: {
            left: {
                img: entityImg,
                width: 26,
                height: 45,
                frames: [
                    [10, 82],
                    [58, 82],
                    [106, 82],
                    [154, 82],
                ],
            },
        },
        idling: {
            left: {
                img: entityImg,
                width: 26,
                height: 45,
                frames: [
                    [10, 82]
                ],
            },
        },
        rangeAttacking: {
            left: {
                updateInterval: 200,
                img: entityImg,
                width: 26,
                height: 45,
                frames: [
                    [10, 82],
                    [154, 82],
                ],
            },
            decoration: {
                img: decorationsImg,
                width: 80,
                height: 120,
                heightProportion: 0.5,
                relX: -0.1,
                relY: 0.4,
                loop: true,
                frames: [
                    [920, 20],
                    [790, 20],
                    [660, 20],
                    [530, 20],
                ],
            },
        },
        beingAttacked: {
            left: {
                img: entityImg,
                width: 26,
                height: 45,
                heightProportion: 1,
                relX: 0,
                relY: 0,
                frames: [
                    [10, 82]
                ],
            },
            decoration: {
                img: decorationsImg,
                width: 80,
                height: 110,
                heightProportion: 0.8,
                relX: 0.2,
                relY: 0.1,
                loop: false,
                frames: [
                    [34, 884],
                    [161, 884],
                    [288, 884],
                    [415, 884],
                ],
            },
        },
    };
};

export default mage;