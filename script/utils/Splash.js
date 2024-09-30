class Splash {
    constructor() {
        this.ele = document.querySelector("#game #game-container .splash");
        this.isShowing = false;
    }

    async showImg(src) {
        if (this.isShowing)
            await this.moveImg();
        const img = await window.$game.dataManager.loadImg(src);
        this.isShowing = true;
        this.ele.appendChild(img);
        this.fadeIn()
    }
    async fadeHalf() {
        this.ele.classList.add("fadeHalf");
        await this.wait(500);
        // this.ele.classList.remove("fadeHalf");
    }
    async moveImg() {
        this.ele.classList.add("fadeOut");
        await this.wait(500);
        this.isShowing = false;
        this.ele.innerHTML = "";
        await this.wait(250);
        this.ele.classList.add("hidden");
        this.ele.classList.remove("fadeOut");
    }
    async hide() {
        await this.fadeOut();
        this.isShowing = false;
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
        await this.wait(500);
        window.$game.fadeIn()
        await this.wait(250);
        this.ele.classList.add("hidden");
        this.ele.classList.remove("fadeOut");
    }

    wait = async (time) => new Promise((resolve) => setTimeout(resolve, time));
}
