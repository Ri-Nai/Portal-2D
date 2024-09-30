class Bullet extends Entity {
    static bulletSize = new Vector(0.2 * basicSize, 0.2 * basicSize);
    constructor(position, velocity, style = 0) {
        super(position.subVector(Bullet.bulletSize.scale(0.5)), Bullet.bulletSize, velocity);
        this.destroyed = false;
        this.isBullet = true;
        this.type = -1;
        this.style = style;
        window.$game.statistics.bullet++;
    }
    update(deltaTime, GLaDOS, player) {
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
            if (this.type != -1 && GLaDOS.hitbox.contains(centeredPosition)) {
                --GLaDOS.blood;
                this.destroy();
                return;
            }
            else if (this.type == -1 && player.hitbox.contains(centeredPosition)) {
                player.blood -= 1;
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
        angle += 90;
        const texture = window.$game.textureManager.getTexture("GLaDOSbullets", `${this.type}-${this.style}`);
        const rotated = window.$game.textureManager.rotateTexture(texture, angle);
        window.$game.ctx.drawImage(rotated, this.hitbox.position.x, this.hitbox.position.y, 20, 20);


    }
    destroy() {
        // 当炮弹飞出边界时销毁
        this.velocity = new Vector(0, 0);
        this.destroyed = true;
    }
}
