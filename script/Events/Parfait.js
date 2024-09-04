class ParfaitEvent extends GameEvent {
    constructor(id, type, position, size, affect) {
        super(id, type, position, size, affect);
        this.exist = !this.getHistory().includes(id)
    }

    onActivate() {
        this.exist = false
        this.setHistory(this.id)

        const popup = document.querySelector(".parfait");

        popup.querySelector(".title").innerText = this.getHistory().length;

        popup.classList.remove("hidden");

        setTimeout(() => {
            popup.classList.add("hide");
            setTimeout(() => {
                popup.classList.replace("hide", "hidden");
            }, 1000)
        }, 5000);
    }

    draw() {
        if (this.exist) {
            window.$game.ctx.fillStyle = 'rgba(0, 255, 0, 1)';
            window.$game.ctx.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.size.x, this.hitbox.size.y);
        }
    }

    /**
     * @returns {string[]}
     */
    getHistory() {
        return JSON.parse(Store.get("parfait") ?? "[]")
    }

    setHistory(id) {
        let history = this.getHistory()
        history.push(id)
        Store.set("parfait", JSON.stringify(history))
    }
}
