const DEFAULT_PLAY_EFFECTS_OPTIONS = {
    pauseMusic: false,
    loop: false,
    volume: 0.7,
};
const DEFAULT_PLAY_MUSIC_OPTIONS = { loop: true, volume: 0.6 };

export default class AudioPlayer {
    constructor() {
        this._music = null;
        this._audios = null;
        this._shouldPlayMusic = true;
        this._shouldPlaySfx = true;
        this._isPlayingMusic = false;
        this._isPlayingSfx = false;
    }

    setShouldPlayMusic = (value) => {
        this._shouldPlayMusic = value;
        if (this._shouldPlayMusic === false) {
            this.pauseMusic();
        } else {
            this.playMusic();
        }
    };

    pauseMusic = () => {
        if (this._music) {
            this._music.pause();
            this._isPlayingMusic = false;
        }
    };

    playMusic = (options = DEFAULT_PLAY_MUSIC_OPTIONS) => {
        const opt = {...DEFAULT_PLAY_MUSIC_OPTIONS, ...options };
        if (this._shouldPlayMusic && this._music) {
            this._music.loop = opt.loop;
            this._music.volume = opt.volume;
            this._music.play();
            this._isPlayingMusic = true;
        }
    };

    setAudios = (audios) => {
        this._audios = audios;
    };

    changeMusicTo(music) {
        this._music = this._audios.musics.get(music);
    }

    setShouldPlaySfx = (value) => {
        this._shouldPlaySfx = value;
        if (this._shouldPlaySfx === false) {
            this._pauseEffects();
        }
    };

    playEffect(effect, options = DEFAULT_PLAY_EFFECTS_OPTIONS) {
        const opt = {...DEFAULT_PLAY_EFFECTS_OPTIONS, ...options };
        if (!this._shouldPlaySfx) {
            return;
        }
        if (opt.pauseMusic && this._isPlayingMusic) {
            this._music.pause();
            this._audios.effects.get(effect).onended = () => {
                this.playMusic();
                this._isPlayingSfx = false;
            };
            this._audios.effects.get(effect).onpause = () => {
                this.playMusic();
                this._isPlayingSfx = false;
            };
        }

        this._audios.effects.get(effect).volume = opt.volume;
        this._audios.effects.get(effect).loop = opt.loop;

        try {
            this._audios.effects.get(effect).play();
            this._isPlayingSfx = true;
        } catch (e) {
            console.log(e);
        }
    }

    pauseEffect = (effect) => {
        this._audios.effects.get(effect).pause();
        this._isPlayingSfx = false;
    };

    pauseAllAudios = () => {
        if (!this._audios) return;

        this._pauseEffects();

        this.pauseMusic();
        this._shouldPlayMusic = false;
    };

    _pauseEffects = () => {
        this._audios.effects.forEach((effect) => {
            try {
                effect.pause();
            } catch (e) {}
        });
    };
}