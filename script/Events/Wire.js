class Wire extends GameEvent {
    /**
     *
     * @param {string} id
     * @param {number} type
     * @param {Vector} position
     * @param {Vector} size
     * @param {string[]} affect
     */
    constructor(id, type, position, size, affect, predir, nxtdir) {
        super(id, type, position, size, affect);
        this.predir = predir;
        this.nxtdir = nxtdir;
    }

    // 是被动的，不需要检测碰撞
    update() { }

    onActivate() {
        console.debug('Wire activated', this.activated);
    }

    onDeactivate() {
        console.debug('Wire deactivated', this.activated);
    }

    draw() {
        let status = "wires-" + (this.activated ? "on" : "off");
        let texture = null;
        if (this.nxtdir == -1)
            texture = window.$game.textureManager.getTexture(status, "sign");
        else if (this.predir == this.nxtdir)
            texture = window.$game.textureManager.getTexture(status, `straight-${this.predir & 1}`);
        else
            texture = window.$game.textureManager.getTexture(status, "cursed");
        window.$game.ctx.drawImage(texture, this.hitbox.position.x - offsetSize / 2, this.hitbox.position.y - offsetSize / 2, this.hitbox.size.x, this.hitbox.size.y);
    }
}
