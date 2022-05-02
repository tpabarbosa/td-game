const coin = (entityImg) => {
    return {
        moving: {
            up: {
                img: entityImg,
                width: 18,
                height: 21,
                heightProportion: 0.5,
                frames: [
                    [7, 0],
                    [39, 0],
                    [71, 0],
                    [103, 0],
                    [135, 0],
                    [167, 0],
                    [199, 0],
                    [231, 0],
                ],
            },
        },
    };
};

export default coin;