class Bullet extends Entity {
    static bulletSize = new Vector(0.2 * basicSize, 0.2 * basicSize);
    constructor(position, velocity) {
        super(position.addVector(bulletSize.scale(0.5)), bulletSize, velocity);
        this.destroyed = false;
        this.isBullet = true;
        this.type = -1;
    }
    update(deltaTime, glados) {
        if (this.destroyed) return;
        let direction = this.velocity.normalize();
        let length = this.velocity.scale(deltaTime).magnitude();
        for (let i = 0; i < length; ++i) {
            let flag = this.checkPortal(direction)
            if (flag) {
                direction = this.velocity.normalize();
                this.type = flag >> 1;
                continue;
            }
            this.hitbox.position.addEqual(direction);
            let centeredPosition = this.hitbox.getCenter();
            if (glados.hitbox.contains(centeredPosition)) {
                --glados.blood;
                this.destroy();
                return;
            }
            for (let edge of window.$game.map.superEdges) {
                if (edge.hitbox.contains(centeredPosition)) {
                    this.destroy();
                    return;
                }
            }

        }
    }
    draw() {

        let angle = Math.atan(this.velocity.y / this.velocity.x) / Math.PI * 180;
        (this.velocity.x < 0) ? (angle > 0) ? angle -= 180 : angle += 180 : angle;

        const texture = window.$game.textureManager.getTexture("portalBullets", ["blue", "orange"][this.type]);
        const rotated = window.$game.textureManager.rotateTexture(texture, angle);

        window.$game.ctx.drawImage(rotated, 10, 10, 20, 20, this.position.x, this.position.y, 20, 20);

    }
    destroy() {
        // 当炮弹飞出边界时销毁
        this.velocity = new Vector(0, 0);
        this.destroyed = true;
    }
}
