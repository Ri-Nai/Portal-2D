class SoundManager {
    constructor() {
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
    }
    async playSound(kind, id = 0) {
        const sound = this.sounds[ kind ] && this.sounds[ kind ][ id ];
        if (sound) {
            if (!sound.paused) {
                sound.pause();
                if (kind == "pause" || kind == "unpause")
                    sound.currentTime = 0;
            }
            sound.play().catch(error => {
                console.error(`Error playing sound: ${kind + id}`, error);
            });
        } else {
            console.warn(`Sound ${id} not found in AudioManager.`);
        }
    }
}