import Player from "./Player.js";
import Level from "./Level.js";
import Collider from "../services/collider.js";
import EventEmitter from "../services/eventEmitter.js";
import BaseEntity from "./entities/BaseEntity.js";

export default class Game {
    static _fps = {
        sampleSize: 60,
        value: 0,
        _sample_: [],
        _index_: 0,
        _lastTick_: false,
        tick: function() {
            // if is first tick, just set tick timestamp and return
            if (!this._lastTick_) {
                this._lastTick_ = performance.now();
                return 0;
            }
            // calculate necessary values to obtain current tick FPS
            let now = performance.now();
            let delta = (now - this._lastTick_) / 1000;
            let fps = 1 / delta;
            // add to fps samples, current tick fps value
            this._sample_[this._index_] = Math.round(fps);

            // iterate samples to obtain the average
            let average = 0;
            for (let i = 0; i < this._sample_.length; i++)
                average += this._sample_[i];

            average = Math.round(average / this._sample_.length);

            // set new FPS
            this.value = average;
            // store current timestamp
            this._lastTick_ = now;
            // increase sample index counter, and reset it
            // to 0 if exceded maximum sampleSize limit
            this._index_++;
            if (this._index_ === this.sampleSize) this._index_ = 0;
            return this.value;
        },
    };

    static create = (data) => {
        return new Game(data);
    };

    constructor({ appEvents, CONSTANTS }) {
        this._events = {
            app: appEvents,
            game: new EventEmitter(),
        };
        this._appEvents = appEvents;
        this._board = null;
        this._lives = CONSTANTS.LIVES;
        this._levelNumber = 0;
        this._Level = null;
        this._Player = null;
        this._isPaused = false;
        this._hasFocus = true;
        this._entities = null;
        this._playerStats = null;
        this._loop = null;
        Game._fps.sampleSize = 120;
        this._graphicsMode = "fast";
        this._addEventsListener();
    }

    _addEventsListener = () => {
        const events = [
            { ev: "started-game-on-level", cb: this._startLevel },
            { ev: "window-blur", cb: () => (this._hasFocus = false) },
            { ev: "window-focus", cb: () => (this._hasFocus = true) },
            { ev: "drop-was-collected", cb: () => (this._isPaused = true) },
            { ev: "drop-modal-closed", cb: () => (this._isPaused = false) },
            { ev: "end-of-level", cb: () => (this._isPaused = true) },
            {
                ev: "level-is-ready",
                cb: () => {
                    this.gameLoop();
                    this._isPaused = false;
                },
            },
            { ev: "pause-modal-openned", cb: () => (this._isPaused = true) },
            { ev: "pause-modal-closed", cb: () => (this._isPaused = false) },
        ];

        events.forEach((event) => this._events.app.on(event.ev, event.cb));
    };

    _startLevel = (level) => {
        this._events.app.emit(
            "starting-level",
            level,
            this._lives,
            this._playerStats.goldCount
        );
        cancelAnimationFrame(this._loop);
        this._levelNumber = level;
        const playerStats = this._playerStats;
        const enemies = this._entities.get("enemies");
        const friends = this._entities.get("friends");
        const drops = this._entities.get("drops");
        const coins = this._entities.get("coins");
        const bullets = this._entities.get("bullets");
        const lives = this._lives;
        const board = this._board;
        const events = this._events;
        this._Player = new Player({ friends, bullets, playerStats, board, events });
        this._isPaused = true;
        this._Level = new Level({
            level,
            lives,
            enemies,
            bullets,
            drops,
            coins,
            board,
            events,
        });
    };

    updatePlayerStats = (playerStats) => {
        this._playerStats = {...playerStats };
    };

    onEndLoadingAllData = (entities, board, playerStats) => {
        this._playerStats = {...playerStats };
        this._entities = entities;
        this._board = board;
    };

    gameLoop = () => {
        this._loop = window.requestAnimationFrame(this.gameLoop);

        if (this._isPaused || !this._hasFocus) return;

        const fpsValue = Game._fps.tick();
        // window.fps.innerHTML = `FPS: ${fpsValue}`;

        const currentTime = performance.now();
        if (fpsValue >= 40 && this._graphicsMode !== "fast") {
            this._graphicsMode = "fast";
            BaseEntity.onChangeGraphicsMode("fast");
            this._events.app.emit("changed-graphics-mode", "fast");
        }

        if (25 <= fpsValue && fpsValue < 40 && this._graphicsMode !== "medium") {
            this._graphicsMode = "medium";
            BaseEntity.onChangeGraphicsMode("medium");
            this._events.app.emit("changed-graphics-mode", "medium");
        }

        if (fpsValue < 25 && this._graphicsMode !== "slow") {
            this._graphicsMode = "slow";
            BaseEntity.onChangeGraphicsMode("slow");
            this._events.app.emit("changed-graphics-mode", "slow");
        }

        this._events.app.emit("update");
        this._Player.update(currentTime);
        this._Level.update(currentTime);
        this._checkCollisions();
        const levelEnded = this._Level.levelEnd();

        if (levelEnded) {
            this._playerStats = {...this._Player.getPlayerStats() };
            this._events.app.emit("end-of-level", {
                level: this._levelNumber,
                condition: levelEnded,
                playerStats: this._playerStats,
            });
            cancelAnimationFrame(this._loop);
        }
    };

    _checkCollisions = () => {
        Collider.detectCollision(
            this._Level.canMeleeAttackEnemies(),
            this._Player.liveWalls().reverse(),
            (enemy, wall) => {
                enemy.meleeAttack(wall);
            },
            true
        );

        Collider.detectCollision(
            this._Level.liveEnemies().reverse(),
            this._Player.collidableBullets(),
            (enemy, bullet) => {
                bullet.collide(enemy);
            },
            true
        );

        Collider.detectCollision(
            this._Player.liveWalls().reverse(),
            this._Level.collidableBullets(),
            (wall, bullet) => {
                bullet.collide(wall);
            },
            true
        );

        this._Level.rangedEnemies().forEach((enemy) => {
            const found = this._Player
                .liveWalls()
                .filter(
                    (wall) =>
                    enemy._cell.x - enemy._shootDistance <= wall._cell.x &&
                    enemy._cell.y === wall._cell.y
                );
            if (found.length > 0) {
                enemy.rangeAttack(found[0]);
            }
        });
    };
}