class SoundManager {
    constructor() {
        this.bgmsFormal = [
            new Audio("./assets/audios/bgms/村上純 - かえり道.mp3"),
            new Audio("./assets/audios/bgms/阿保剛 - Christina I.mp3"),
        ];
        this.backgroundMusic = null;
        this.init();
    }

    playBGM(name = null) {
        // console.log(name)
        if (window.$game.chapterNow === "Outro" && name === null)
            return;
        if (this.backgroundMusic)
            this.backgroundMusic.pause();
        if (name)
            this.backgroundMusic = this.bgms[ name ];
        else
            this.backgroundMusic = this.bgmsFormal[ Math.floor(Math.random() * this.bgmsFormal.length) ];
        // console.log(this.backgroundMusic);
        this.backgroundMusic.currentTime = 0;
        this.backgroundMusic.volume = 0.5;
        this.backgroundMusic.play();
        if (name === null)
            this.backgroundMusic.addEventListener('ended', this.handleClick);
        document.removeEventListener('click', this.handleClick);
    }

    handleClick = () => {
        this.playBGM();
    };

    init() {
        document.addEventListener('click', this.handleClick);
    }


    async load() {
        this.sounds = {};
        this.soundsURL = await window.$game.dataManager.loadJSON("./assets/audios/Sounds.json");
        Object.keys(this.soundsURL).forEach((kind) => {
            this.sounds[ kind ] = {};
            Object.keys(this.soundsURL[ kind ]).forEach((id) => {
                const audio = new Audio(this.soundsURL[ kind ][ id ]);
                audio.loop = false;
                this.sounds[ kind ][ id ] = audio;
            });
        });

        this.bgms = {};
        this.bgmsURL = await window.$game.dataManager.loadJSON("./assets/audios/BGMs.json");
        Object.keys(this.bgmsURL).forEach((id) => {
            const audio = new Audio(this.bgmsURL[ id ]);
            audio.loop = true;
            this.bgms[ id ] = audio;
        });

    }
    async playSound(kind, id = 0) {
        /**
         * @type {HTMLAudioElement}
         */
        const sound = this.sounds[ kind ] && this.sounds[ kind ][ id ];
        if (sound) {
            if (!sound.paused) {
                if (kind == "walk")
                    return;
                /**
                 * @type {HTMLAudioElement}
                 */
                const copy = sound.cloneNode();
                copy.currentTime = 0;
                copy.play().catch(error => {
                    console.error(`Error playing sound: ${kind + id}`, error);
                });
            }
            else {
                sound.play().catch(error => {
                    console.error(`Error playing sound: ${kind + id}`, error);
                });
            }
        } else {
            console.warn(`Sound ${id} not found in AudioManager.`);
        }
    }
}
