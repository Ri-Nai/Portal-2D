class Wire extends GameEvent {
    /**
     *
     * @param {string} id
     * @param {number} type
     * @param {Vector} position
     * @param {Vector} size
     * @param {string[]} affect
     */
    constructor (id, type, position, size, affect) {
        super(id, type, position, size, affect);
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
        window.$game.ctx.fillStyle = this.activated ? `rgba(255, 0, 0, 1)` : `rgba(0, 0, 0, 1)`;
        window.$game.ctx.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.size.x, this.hitbox.size.y)
    }
}
