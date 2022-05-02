const updateIntervalDirections = 1;
const updateIntervalDecorations = 50;

const wall = (entityImg, attackedImg) => {
    return {
        idling: {
            right: {
                updateInterval: updateIntervalDirections,
                img: entityImg,
                width: 195,
                height: 195,
                heightProportion: 1,
                frames: [
                    [430, 515]
                ],
            },
        },
        beingAttacked: {
            right: {
                updateInterval: updateIntervalDirections,
                img: entityImg,
                width: 195,
                height: 195,
                heightProportion: 1,
                frames: [
                    [430, 515]
                ],
            },
            decoration: {
                updateInterval: updateIntervalDecorations,
                img: attackedImg,
                width: 80,
                height: 110,
                heightProportion: 0.5,
                relX: 0.6,
                relY: 0.2,
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

export default wall;