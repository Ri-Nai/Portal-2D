class Gel extends Entity {
    static gelColors = [ "blue", "orange", "white" ];

    static gelSize = new Vector(0.8 * basicSize, 0.8 * basicSize);
    constructor(position, size, velocity, type) {
        super(position, size, velocity); // 设定一个默认的炮弹大小为5x5
        this.destroyed = false;
        this.type = type;
        this.frame = 1;
        this.buffer = this.bufferTime = 3;
        this.isBullet = true
    }

    update(deltaTime) {
        if (this.destroyed) return;
        let frameLength = this.type == 2 ? 7 : 11;
        if ((this.buffer -= deltaTime) <= 0) {
            this.frame = this.frame % frameLength + 1;
            this.buffer = this.bufferTime;
        }
        this.inPortal = Math.max(this.inPortal - deltaTime, 0);
        this.isflying = 1;
        let nextVelocityX = this.velocity.x;
        if (!this.inPortal)
            nextVelocityX = this.updateX(deltaTime, 0, false);
        this.jumping.updateFalling(deltaTime);
        let nextVelocityY = -this.jumping.jumpVelocity;
        this.velocity.x = nextVelocityX;
        this.velocity.y = nextVelocityY;
        let length = this.velocity.scale(deltaTime).magnitude();
        let direction = this.velocity.normalize();
        for (let i = 0; i < length; ++i) {
            if (this.checkPortal(direction)) {
                direction = this.velocity.normalize();
                continue;
            }
            this.hitbox.position.addEqual(direction);

            let centeredPosition = this.hitbox.getCenter();
            for (let edge of window.$game.map.superEdges) {
                if (edge.type == -1 && edge.hitbox.contains(centeredPosition)) {
                    centeredPosition = fixPosition(centeredPosition, edge);
                    this.hitbox.position.subVector(this.hitbox.size.scale(0.5));
                    window.$game.view.gelledEdgeList.addEdge(this.type, centeredPosition, edge);
                    this.destroy();
                    return;
                }
            }
        }
    }
    destroy() {
        // 当炮弹飞出边界时销毁
        this.velocity = new Vector(0, 0);
        this.destroyed = true;
    }
    draw() {
        window.$game.ctx.drawImage(
            window.$game.textureManager.getTexture("gels", this.type + "-" + this.frame),
            this.hitbox.position.x,
            this.hitbox.position.y,
            this.hitbox.size.x,
            this.hitbox.size.y
        );
    }
}
