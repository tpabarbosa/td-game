const audios = {
    musics: [
        { id: "playing", src: "/audios/443987__adnova__hide-loop.mp3" },
        { id: "menu", src: "/audios/menu_music.mp3" },
    ],
    effects: [{
            id: "coin_released",
            src: "/audios/213987__fenrirfangs__coin-fall-1.mp3",
        },
        {
            id: "chest_released",
            src: "/audios/435033__ongaku-dragon__3-table-with-glass-and-keys-hit-and-keys-kick-combi-bonus.mp3",
        },
        {
            id: "game_paused",
            src: "/audios/450509__abyeditsound__clockticksound-01.mp3",
        },
        {
            id: "hero_shooting_bullet",
            src: "/audios/522279__filmmakersmanual__bullet-flyby-1.mp3",
        },
        {
            id: "hero_moving",
            src: "/audios/445635__tilano408__10-steps-grass.mp3",
        },
        {
            id: "wall_beingAttacked",
            src: "/audios/522401__filmmakersmanual__bullet-concrete-hit-4.mp3",
        },
        {
            id: "skeleton_beingAttacked",
            src: "/audios/416838__tonsil5__grunt2-death-pain.mp3",
        },
        {
            id: "zombie_beingAttacked",
            src: "/audios/442601__topschool__ough.mp3",
        },
        {
            id: "mage_beingAttacked",
            src: "/audios/553285__nettoi__hurt4.mp3",
        },
        {
            id: "mage_shooting_bullet",
            src: "/audios/522278__filmmakersmanual__bullet-flyby-5.mp3",
        },
        {
            id: "warrior_beingAttacked",
            src: "/audios/491833__hidrolion__31-quejido-2.mp3",
        },

        {
            id: "life_lost",
            src: "/audios/416177__johnnyguitar01__bristol-colston-hall-balloon-pop.mp3",
        },
        {
            id: "end_level_win_condition",
            src: "/audios/580310__colorscrimsontears__fanfare-2-rpg.mp3",
        },
        {
            id: "end_level_lost_condition",
            src: "/audios/368367__thezero__game-over-sound.mp3",
        },
        {
            id: "end_of_game",
            src: "/audios/457541__kojiro-miura__sisro-the-winner.mp3",
        },
        {
            id: "button_clicked",
            src: "/audios/button_pressed.mp3",
        },
    ],
};

const audiosLoader = (eventEmitter) => {
    const audiosSources = new Set();
    audios.musics.forEach((audio) => {
        audiosSources.add(audio.src);
    });
    audios.effects.forEach((audio) => {
        audiosSources.add(audio.src);
    });

    const audiosToLoad = [...audiosSources];

    const loadedaudios = new Map();
    let loading = 0;

    const loadNext = () => {
        if (loading === audiosToLoad.length) {
            const finalaudios = { musics: new Map(), effects: new Map() };
            audios.musics.forEach((audio) => {
                finalaudios.musics.set(audio.id, loadedaudios.get(audio.src));
            });
            audios.effects.forEach((audio) => {
                finalaudios.effects.set(audio.id, loadedaudios.get(audio.src));
            });

            eventEmitter.emit("audios-loaded", finalaudios);
            return;
        }
        const audio = new Audio(audiosToLoad[loading]);

        loadedaudios.set(audiosToLoad[loading], audio);
        loading += 1;
        loadNext();
    };

    loadNext();
};

export default audiosLoader;