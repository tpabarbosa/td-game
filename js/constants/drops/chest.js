const chest = (entityImg) => {
    return {
        idling: {
            down: {
                img: entityImg,
                width: 43,
                height: 38,
                heightProportion: 0.5,
                frames: [
                    [1, 1],
                    [48, 1],
                    [95, 1],
                    [142, 1],
                ],
            },
        },
        beingAttacked: {
            down: {
                img: entityImg,
                width: 43,
                height: 38,
                heightProportion: 0.5,
                frames: [
                    [1, 1],
                    [48, 1],
                    [95, 1],
                    [142, 1],
                ],
            },
        },
    };
};

export default chest;