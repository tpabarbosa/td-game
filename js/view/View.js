import Modal from "./Modal.js";

export default class View {
    static create = (data) => {
        return new View(data);
    };

    constructor({ appEvents, CONSTANTS, audioPlayer, canvasRenderer }) {
        this._appEvents = appEvents;
        this._audioPlayer = audioPlayer;
        this._renderer = canvasRenderer;

        this._LEVELS = CONSTANTS.LEVELS;
        this._LIVES = CONSTANTS.LIVES;
        this._boardArea = CONSTANTS.GAME_DIV;

        this._images = [];

        this._loadingScreen = {
            screen: document.getElementById("loading-screen"),
            startBtn: document.getElementById("loading-start-button"),
            text: document.getElementById("loading-text"),
        };

        this._menuScreen = {
            screen: document.getElementById("menu-screen"),
            restartBtn: document.getElementById("menu-reset-button"),
            damageData: document.getElementById("stat-damage"),
            velocityData: document.getElementById("stat-velocity"),
            defenseData: document.getElementById("stat-defense"),
            shootRateData: document.getElementById("stat-shoot-rate"),
            levelsBtn: [],
        };

        this._topBar = {
            questionBtn: document.getElementById("game-help"),
            pauseBtn: document.getElementById("game-pause"),
            toggleMusic: document.getElementById("toggle-music"),
            musicOff: document.getElementById("music-off"),
            toggleSfx: document.getElementById("toggle-sfx"),
            sfxOff: document.getElementById("sfx-off"),
            heartsCounter: document.getElementById("hearts-counter"),
            levelCounter: document.getElementById("level-counter"),
            hearts: document.getElementsByClassName("heart"),
            levelCount: document.getElementById("level-count"),
            goldCount: document.getElementById("gold-count"),
        };

        this._gameScreen = {
            screen: document.getElementById("game-screen"),
            skyX: -530,
            skyY: 34.5,
            cloudsX: 20,
            cloudsY: 0,
            gameClouds: document.getElementById("clouds"),
            gameSky: document.getElementById("game-sky"),
        };

        this._isPaused = true;
        this._canPlayMusic = true;
        this._canPlaySfx = true;
        this._currentScreen = "loading";
        this._graphicsMode = "fast";
    }

    get board() {
        return this._renderer.board;
    }

    onLoad = () => {
        this.onStartLoadingSomeData("Iniciando...");
        this._addEventsListener();
        this._loadMenuScreenLevelsBtn();
        this._gameScreen.screen.classList.remove("hidden");
        this._renderer.calcSize();
        this._gameScreen.screen.classList.add("hidden");
        this._appEvents.emit("end-loading-view");
        this._menuScreen.restartBtn.onclick = this._onResetGame;
        this._topBar.toggleMusic.onclick = () => {
            this._playSfx("button_clicked");
            this._topBar.musicOff.classList.toggle("hidden");
            this._canPlayMusic = !this._canPlayMusic;
            this._audioPlayer.setShouldPlayMusic(this._canPlayMusic);
        };
        this._topBar.toggleSfx.onclick = () => {
            this._playSfx("button_clicked");
            this._topBar.sfxOff.classList.toggle("hidden");
            this._canPlaySfx = !this._canPlaySfx;
            this._audioPlayer.setShouldPlaySfx(this._canPlaySfx);
            if (this._isPaused && this._currentScreen === "game") {
                this._playSfx("game_paused", { loop: true });
            }
        };
        this._topBar.pauseBtn.onclick = () => {
            this._playSfx("button_clicked");
            if (!this._isPaused && this._currentScreen === "game") {
                this._onPause();
            } else if (this._isPaused && this._currentScreen === "game") {
                this._onResume();
            }
        };
        this._topBar.questionBtn.onclick = () => {
            this._playSfx("button_clicked");

            this._showHelpModal();
        };
    };

    _addEventsListener = () => {
        const events = [
            { ev: "window-blur", cb: this._onBlur },
            {
                ev: "window-focus",
                cb: this._onFocus,
            },
            { ev: "update", cb: this._onUpdate },
            { ev: "changed-graphics-mode", cb: this._onChangeGraphicsMode },
            { ev: "drop-was-collected", cb: this._onDropCollected },
            { ev: "lost-a-life", cb: this._updateLifeData },
            { ev: "end-of-level", cb: this._onLevelEnd },
            { ev: "starting-level", cb: this._prepareLevel },
            {
                ev: "released-bonus",
                cb: (type) => this._playSfx(`${type}_released`),
            },
            {
                ev: "received-damage",
                cb: this._receivedDamage,
            },
            {
                ev: "hero-moving",
                cb: () => this._playSfx("hero_moving"),
            },
            {
                ev: "hero-stop-moving",
                cb: () => this._pauseSfx("hero_moving"),
            },
            {
                ev: "bullet-fired",
                cb: this._bulletFired,
            },
            { ev: "coin-collected", cb: this._updateGoldData },
            { ev: "died", cb: this._died },
        ];
        events.forEach((event) => this._appEvents.on(event.ev, event.cb));
        this._boardArea.onmousedown = this._onMouseDown;
        this._boardArea.onmouseup = this._onMouseUp;
        this._boardArea.ontouchstart = this._onTouchStart;
        this._boardArea.ontouchend = this._onTouchEnd;
    };

    _loadMenuScreenLevelsBtn = () => {
        for (let x = 1; x <= this._LEVELS; x++) {
            this._menuScreen.levelsBtn.push(document.getElementById(`level${x}`));
            this._menuScreen.levelsBtn[x - 1].onclick = () => {
                this._playSfx("button_clicked");
                this._menuScreen.screen.classList.toggle("hidden");
                this._gameScreen.screen.classList.toggle("hidden");
                this._topBar.questionBtn.classList.add("hidden");
                this._currentScreen = "game";
                //this._renderer.drawBackground(this._images);
                //this._renderer.drawGrid();
                this._appEvents.emit("started-game-on-level", x);

                const text = `Iniciando o nível ${x}`;
                Modal.create(text, null, null, {
                    text: "Ok",
                    cb: () => {
                        this._playSfx("button_clicked");
                        this._topBar.questionBtn.classList.remove("hidden");
                        this._topBar.pauseBtn.classList.remove("hidden");
                        this._topBar.levelCounter.classList.remove("hidden");
                        this._topBar.heartsCounter.classList.remove("hidden");
                        this._audioPlayer.setShouldPlayMusic(this._canPlayMusic);
                        this._audioPlayer.changeMusicTo("playing");
                        this._audioPlayer.playMusic();
                        this._appEvents.emit("level-is-ready", x);
                        this._pauseSfx("game_paused");
                        this._isPaused = false;
                    },
                });
                this._playSfx("game_paused", { loop: true });
                this._isPaused = true;
            };
        }
    };

    _onMouseDown = (event) => {
        event.preventDefault();
        this._appEvents.emit("mouse-down", event.offsetX, event.offsetY);
    };

    _onMouseUp = (event) => {
        event.preventDefault();
        this._appEvents.emit("mouse-up");
    };

    _onTouchStart = (event) => {
        event.preventDefault();
        const br = this._boardArea.getBoundingClientRect();
        const clientX = event.changedTouches[0].clientX - br.left;
        const clientY = event.changedTouches[0].clientY - br.top;
        this._appEvents.emit("touch-start", clientX, clientY);
    };

    _onTouchEnd = (event) => {
        event.preventDefault();
        this._appEvents.emit("touch-end");
    };

    onEndLoadingAllData = (images, audios, gameProgress) => {
        this._images = images;
        this._audioPlayer.setAudios(audios);
        this._loadingScreen.text.innerText = "Tudo pronto para começar";
        this._loadingScreen.startBtn.onclick = () => {
            this._playSfx("button_clicked");
            this._loadingScreen.screen.classList.toggle("hidden");
            this._menuScreen.screen.classList.toggle("hidden");
            this._menuScreen.levelsBtn[0].focus();
            this._currentScreen = "menu";
        };
        this._loadingScreen.startBtn.classList.toggle("invisible");
        this._loadingScreen.startBtn.focus();
        for (let i = 1; i <= gameProgress.unlockedLevels; i++) {
            this._unlockLevel(i);
        }
        this._updateMenuStats(gameProgress.playerStats);
    };

    onStartLoadingSomeData = (text) => {
        this._loadingScreen.text.innerText = text;
    };

    onResize = () => {
        this._renderer.onResize();
    };

    _onBlur = () => {
        if (!this._isPaused && this._currentScreen === "game") this._onPause();
        this._audioPlayer.setShouldPlayMusic(false);
        this._audioPlayer.pauseAllAudios();
    };

    _onFocus = () => {
        if (this._isPaused && this._currentScreen === "game") {
            this._playSfx("game_paused", { loop: true });
        } else if (this._currentScreen === "menu") {
            this._audioPlayer.setShouldPlayMusic(this._canPlayMusic);
            this._audioPlayer.playMusic();
        }
    };

    _showHelpModal = () => {
        if (this._currentScreen === "game") {
            this._topBar.pauseBtn.classList.add("hidden");
            this._playSfx("game_paused", { loop: true, pauseMusic: true });
            this._appEvents.emit("pause-modal-openned");
            this._isPaused = true;
        }

        const title = `Como Jogar`;
        const text = `<p>Utilize as setas para cima ou para baixo para movimentar a personagem.</p>
        <p>De maneira alternativa você também pode utilizar o mouse: clique e segure em algum ponto acima da personagem para ela se movimentar para cima, ou clique e segure em algum ponto abaixo da personagem para ela se movimentar para baixo.</p>
        <p>Alguns monstros liberam baús com bônus que melhoram o desempenho da personagem. Clique sobre eles para coletá-los enquanto estão ativos.</p>`;
        const image = null;
        const btn1 = {
            text: "Ok",
            cb: () => {
                this._playSfx("button_clicked");
                if (this._currentScreen === "game") this._onResume();
            },
        };

        Modal.create(title, image, text, btn1);
    };

    _onUpdate = () => {
        if (this._graphicsMode === "fast") {
            if (this._gameScreen.skyX < 380) {
                this._gameScreen.gameSky.style.backgroundPosition = `${this._gameScreen.skyX}% ${this._gameScreen.skyY}%`;
                //this._gameScreen.skyY -= 0.001;
                this._gameScreen.skyX += 0.08;
            }
            this._gameScreen.gameClouds.style.backgroundPosition = `${this._gameScreen.cloudsX}% ${this._gameScreen.cloudsY}%`;
            this._gameScreen.cloudsY += 0.01;
            this._gameScreen.cloudsX -= 0.05;
        }
    };

    _onPause = () => {
        this._topBar.pauseBtn.classList.add("hidden");
        this._playSfx("game_paused", { loop: true, pauseMusic: true });
        const text = "Jogo Pausado";
        const image = null;
        const btn1 = {
            text: "Continuar Jogando",
            cb: () => {
                this._playSfx("button_clicked");
                this._onResume();
            },
        };
        const btn2 = {
            text: "Voltar para o Menu",
            cb: () => {
                this._playSfx("button_clicked");
                this._audioPlayer.setShouldPlayMusic(this._canPlayMusic);
                this._audioPlayer.playMusic();
                this._menuScreen.screen.classList.toggle("hidden");
                this._gameScreen.screen.classList.toggle("hidden");
                this._currentScreen = "menu";
                this._topBar.pauseBtn.classList.add("hidden");
                this._topBar.levelCounter.classList.add("hidden");
                this._topBar.heartsCounter.classList.add("hidden");
                // this._appEvents.emit("pause-modal-closed");
                this._pauseSfx("game_paused");
                // this._isPaused = false;
            },
        };
        Modal.create(text, image, null, btn1, btn2);
        this._appEvents.emit("pause-modal-openned");
        this._isPaused = true;
    };

    _onResume = () => {
        Modal.modal.style.display = "";
        this._topBar.pauseBtn.classList.remove("hidden");
        this._audioPlayer.setShouldPlayMusic(this._canPlayMusic);
        this._audioPlayer.playMusic();
        this._appEvents.emit("pause-modal-closed");
        this._pauseSfx("game_paused");
        this._isPaused = false;
    };

    _onChangeGraphicsMode = (value) => {
        this._graphicsMode = value;
    };

    _onDropCollected = (drop) => {
        this._playSfx("game_paused", { loop: true, pauseMusic: true });
        const btn1 = {
            text: "Ok",
            cb: () => {
                this._playSfx("button_clicked");
                this._pauseSfx("game_paused");
                this._appEvents.emit("drop-modal-closed", drop);
            },
        };
        Modal.create(drop.text, drop.image, null, btn1);
    };

    _openEndLevelModal = ({ level, condition }) => {
        let text = "";
        let image = "";
        let btn1;

        switch (condition) {
            case "win":
                text = `Você venceu o nível ${level}!!!`;
                image = this._images.get("hero_static");
                this._appEvents.emit("started-game-on-level", level + 1);
                btn1 = {
                    text: `Jogar nível ${level + 1}`,
                    cb: () => {
                        this._playSfx("button_clicked");
                        this._topBar.pauseBtn.classList.remove("hidden");
                        this._appEvents.emit("level-is-ready", level + 1);
                    },
                };
                this._playSfx("end_level_win_condition", { pauseMusic: true });
                break;
            case "lost":
                text = `Você perdeu!!!`;
                image = this._images.get("enemy_static");
                this._appEvents.emit("started-game-on-level", level);
                btn1 = {
                    text: `Reiniciar o nível ${level}`,
                    cb: () => {
                        this._playSfx("button_clicked");
                        this._topBar.pauseBtn.classList.remove("hidden");
                        this._appEvents.emit("level-is-ready", level);
                    },
                };
                this._playSfx("end_level_lost_condition", { pauseMusic: true });
                break;
        }

        const btn2 = {
            text: "Voltar para o Menu",
            cb: () => {
                this._playSfx("button_clicked");
                this._menuScreen.screen.classList.toggle("hidden");
                this._gameScreen.screen.classList.toggle("hidden");
                this._topBar.pauseBtn.classList.add("hidden");
                this._topBar.levelCounter.classList.add("hidden");
                this._topBar.heartsCounter.classList.add("hidden");
                this._currentScreen = "menu";
            },
        };

        Modal.create(text, image, null, btn1, btn2);
    };

    _onEndOfGame = () => {
        const text = "PARABÉNS!!!! Você venceu todas os níveis!";
        const image = this._images.get("end_of_game_static");
        this._playSfx("end_of_game", { pauseMusic: true });
        const btn1 = {
            text: "Voltar para o Menu",
            cb: () => {
                this._playSfx("button_clicked");
                this._menuScreen.screen.classList.toggle("hidden");
                this._gameScreen.screen.classList.toggle("hidden");
                this._topBar.pauseBtn.classList.add("hidden");
                this._topBar.levelCounter.classList.add("hidden");
                this._topBar.heartsCounter.classList.add("hidden");
                this._currentScreen = "menu";
            },
        };
        Modal.create(text, image, null, btn1);
    };

    _onResetGame = () => {
        const text =
            "Você tem certeza de que quer recomeçar o jogo?\nTodo o seu progresso será zerado.";
        const image = null;
        const btn1 = {
            text: "Não, não quero perder meu progresso",
            cb: () => {
                this._playSfx("button_clicked");
            },
        };
        const btn2 = {
            text: "Sim, quero reiniciar mesmo assim",
            cb: () => {
                this._playSfx("button_clicked");
                this._appEvents.emit("reset-game");
                this._lockLevels();
            },
        };
        Modal.create(text, image, null, btn1, btn2);
    };

    updatePlayerStats = (playerStats) => {
        this._playerStats = {...playerStats };
        this._updateMenuStats(playerStats);
    };

    _updateLifeData = (lives) => {
        if (lives !== this._LIVES) {
            this._playSfx("life_lost");
        }
        for (let i = 0; i < this._LIVES; i++) {
            if (i >= lives) {
                this._topBar.hearts[i].classList.add("fa-heart-crack");
                this._topBar.hearts[i].classList.remove("fa-heart");
            } else {
                this._topBar.hearts[i].classList.remove("fa-heart-crack");
                this._topBar.hearts[i].classList.add("fa-heart");
            }
        }
    };

    _updateGoldData = (value) => {
        this._topBar.goldCount.innerText = value;
    };

    _updateLevelData = (level) => {
        this._topBar.levelCount.innerText = level;
    };

    _prepareLevel = (level, maxLives, goldCount) => {
        this._gameScreen.skyX = -530;
        this._gameScreen.skyY = 34.5;
        this._renderer.clearGameArea();
        this._updateLevelData(level);
        this._updateLifeData(maxLives);
        this._updateGoldData(goldCount);
    };

    _onLevelEnd = ({ level, condition, playerStats }) => {
        if (condition === "lost") {
            this._openEndLevelModal({ level, condition });
        }

        if (condition === "win" && level < this._LEVELS) {
            this._openEndLevelModal({ level, condition });
            this._unlockLevel(level + 1);
        }

        if (condition === "win" && level === this._LEVELS) {
            if (level === this._LEVELS) {
                this._onEndOfGame();
            }
        }
        this._updateMenuStats(playerStats);
    };

    _unlockLevel(level) {
        this._menuScreen.levelsBtn[level - 1].classList.remove("disabled");
        const i =
            this._menuScreen.levelsBtn[level - 1].getElementsByTagName("i")[0];
        i.classList.remove("fa-lock");
        i.classList.add("fa-play");
    }

    _lockLevels() {
        this._menuScreen.levelsBtn.forEach((button) => {
            if (button.id !== "level1") {
                button.classList.add("disabled");
                const i = button.getElementsByTagName("i")[0];
                i.classList.add("fa-lock");
                i.classList.remove("fa-play");
            }
        });
    }

    _updateMenuStats = ({ damage, shootRate, defense, velocity, goldCount }) => {
        this._topBar.goldCount.innerText = goldCount;
        this._menuScreen.shootRateData.innerText = Math.round(shootRate / 6);
        this._menuScreen.damageData.innerText = damage;
        this._menuScreen.defenseData.innerText = defense;
        this._menuScreen.velocityData.innerText = Math.round(velocity / 6.6);
    };

    _playSfx = (type, options) => {
        this._audioPlayer.playEffect(type, options);
    };

    _bulletFired = (type) => {
        this._playSfx(`${type}_shooting_bullet`);
    };

    _pauseSfx = (effect) => {
        this._audioPlayer.pauseEffect(effect);
    };

    _toggleMusic = () => {
        this._audioPlayer.toggleMusic();
    };

    _receivedDamage = (type) => {
        this._playSfx(`${type}_beingAttacked`);
    };

    _died = (type) => {
        this._pauseSfx(`${type}_beingAttacked`);
    };
}