const hero = (entity, attackingDecoration) => {
    return {
        moving: {
            up: {
                img: entity,
                width: 26,
                height: 45,
                frames: [
                    [11, 210],
                    [59, 210],
                    [107, 210],
                    [155, 210],
                ],
            },
            down: {
                img: entity,
                width: 26,
                height: 45,
                frames: [
                    [11, 17],
                    [59, 17],
                    [107, 17],
                    [155, 17],
                ],
            },
        },
        idling: {
            right: {
                img: entity,
                width: 26,
                height: 45,
                frames: [
                    [13, 147]
                ],
            },
        },
        rangeAttacking: {
            right: {
                updateInterval: 0,
                img: entity,
                width: 26,
                height: 45,
                frames: [
                    [13, 147]
                ],
            },
            decoration: {
                img: attackingDecoration,
                width: 80,
                height: 120,
                heightProportion: 0.8,
                relX: 0.3,
                relY: 0,
                loop: false,
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

export default hero;