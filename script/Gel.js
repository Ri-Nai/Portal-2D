class Gel extends Entity {
    constructor(position, velocity) {
        super(position, new Vector(4, 4), velocity); // 设定一个默认的炮弹大小为5x5
        this.destroyed = false;
    }

    update(deltaTime) {
        if (this.destroyed) return;
        deltaTime = 60 * deltaTime / 1000;
        // this.updateXY(deltaTime, () => { return 0; }, () => { return 0; }, false);
        this.inPortal = Math.max(this.inPortal - deltaTime, 0);
        this.isflying = 1;
        this.jumping.updateFalling(deltaTime);
        let nextVelocityY = -this.jumping.jumpVelocity;
        let nextVelocityX = this.velocity.x;
        if (!this.inPortal)
            nextVelocityX = this.updateX(deltaTime, 0, false);
        this.velocity.x = nextVelocityX;
        this.velocity.y = nextVelocityY;
        let direction = this.velocity.normalize();
        let length = this.velocity.scale(deltaTime).magnitude();
        for (let i = 0; i < length; ++i) {
            this.hitbox.position.addEqual(direction);

            let edge = this.hitbox.checkHits(window.$game.view.map.edges, () => { });
            if (edge) {
                this.position = fixPosition(this.position, edge);
                this.destroy();
                return;
            }
            if (this.hitbox.checkHits(window.$game.view.map.blocks, () => { this.destroy(); })) {
                return;
            }
        }
    }
    destroy() {
        // 当炮弹飞出边界时销毁
        // window.$game.projectiles = window.$game.projectiles.filter(p => p !== this);
        this.velocity = new Vector(0, 0);
        this.destroyed = true;
    }

    draw() {
        window.$game.ctx.fillStyle = 'rgba(0, 100, 255, 1)';
        window.$game.ctx.fillRect(this.position.x, this.position.y, this.hitbox.size.x, this.hitbox.size.y);
    }
}
