class ParfaitEvent extends GameEvent {
    constructor(id, type, position, size, affect) {
        super(id, type, position, size, affect);
        this.exist = !this.getHistory().includes(id);
    }

    onActivate() {
        if (this.exist) {
            this.exist = false;
            this.setHistory(this.id);

            const popup = document.querySelector(".parfait");

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
            // window.$game.ctx.fillStyle = 'rgba(0, 255, 0, 1)';
            // window.$game.ctx.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.size.x, this.hitbox.size.y);
            window.$game.ctx.drawImage(
                window.$game.textureManager.getTexture("parfait"),
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
        return JSON.parse(Store.get("parfait") ?? "[]");
    }

    setHistory(id) {
        let history = this.getHistory();
        if (history.includes(id)) return;
        history.push(id);
        Store.set("parfait", JSON.stringify(history));
    }
}
