class Wire extends GameEvent {
    /**
     *
     * @param {string} id
     * @param {number} type
     * @param {Vector} position
     * @param {Vector} size
     * @param {string[]} affect
     */
    constructor (id, type, position, size, affect, predir, nxtdir) {
        super(id, type, position, size, affect);
        this.predir = predir;
        this.nxtdir = nxtdir;
    }

    // 是被动的，不需要检测碰撞
    update() {}

    onActivate() {
        console.debug('Wire activated', this.activated)
    }

    onDeactivate() {
        console.debug('Wire deactivated', this.activated);
    }

    draw() {
        let status = this.activated ? "on" : "off";
        if (this.predir == this.nxtdir)
            window.$game.ctx.drawImage(
                window.$game.textureManager.getTexture("wires-straight-" + status, this.predir & 1),
                this.hitbox.position.x,
                this.hitbox.position.y,
                this.hitbox.size.x,
                this.hitbox.size.y);
        else {
            let id = ""
            if ((this.nxtdir + 1 & 3) == this.predir)
                id = String(this.predir) + String(this.nxtdir);
            else
                id = String(this.nxtdir + 2 & 3) + String(this.predir + 2 & 3);
            window.$game.ctx.drawImage(
                window.$game.textureManager.getTexture("wires-cursed-" + status, id),
                this.hitbox.position.x,
                this.hitbox.position.y,
                this.hitbox.size.x,
                this.hitbox.size.y);
        }
    }
}
