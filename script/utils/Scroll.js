class Scroll {
    /**
     *
     * @param {HTMLDivElement} container
     */
    constructor(container) {
        this.container = container;
        this.container.style.setProperty("--height", `${window.innerHeight}px`);

        this.texts = this.container.querySelectorAll(".para > div");
        this.heightAll = 0;

        this.scrolling = false;
    }
    start() {
        this.texts.forEach((t) => {
            t.style.setProperty("--offset", `${this.heightAll}px`);
            this.heightAll += t.clientHeight;
        });
        this.scrolling = true;
        return new Promise((resolve, reject) => {
            this.interval = setInterval(() => {
                if (!this.scrolling) return;
                let prev = parseInt(this.container.style.getPropertyValue("--height").slice(0, -2));
                this.container.style.setProperty("--height", `${prev - 1}px`);
                if (-prev > window.innerHeight) {
                    this.scrolling = false;
                    this.stop();
                    resolve();
                }
            }, 25);
        });
    }
    stop() {
        this.scrolling = false;
        clearInterval(this.interval);
    }
}
