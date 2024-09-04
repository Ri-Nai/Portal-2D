class Splash {
    constructor() {
        this.ele = document.querySelector("#game .splash");
    }

    async showImg(src) {
        const img = await window.$game.dataManager.loadImg(src);
        this.ele.appendChild(img);
        this.fadeIn()
    }

    async hide() {
        await this.fadeOut();
        this.ele.innerHTML = "";
    }

    async fadeIn() {
        window.$game.fadeOut()
        await this.wait(250);
        this.ele.classList.add("fadeIn");
        this.ele.classList.remove("hidden");
        await this.wait(500);
        this.ele.classList.remove("fadeIn");
    }

    async fadeOut() {
        this.ele.classList.add("fadeOut");
        await this.wait(250);
        window.$game.fadeIn()
        await this.wait(250);
        this.ele.classList.add("hidden");
        this.ele.classList.remove("fadeOut");
    }

    wait = async (time) => new Promise((resolve) => setTimeout(resolve, time));
}
