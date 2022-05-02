const hero_bullet = (entity, movingDecoration, attackingDecoration) => {
    return {
        moving: {
            right: {
                img: entity,
                width: 13,
                height: 13,
                heightProportion: 0.4,
                relX: 0,
                relY: 1,
                frames: [
                    [393, 158]
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
                    [103, 11],
                ],
            },
        },
        meleeAttacking: {
            right: {
                img: entity,
                width: 13,
                height: 13,
                heightProportion: 0.4,
                relX: 0,
                relY: 1,
                frames: [
                    [393, 158]
                ],
            },
            decoration: {
                img: attackingDecoration,
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