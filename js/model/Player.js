import Wall from "./entities/Wall.js";
import Hero from "./entities/Hero.js";

export default class Player {
    constructor({ friends, bullets, playerStats, board, events }) {
        this._events = events;
        this._board = board;
        this._playerStats = {...playerStats };
        this._Hero = this._initializeHero(friends.hero, bullets.hero_bullet);
        this._wallsList = this._initializeWalls(friends.wall, board.rows);
        this._addEventsListener();
    }

    _addEventsListener = () => {
        const gameEvents = [{
                ev: "increaseHeroBulletRate",
                cb: this._increaseHeroShootRatePercent,
            },
            {
                ev: "increaseHeroBulletDamage",
                cb: this._increaseHeroShootDamagePercent,
            },
            {
                ev: "increaseHeroVelocity",
                cb: this._increaseHeroVelocityPorcent,
            },
            {
                ev: "increaseWallMaxHealth",
                cb: this._increaseWallMaxHealthPercent,
            },
            {
                ev: "coin-collected",
                cb: this._increaseGoldCount,
            },
        ];
        gameEvents.forEach((event) => this._events.game.on(event.ev, event.cb));
    };

    _initializeHero = (hero, bullet) => {
        const data = {
            hero,
            bullet,
            board: this._board,
            events: this._events,
            playerStats: this._playerStats,
        };
        return Hero.create(data);
    };

    _initializeWalls = (wall, quantity) => {
        Wall.setMaxHealth(this._playerStats.defense);
        const list = [];
        const data = {
            wall,
            number: 0,
            board: this._board,
            events: this._events,
        };
        list.push(Wall.create(data, 0));

        for (let n = 1; n < quantity + 1; n++) {
            const data = {
                wall,
                number: n,
                board: this._board,
                events: this._events,
            };
            list.push(Wall.create(data, 1));
        }

        return list;
    };

    update = (currentTime) => {
        this._Hero.update(currentTime);
        this._wallsList.forEach((wall) => wall.update(currentTime));
        this._Hero.updateBullets(currentTime);
        this._wallsList = this.liveWalls();
    };

    get wallsList() {
        return this._wallsList;
    }

    get bulletsList() {
        return this._Hero._bulletsList;
    }

    liveWalls = () => {
        return this._wallsList.filter((wall) => !wall.isDead());
    };

    collidableBullets = () => {
        return this._Hero._bulletsList.filter(
            (bullet) => !bullet.hasCollided() && !bullet.isOut()
        );
    };

    getPlayerStats() {
        return this._playerStats;
    }

    _increaseGoldCount = (value) => {
        this._playerStats.goldCount = value;
    };

    _increaseHeroShootRatePercent = (value) => {
        this._playerStats.shootRate = this._Hero.increaseShootRatePercent(value);
    };

    _increaseHeroShootDamagePercent = (value) => {
        this._playerStats.damage = this._Hero.increaseShootDamagePercent(value);
    };

    _increaseHeroVelocityPorcent = (value) => {
        this._playerStats.updateInterval =
            this._Hero.increaseUpdateIntervalPorcent(value);
        this._playerStats.velocity = Math.floor(
            (1000 * this._Hero.baseVelocity.y) / this._playerStats.updateInterval
        );
    };

    _increaseWallMaxHealthPercent = (value) => {
        Wall.setMaxHealth(Math.round(Wall.maxHealth * (1 + value)));
        this._playerStats.defense = Wall.maxHealth;
    };
}