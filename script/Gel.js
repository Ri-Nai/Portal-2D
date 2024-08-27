class Gel extends Entity {
    static gelSize = new Vector(0.8 * basicSize, 0.8 * basicSize);
    constructor(position, size, velocity, type) {
        super(position, size, velocity); // 设定一个默认的炮弹大小为5x5
        this.destroyed = false;
        this.type = type;
    }

    update(deltaTime) {
        if (this.destroyed) return;
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
            if (this.checkPortal(direction))
            {
                direction = this.velocity.normalize();
                continue;
            }
            this.hitbox.position.addEqual(direction);

            let centeredPosition = this.hitbox.getCenter();
            for (let edge of window.$game.map.edges) {
                if (edge.hitbox.contains(centeredPosition)) {
                    centeredPosition = fixPosition(centeredPosition, edge);
                    this.hitbox.position.subVector(this.hitbox.size.scale(0.5));
                    this.destroy();
                    return;
                }
            }

            for (let block of window.$game.map.blocks) {
                if (block.hitbox.contains(centeredPosition)) {
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
        window.$game.ctx.fillStyle = 'rgba(0, 100, 255, 1)';
        window.$game.ctx.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.size.x, this.hitbox.size.y);
    }
}
class GelDispenser {
    constructor() {
        this.gels = [];
        this.bufferTime = 60;
        this.now = 0;
    }

    update(deltaTime) {
        deltaTime = 60 * deltaTime / 1000;
        let dels = [];
        this.now = Math.max(0, this.now - deltaTime);
        if (this.now == 0)
        {
            this.gels.push(new Gel(new Vector(13 * basicSize, 5 * basicSize), Gel.gelSize, new Vector(5, 0), 1));
            this.now = this.bufferTime;
        }
        for (let i of this.gels) {
            i.update(deltaTime);
            if (i.destroyed) dels.push(i);
        }
        this.gels = this.gels.filter(i => !dels.includes(i));
    }
    draw() {
        for (let i of this.gels)
            i.draw();
    }
}
class GelledEdge {
    constructor(position, edge) {

        const edgeSize = edge.hitbox.size

        const edgeLength = edge.facing & 1 ? edgeSize.y : edgeSize.x;
        const portalLength = edge.facing & 1 ? portalSize.y : portalSize.x;

        const leftUp = position.addVector(Portal.portalDirection[edge.facing]);
        const rightDown = leftUp.addVector(Portal.portalSize[edge.facing & 1]);


    }
}
