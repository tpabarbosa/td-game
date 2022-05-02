const mage_bullet = (entity, movingDecoration, attackingDecoration) => {
    return {
        moving: {
            left: {
                img: entity,
                width: 11,
                height: 11,
                heightProportion: 0.3,
                relX: 0,
                relY: 0.8,
                frames: [
                    [188, 157]
                ],
            },
            decoration: {
                img: movingDecoration,
                width: 13,
                height: 13,
                heightProportion: 0.5,
                loop: false,
                frames: [
                    [71, 13],
                    [87, 12],
                    [188, 11],
                ],
            },
        },
        meleeAttacking: {
            left: {
                img: entity,
                width: 11,
                height: 11,
                heightProportion: 0.3,
                relX: 0,
                relY: 0.8,
                frames: [
                    [263, 157]
                ],
            },
            decoration: {
                img: attackingDecoration,
                width: 80,
                height: 120,
                heightProportion: 5,
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

export default mage_bullet;