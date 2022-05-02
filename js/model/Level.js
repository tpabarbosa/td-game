import { levels } from "../constants/levels.js";
import Enemy from "./entities/Enemy.js";
import Drop from "./entities/Drop.js";
import Coin from "./entities/Coin.js";

export default class Level {
    constructor({ level, lives, enemies, bullets, drops, coins, board, events }) {
        this._board = board;
        this._events = events;
        this._enemies = enemies;
        this._bullets = bullets;
        this._drops = drops;
        this._coins = coins;
        this._lives = lives;
        this._currentLevel = level;
        this._level = levels[level];
        this._currentPhase = 0;
        this._phase = this._level[0];
        this._dropsCountInCurrentPhase = 0;
        this._enemiesCountInCurrentPhase = 0;
        this._goldCount = 0;
        this._enemiesList = [];
        this._dropsList = [];
        this._coinsList = [];
        this._nextEnemyInterval = 300;
        this._lastEnemyTime = 1;
        this._addEventsListener();
    }

    _addEventsListener = () => {
        const appEvents = [
            { ev: "mouse-down", cb: this.checkDropCollect },
            { ev: "touch-start", cb: this.checkDropCollect },
        ];
        appEvents.forEach((event) => this._events.app.on(event.ev, event.cb));
    };

    update = (currentTime) => {
        this._createEnemy(currentTime);
        this._updateEnemies(currentTime);
        this._updateDrops(currentTime);
        this._updateCoins(currentTime);
        this._updateLevelStatus();
    };

    _createEnemy = (currentTime) => {
        if (this._currentPhase === this._level.length) return;

        if (currentTime - this._lastEnemyTime <= this._nextEnemyInterval) {
            return;
        }
        this._enemiesList.push(this._initializaNewEnemy());
        this._lastEnemyTime = currentTime;
        this._enemiesCountInCurrentPhase += 1;
        this._nextEnemyInterval = Enemy.nextEnemyTimer(this._phase.type);
    };

    _initializaNewEnemy = () => {
        const randomType = Math.floor(
            Math.random() * this._phase.enemiesAllowed.length
        );
        const type = this._phase.enemiesAllowed[randomType];
        const enemy = this._enemies[type];
        const bullets = this._bullets;
        const data = {
            enemy,
            bullets,
            board: this._board,
            events: this._events,
            isBoss: this._phase.type === "boss" ? true : false,
            level: this._currentLevel,
        };
        return Enemy.create(data);
    };

    _updateEnemies = (currentTime) => {
        this._enemiesList.forEach((enemy) => {
            if (enemy.isDead()) {
                const dropped = this._enemyDropBonus(enemy);
                if (!dropped) this._enemyDropCoin(enemy);
            }

            enemy.updateEnemy(currentTime);
            if (enemy.hasRangeAttack()) {
                enemy.updateBullets(currentTime);
            }

            this._checkLifeLost(enemy);
        });
        this._enemiesList = this.liveEnemies();
    };

    _enemyDropBonus = (enemy) => {
        if (this._currentPhase === this._level.length) return false;
        if (this._dropsCountInCurrentPhase >= this._phase.drops) return false;

        const probabilityToDrop =
            0.6 * (1 - this._dropsCountInCurrentPhase / this._phase.drops);
        if (Math.random() > probabilityToDrop) return;

        this._dropsCountInCurrentPhase += 1;
        this._dropsList.push(this._initializeDrop(enemy));
        this._events.app.emit("released-bonus", "chest");
        return true;
    };

    _initializeDrop = (enemy) => {
        const randomType = Math.floor(
            Math.random() * this._phase.dropsAllowed.length
        );
        const type = this._phase.dropsAllowed[randomType];
        const drop = this._drops[type];
        const y = enemy.isBoss ?
            enemy.position.y + this._board.cellsHeight :
            enemy.position.y;
        const data = {
            drop,
            position: { x: enemy.position.x, y },
            board: this._board,
            events: this._events,
        };
        return Drop.create(data);
    };

    _enemyDropCoin = (enemy) => {
        const cumulativeProbabilities = Coin.cumulativeProbabilities;
        const random = Math.random();
        let type = "";
        if (random <= cumulativeProbabilities.get("copper")) {
            type = "copper";
        } else if (
            random > cumulativeProbabilities.get("copper") &&
            random <= cumulativeProbabilities.get("silver")
        ) {
            type = "silver";
        } else {
            type = "gold";
        }
        this._coinsList.push(this._initializeCoin(enemy, type));
        this._events.app.emit("released-bonus", "coin");
    };

    _initializeCoin = (enemy, type) => {
        const coin = this._coins[type];
        const data = {
            coin,
            position: { x: enemy.position.x, y: enemy.position.y },
            board: this._board,
            events: this._events,
            isDroppedByBoss: enemy.isBoss,
        };
        return Coin.create(data);
    };

    _checkLifeLost = (enemy) => {
        if (enemy.position.x <= 0 - enemy._size.width) {
            const lostLives = enemy.isBoss ? 3 : 1;
            this._lives -= lostLives;
            if (this._lives <= 0) this._lives = 0;
            this._events.app.emit("lost-a-life", this._lives);
            enemy.remove();
        }
    };

    _updateDrops = (currentTime) => {
        this._dropsList.forEach((drop) => drop.updateDrop(currentTime));
        this._dropsList = this._liveDrops();
    };

    _updateCoins = (currentTime) => {
        this._coinsList.forEach((coin) => {
            coin.updateCoin(currentTime);
            if (coin.isCollected()) {
                this._goldCount += coin.value;
                this._events.app.emit("coin-collected", this._goldCount);
                this._events.game.emit("coin-collected", this._goldCount);
            }
        });
        this._coinsList = this._notCollectedCoins();
    };

    _updateLevelStatus = () => {
        if (this._currentPhase === this._level.length) return;
        if (this._enemiesCountInCurrentPhase === this._phase.enemies) {
            this._currentPhase += 1;
            this._nextEnemyInterval += 800;
            this._phase = this._level[this._currentPhase];
            this._enemiesCountInCurrentPhase = 0;
            this._dropsCountInCurrentPhase = 0;
        }
    };

    levelEnd = () => {
        if (this._lives <= 0) {
            return "lost";
        }
        if (
            this._enemiesList.length === 0 &&
            this._currentPhase === this._level.length
        ) {
            return "win";
        }
        return false;
    };

    checkDropCollect = (clientX, clientY) => {
        let collected = false;
        this._dropsList.forEach((drop) => {
            if (!collected) {
                collected = drop.onClick(clientX, clientY);
                if (collected) {
                    drop.collect();
                    this._events.app.emit("drop-was-collected", drop);
                    this._events.game.emit(drop.type, drop.value);
                }
            }
        });
        this._dropsList = this._liveDrops();
    };

    get enemiesList() {
        return this._enemiesList;
    }

    canMeleeAttackEnemies = () => {
        return this._enemiesList.filter(
            (enemy) =>
            enemy.hasMeleeAttack() &&
            !enemy.isMeleeAttacking() &&
            enemy._cell.x <= 2
        );
    };

    liveEnemies = () => {
        return this._enemiesList.filter(
            (enemy) => enemy.position.x > 0 - enemy.size.width && !enemy.isDead()
        );
    };

    rangedEnemies = () => {
        return this._enemiesList.filter(
            (enemy) =>
            enemy.hasRangeAttack() &&
            !enemy.isRangeAttacking() &&
            enemy._cell.x <= enemy._shootDistance + 1
        );
    };

    _liveDrops = () => {
        return this._dropsList.filter((drop) => !drop.isDead());
    };

    _notCollectedCoins = () => {
        return this._coinsList.filter((coin) => !coin.isCollected());
    };

    collidableBullets = () => {
        let bullets = [];
        this.rangedEnemies().forEach((enemy) => {
            bullets = [...bullets, ...enemy.getBullets()];
        });
        return bullets;
    };

    bossesEnemies = () => {
        return this._enemiesList.filter((enemy) => enemy.isBoss);
    };
}