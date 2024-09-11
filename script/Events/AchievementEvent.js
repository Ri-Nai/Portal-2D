class AchivementEvent extends GameEvent {
    constructor(id, type, position, size, affect) {
        super(id, type, position, size, affect);
        this.exist = !this.getHistory().includes(id);
        this.name = "";
    }

    onActivate() {
        if (this.exist) {
            this.exist = false;
            this.setHistory(this.id);
            window.$game.soundManager.playSound("achievement");
            const popup = document.querySelector("." + this.name);

            popup.querySelector(".title").innerText = this.getHistory().length;

            popup.classList.remove("hidden");

            setTimeout(() => {
                popup.classList.add("hide");
                setTimeout(() => {
                    popup.classList.replace("hide", "hidden");
                }, 1000);
            }, 5000);
        }
    }

    draw() {
        if (this.exist) {
            window.$game.ctx.drawImage(
                window.$game.textureManager.getTexture(this.name),
                this.hitbox.position.x - offsetSize,
                this.hitbox.position.y - offsetSize * 2,
                this.hitbox.size.x + offsetSize * 2,
                this.hitbox.size.y + offsetSize * 2);
        }
    }

    /**
     * @returns {string[]}
     */
    getHistory() {
        return JSON.parse(Store.get(this.name) ?? "[]");
    }

    setHistory(id) {
        let history = this.getHistory();
        if (history.includes(id)) return;
        history.push(id);
        Store.set(this.name, JSON.stringify(history));
    }
}
