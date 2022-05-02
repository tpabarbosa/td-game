export default class Decoration {
    constructor(decoration, data, board, events) {
        this._board = board;
        this._events = events;
        this._id = data.id;
        this._decoration = decoration;
        this._position = {...data.position };
        this._entitySize = {...data.size };
        this._action = data.action;
        this._lastPosition = { x: 0, y: 0 };
        this._size = { width: 0, height: 0 };
        this._options = {...data.options };
        this._lastAnimationTime = null;
        this._updateInterval = data.updateInterval;
        this._currentFrameAnimation = 0;
        this._isFinished = false;
        this._calcDecorationSize();
    }

    _calcDecorationSize = () => {
        const options = this._options;
        let heightProportion = 1;
        if (options && options.heightProportion) {
            heightProportion = options.heightProportion;
        }

        const originalProportion = this._decoration.width / this._decoration.height;

        this._size.width = Math.floor(
            originalProportion *
            heightProportion *
            this._decoration.heightProportion *
            this._entitySize.width
        );
        this._size.height = Math.floor(
            heightProportion *
            this._decoration.heightProportion *
            this._entitySize.height
        );
    };

    _calcDecorationPosition = (x, y) => {
        this._position.x = Math.floor(
            x + this._decoration.relX * this._entitySize.width
        );
        this._position.y = Math.floor(
            y + this._decoration.relY * this._entitySize.height
        );
    };

    _clearDecoration = () => {
        const data = {
            id: this._id,
            position: this._position,
            size: this._size,
            isDecoration: true,
        };
        this._events.app.emit("clear-entity", data);
    };

    _drawDecoration = () => {
        const frames = this._decoration.frames;
        if (this._isFinished) return;
        if (frames.length - 1 <= this._currentFrameAnimation) {
            this._currentFrameAnimation = 0;

            if (!this._decoration.loop) {
                this._isFinished = true;
                return;
            }
        } else if (frames.length - 1 > this._currentFrameAnimation) {
            this._currentFrameAnimation += 1;
        }
        const frame = frames[this._currentFrameAnimation];

        const data = {
            id: this._id,
            animation: this._decoration,
            frame,
            position: this._position,
            size: this._size,
            isDecoration: true,
        };
        this._events.app.emit("draw-entity", data);
    };

    update = (currentTime, { x, y }) => {
        if (!this._lastAnimationTime) this._lastAnimationTime = currentTime;

        if (currentTime - this._lastAnimationTime > this._updateInterval) {
            this._lastAnimationTime = currentTime;
            this._clearDecoration();
            this._lastPosition.x = this._position.x;
            this._lastPosition.y = this._position.y;
            this._calcDecorationPosition(x, y);
            this._drawDecoration();
        }
    };

    get isFinished() {
        return this._isFinished;
    }

    get action() {
        return this._action;
    }
}