import Decoration from "./Decoration.js";

export default class BaseEntity {
    static _graphicsMode = "fast";

    static _factor = 1;

    static onChangeGraphicsMode = (value) => {
        BaseEntity._graphicsMode = value;
        if (value === "fast") {
            BaseEntity._factor = 1;
        } else if (value === "medium") {
            BaseEntity._factor = 1.2;
        } else if (value === "slow") {
            BaseEntity._factor = 1.5;
        }
    };

    constructor(entity, data, board, events) {
        this._type = entity.type;
        this._action = entity.initialAction;
        this._events = events;
        this._direction = entity.initialDirection;
        this._baseVelocity = {...data.baseVelocity };
        this._cell = {...data.cell };
        this._id = data.id;
        this._decorationsId = data.decorationsId;
        this._velocity = {...data.initialVelocity };
        this._position = { x: 0, y: 0 };
        this._size = { width: 0, height: 0 };
        this._lastPosition = { x: 0, y: 0 };
        this._lastAction = null;
        this._lastVelocity = { x: 0, y: 0 };
        this._currentFrameAnimation = 0;
        this._lastFrameAnimation = null;
        this._lastUpdatedTime = null;
        this._updateInterval = data.initialUpdateInterval ?
            data.initialUpdateInterval :
            entity.updateInterval;
        this._entity = entity;
        this._board = board;
        this._drawOptions = {...data.options };
        this._decorations = [];
        this._isLoaded = false;
        this._correct = false;

        this._onLoad(data.position);
    }

    get size() {
        return this._size;
    }

    get position() {
        return this._position;
    }

    get velocity() {
        return this._velocity;
    }

    get baseVelocity() {
        return this._baseVelocity;
    }

    get board() {
        return this._board;
    }

    _onLoad = (position) => {
        const animation = this._entity.animations[this._action][this._direction];
        this._calcEntitySize(animation);
        this._calcEntityPosition();
        const { x, y } = this._getPositionCorrections(animation);
        if (position && position.x) {
            this._position.x = position.x + x;
            this._lastPosition.x = this._position.x;
        }
        if (position && position.y) {
            this._position.y = position.y + y;
            this._lastPosition.y = this._position.y;
        }
        this._isLoaded = true;

        this._events.app.on("resized", this.onResize);
        this._events.app.emit("entity-created", {
            id: this._id,
            decorationsId: this._decorationsId,
        });
        this._drawEntity(animation);
    };

    onResize = () => {
        const animation = this._entity.animations[this._action][this._direction];
        this._clearEntity();
        this._calcEntitySize(animation);
        this._calcEntityPosition();
        this._drawEntity(animation);
    };

    _calcEntitySize = (animation) => {
        const options = this._drawOptions;

        let heightProportion = 1;
        if (options && options.heightProportion) {
            heightProportion = options.heightProportion;
        }

        if (animation.heightProportion) {
            heightProportion *= animation.heightProportion;
        }

        const originalProportion = animation.width / animation.height;

        if (options && options.fillCell) {
            this._size.width = Math.floor(
                this._board.cellsWidth * originalProportion * heightProportion
            );
            this._size.height = Math.floor(
                this._board.cellsHeight * heightProportion
            );
            return;
        }

        this._size.width = Math.floor(
            this._board.cellsHeight * originalProportion * heightProportion
        );
        this._size.height = Math.floor(this._board.cellsHeight * heightProportion);
    };

    _getPositionCorrections = (animation) => {
        const options = this._drawOptions;
        let centralizedInColCorrection = 0;
        let centralizedInRowCorrection = 0;
        let relativeX = 0;
        let relativeY = 0;
        if (options && options.relativeX) {
            relativeX = this._size.width * options.relativeX;
        }
        if (options && options.relativeY) {
            relativeY = this._size.height * options.relativeY;
        }
        if (options && options.centralizedInCol) {
            centralizedInColCorrection =
                (this._board.cellsWidth - this._size.width) / 2;
        }
        if (options && options.centralizedInRow) {
            centralizedInRowCorrection =
                (this._board.cellsHeight - this._size.height) / 2;
        }

        if (animation && animation.relX) {
            relativeX += animation.relX * this._size.width;
        }
        if (animation && animation.relY) {
            relativeY += animation.relY * this._size.height;
        }
        return {
            x: centralizedInColCorrection + relativeX,
            y: centralizedInRowCorrection + relativeY,
        };
    };

    _calcEntityPosition = () => {
        const { x, y } = this._getPositionCorrections();
        this._position.x = Math.floor(this._cell.x * this._board.cellsWidth + x);
        this._position.y = Math.floor(this._cell.y * this._board.cellsHeight + y);
        this._lastPosition.x = this._position.x;
        this._lastPosition.y = this._position.y;
    };

    _clearEntity = () => {
        const data = {
            id: this._id,
            position: this._position,
            size: this._size,
        };
        this._events.app.emit("clear-entity", data);
    };

    _drawEntity = (animation) => {
        if (!this._isLoaded) return;
        const frames = animation.frames;

        this._lastFrameAnimation = this._currentFrameAnimation;
        if (frames.length - 1 <= this._currentFrameAnimation) {
            this._currentFrameAnimation = 0;
        } else if (frames.length - 1 > this._currentFrameAnimation) {
            this._currentFrameAnimation += 1;
        }
        const frame = frames[this._currentFrameAnimation];

        const data = {
            id: this._id,
            animation,
            frame,
            position: this._position,
            size: this._size,
        };
        this._events.app.emit("draw-entity", data);
    };

    remove = () => {
        this._events.app.emit("remove-entity", this._id);
    };

    _update = (currentTime) => {
        if (!this._lastUpdatedTime) this._lastUpdatedTime = currentTime;

        const animation = this._entity.animations[this._action][this._direction];

        if (
            currentTime - this._lastUpdatedTime >
            BaseEntity._factor * this._updateInterval
        ) {
            this._lastUpdatedTime = currentTime;
            if (
                this._velocity.x === 0 &&
                this._velocity.y === 0 &&
                this._lastDirection === this._direction &&
                this._lastAction === this._action &&
                this._lastFrameAnimation === this._currentFrameAnimation
            ) {
                if (BaseEntity._graphicsMode === "fast")
                    this._updateDecoration(currentTime);
                return;
            }
            this._clearEntity();

            this._lastPosition.x = this._position.x;
            this._lastPosition.y = this._position.y;
            this._position.x =
                this._position.x + BaseEntity._factor * this._velocity.x;
            this._position.y =
                this._position.y + BaseEntity._factor * this._velocity.y;

            this._cell.y = Math.floor(this._position.y / this._board.cellsHeight);
            this._cell.x = Math.round(this._position.x / this._board.cellsWidth);
            this._drawEntity(animation);
            if (this._correct) {
                this._correctGlitch();
            }
        }
        if (BaseEntity._graphicsMode === "fast")
            this._updateDecoration(currentTime);
    };

    _updateDecoration = (currentTime) => {
        this._decorations.forEach((decoration) => {
            decoration.update(currentTime, this._position);
        });

        this._decorations = [
            ...this._decorations.filter(
                (decoration) =>
                !decoration.isFinished || decoration.action === this._action
            ),
        ];
    };

    _addDecoration = () => {
        const decoration = this._entity.animations[this._action].decoration;
        if (!decoration) return;

        const data = {
            id: this._decorationsId,
            position: this._position,
            size: this._size,
            action: this._action,
            updateInterval: this._entity.updateIntervalDecorations,
        };
        this._decorations.push(
            new Decoration(decoration, data, this._board, this._events)
        );
    };

    _removeDecoration = () => {
        this._decorations = [
            ...this._decorations.filter(
                (decoration) =>
                decoration.action === this._action ||
                decoration.action === "beingAttacked"
            ),
        ];
    };

    _changeAction = (newAction, newVelocity) => {
        this._lastAction = this._action;
        this._lastVelocity.x = this._velocity.x;
        this._lastVelocity.y = this._velocity.y;
        this._action = newAction;
        this._velocity.x = newVelocity.x;
        this._velocity.y = newVelocity.y;
        if (BaseEntity._graphicsMode === "fast") this._addDecoration();
    };

    _changeDirection = (direction) => {
        this._direction = direction;
    };

    updateBaseVelocity = ({ x, y }) => {
        this._baseVelocity.x += x;
        this._baseVelocity.y += y;
    };

    updateVelocity = ({ x, y }) => {
        this._velocity.x = x;
        this._velocity.y = y;
    };

    _clearDecoration = () => {
        this._decorations.forEach((decoration) => decoration._clearDecoration());
    };

    increaseUpdateIntervalPorcent = (value) => {
        this._updateInterval = Math.round(this._updateInterval * (1 - value));
        return this._updateInterval;
    };
}