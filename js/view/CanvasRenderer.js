import { map } from "../constants/background.js";

export default class CanvasRenderer {
    constructor({ appEvents, CONSTANTS }) {
        this._appEvents = appEvents;

        this._boardArea = CONSTANTS.GAME_DIV;

        this._grid = document.getElementById("grid");
        this._background = document.getElementById("background");

        this._entities = new Map();
        this._decorations = new Map();

        this._entitiesCached = new Map();

        this._board = {
            width: 0,
            height: 0,
            cols: CONSTANTS.BOARD_COLS,
            rows: CONSTANTS.BOARD_ROWS,
            cellsWidth: 0,
            cellsHeight: 0,
        };

        this._addEventsListener();
    }

    get board() {
        return this._board;
    }

    _addEventsListener = () => {
        const events = [
            { ev: "entity-created", cb: this._entityCreated },
            { ev: "draw-entity", cb: this._draw },
            { ev: "clear-entity", cb: this._clear },
            { ev: "remove-entity", cb: this._remove },
            { ev: "draw-health-bar", cb: this._drawHealthBar },
            { ev: "clear-health-bar", cb: this._clearHealthBar },
        ];
        events.forEach((event) => this._appEvents.on(event.ev, event.cb));
    };

    calcSize = () => {
        const height = this._boardArea.clientHeight;
        const width = this._boardArea.clientWidth;
        const cellsHeight = Math.floor((height - 30) / this._board.rows);
        const cellsWidth = Math.floor((width - 30) / this._board.cols);

        this._grid.width = width;
        this._grid.height = height;

        this._background.width = width;
        this._background.height = height;

        this._entities.forEach((entity) => {
            const canvas = document.getElementById(entity);
            if (!canvas) {
                return;
            }
            canvas.width = width;
            canvas.height = height;
        });
        this._decorations.forEach((decoration) => {
            const canvas = decoration.canvas;
            canvas.width = width;
            canvas.height = height;
        });
        this._board.width = width;
        this._board.height = height;
        this._board.cellsWidth = cellsWidth;
        this._board.cellsHeight = cellsHeight;
    };

    onResize = () => {
        if (this._appEvents.has("resized")) {
            this._grid
                .getContext("2d")
                .clearRect(0, 0, this._board.width, this._board.height);
            this.calcSize();

            //this.drawGrid();

            this._entitiesCached.clear();
            this._appEvents.emit("resized", this._board);
        }
    };

    drawGrid = () => {
        const ctx = this._grid.getContext("2d");
        ctx.beginPath();
        for (let x = 0; x <= this._board.cols; x += 1) {
            ctx.moveTo(x * this._board.cellsWidth, 0);
            ctx.lineTo(x * this._board.cellsWidth, this._board.height);
        }
        for (let y = 0; y <= this._board.rows; y += 1) {
            ctx.moveTo(0, y * this._board.cellsHeight);
            ctx.lineTo(this._board.width, y * this._board.cellsHeight);
        }
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1;
        ctx.stroke();
    };

    _entityCreated = ({ id, decorationsId }) => {
        const entityCanvas = document.createElement("canvas");
        entityCanvas.setAttribute("id", id);
        entityCanvas.setAttribute("data-decorations", decorationsId);
        entityCanvas.setAttribute("width", this._board.width);
        entityCanvas.setAttribute("height", this._board.height);
        this._boardArea.appendChild(entityCanvas);
        this._entities.set(id, {
            canvas: entityCanvas,
            decorationsId,
            ctx: entityCanvas.getContext("2d"),
        });
        if (!this._decorations.has(decorationsId)) {
            const decorationsCanvas = document.getElementById(decorationsId);
            decorationsCanvas.width = this._board.width;
            decorationsCanvas.height = this._board.height;

            this._decorations.set(decorationsId, {
                canvas: decorationsCanvas,
                ctx: decorationsCanvas.getContext("2d"),
            });
        }
    };

    _clear = ({ id, position, size, isDecoration = false }) => {
        let ctx = null;
        if (!isDecoration) {
            if (this._entities.has(id)) ctx = this._entities.get(id).ctx;
        } else {
            if (this._decorations.has(id)) ctx = this._decorations.get(id).ctx;
        }

        if (ctx) ctx.clearRect(position.x, position.y, size.width, size.height);
    };

    _draw = ({ id, animation, frame, position, size, isDecoration = false }) => {
        let destCtx = null;
        if (!isDecoration) {
            if (this._entities.has(id)) destCtx = this._entities.get(id).ctx;
        } else {
            if (this._decorations.has(id)) destCtx = this._decorations.get(id).ctx;
        }

        const cacheId = `${animation.img.src}-cache-${frame[0]}-${frame[1]}-${size.width}-${size.height}`;
        if (!this._entitiesCached.has(cacheId)) {
            const srcCanvas = document.createElement("canvas");
            srcCanvas.setAttribute("id", cacheId);
            srcCanvas.setAttribute("width", size.width);
            srcCanvas.setAttribute("height", size.height);

            const ctx = srcCanvas.getContext("2d");
            ctx.drawImage(
                animation.img,
                frame[0],
                frame[1],
                animation.width,
                animation.height,
                0,
                0,
                size.width,
                size.height
            );

            if (destCtx) destCtx.drawImage(srcCanvas, position.x, position.y);
        } else {
            const cached = this._entitiesCached.get(cacheId);
            if (destCtx) destCtx.drawImage(cached, position.x, position.y);
        }
    };

    _remove = (id) => {
        const canvas = document.getElementById(id);
        canvas.remove();
        this._entities.delete(id);
    };

    _drawHealthBar = ({ id, healthPercent, width, position }) => {
        const barWidth = Math.floor(healthPercent * width);
        const decorationsId = this._entities.get(id).decorationsId;
        this._decorations.get(decorationsId).ctx.fillStyle =
            this._getHealthBarColor(healthPercent);
        this._decorations
            .get(decorationsId)
            .ctx.fillRect(position.x, position.y - 3, barWidth, 5);
    };

    _clearHealthBar = ({ id, position, width }) => {
        const decorationsId = this._entities.get(id).decorationsId;
        this._decorations
            .get(decorationsId)
            .ctx.clearRect(position.x - 2, position.y - 3 - 2, width + 2, 5 + 2);
    };

    _getHealthBarColor = (healthPercent) => {
        if (healthPercent >= 0.5) {
            return "green";
        } else if (healthPercent < 0.5 && healthPercent > 0.3) {
            return "yellow";
        } else {
            return "red";
        }
    };

    clearGameArea = () => {
        this._entities.forEach((entity) => {
            entity.canvas.remove();
        });
        this._decorations.forEach((decoration) => {
            decoration.ctx.clearRect(0, 0, this._board.width, this._board.height);
        });
    };
}