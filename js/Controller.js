import imagesLoader from "./services/Loaders/imagesLoader.js";
import entitiesLoader from "./services/Loaders/entitiesLoader.js";
import audiosLoader from "./services/Loaders/audiosLoader.js";

export default class Controller {
    static create = (data) => {
        return new Controller(data);
    };
    constructor({ appEvents, view, game, CONSTANTS }) {
        this._appEvents = appEvents;
        this._LEVELS = CONSTANTS.LEVELS;
        this._View = view;
        this._Game = game;
        this._audios = null;
        this._images = null;
        this._entities = null;
        this._gameProgress = null;
        this._onLoad();
    }

    _onLoad = () => {
        this._addEventListeners();
        this._View.onLoad();
    };

    _addEventListeners = () => {
        const events = [
            { ev: "end-loading-view", cb: this._startLoadingAssets },
            { ev: "audios-loaded", cb: this._onEndLoadingAudios },
            { ev: "images-loaded", cb: this._onEndLoadingImages },
            { ev: "entities-loaded", cb: this._onEndLoadingAssets },
            { ev: "reset-game", cb: this._onResetGame },
            { ev: "end-of-level", cb: this._updateProgress },
        ];
        events.forEach((event) => this._appEvents.on(event.ev, event.cb));
        window.onresize = this._View.onResize;
        window.onkeydown = this._onKeyDown;
        window.onkeyup = this._onKeyUp;
        window.onblur = this._onBlur;
        window.onfocus = this._onFocus;
    };

    _startLoadingAssets = () => {
        this._View.onStartLoadingSomeData("Carregando Efeitos Sonoros...");
        audiosLoader(this._appEvents);
    };

    _onEndLoadingAudios = (audios) => {
        this._View.onStartLoadingSomeData("Carregando Imagens...");
        this._audios = audios;
        imagesLoader(this._appEvents);
    };

    _onEndLoadingImages = (images) => {
        this._View.onStartLoadingSomeData("Carregando Personagens...");
        this._images = images;
        entitiesLoader(images, this._appEvents);
    };

    _onEndLoadingAssets = (entities) => {
        const playerStats = this._playerStats(entities);
        this._entities = entities;
        this._View.onEndLoadingAllData(
            this._images,
            this._audios,
            this._gameProgress
        );
        this._Game.onEndLoadingAllData(entities, this._View.board, playerStats);
    };

    _playerStats = (entities) => {
        let progress = localStorage.getItem("gameProgress");
        if (progress) {
            this._gameProgress = JSON.parse(progress);
            return this._gameProgress.playerStats;
        }

        const playerStats = {
            goldCount: 0,
            damage: entities.get("bullets").hero_bullet.meleeAttack.attackDamage,
            shootRate: entities.get("friends").hero.rangeAttack.shootRate,
            velocity: Math.floor(
                (1000 * entities.get("friends").hero.baseVelY) /
                entities.get("friends").hero.updateInterval
            ),
            defense: entities.get("friends").wall.health.maxHealth,
            updateInterval: entities.get("friends").hero.updateInterval,
        };

        progress = {};
        progress.unlockedLevels = 1;
        progress.playerStats = playerStats;
        this._gameProgress = progress;
        localStorage.setItem("gameProgress", JSON.stringify(progress));

        return playerStats;
    };

    _updateProgress = ({ playerStats, level }) => {
        if (level < this._LEVELS && this._gameProgress.unlockedLevels < level + 1) {
            this._gameProgress.unlockedLevels = level + 1;
        }
        this._gameProgress.playerStats = {...playerStats };
        localStorage.setItem("gameProgress", JSON.stringify(this._gameProgress));
    };

    _onResetGame = () => {
        localStorage.removeItem("gameProgress");
        const playerStats = this._playerStats(this._entities);
        this._View.updatePlayerStats(playerStats);
        this._Game.updatePlayerStats(playerStats);
    };

    _onKeyDown = (event) => {
        this._appEvents.emit("key-down", event.key);
    };

    _onKeyUp = (event) => {
        this._appEvents.emit("key-up", event.key);
    };

    _onBlur = (event) => {
        this._appEvents.emit("window-blur");
    };

    _onFocus = (event) => {
        this._appEvents.emit("window-focus");
    };
}