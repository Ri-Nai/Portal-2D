class Gel extends Entity {
    static gelColors = ["blue","orange","white"]

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
            if (this.checkPortal(direction)) {
                direction = this.velocity.normalize();
                continue;
            }
            this.hitbox.position.addEqual(direction);

            let centeredPosition = this.hitbox.getCenter();
            for (let edge of window.$game.map.edges) {
                if (edge.hitbox.contains(centeredPosition)) {
                    centeredPosition = fixPosition(centeredPosition, edge);
                    this.hitbox.position.subVector(this.hitbox.size.scale(0.5));
                    window.$game.view.gelledEdgeList.addEdge(this.type, centeredPosition, edge);
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
        window.$game.ctx.fillStyle = Gel.gelColors[this.type];
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
        if (this.now == 0) {
            this.gels.push(new Gel(new Vector(13 * basicSize, 5 * basicSize), Gel.gelSize, new Vector(5, 0), 2));
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
class GelledEdge extends Edge {
    constructor(type, position, size, facing) {
        super(type, position, size, facing);
    }
    draw() {
        window.$game.ctx.fillStyle = Gel.gelColors[this.type];
        window.$game.ctx.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.size.x, this.hitbox.size.y);
    }
}
class GelledEdgeList {
    constructor() {
        this.gelledEdges = [[], [], []];
    }
    addEdge(type, position, edge) {
        let dels = [[], [], []];
        let adds = [[], [], []];
        let newEdge = new GelledEdge(type, position.addVector(Portal.portalDirection[ edge.facing ]), Portal.portalSize[ edge.facing & 1 ], edge.facing);
        newEdge.hitbox = newEdge.hitbox.clip(edge.hitbox);
        for (let now = 0; now < 3; ++now) {
            for (let i of this.gelledEdges[now]) {
                if (i.facing == newEdge.facing && i.hitbox.hit(newEdge.hitbox)) {
                    if (now == type) {
                        dels[now].push(i);
                        newEdge.hitbox = newEdge.hitbox.merge(i.hitbox);
                    } else {
                        dels[now].push(i);
                        let leftUp = newEdge.hitbox.getTopLeft();
                        let rightDown = newEdge.hitbox.getBottomRight();
                        let leftDown = new Vector(leftUp.x, rightDown.y);
                        let rightUp = new Vector(rightDown.x, leftUp.y);
                        let newEdge1 = null, newEdge2 = null;
                        if (newEdge.facing & 1) {
                            if (createHitbox(i.hitbox.getTopLeft(), rightDown))
                                newEdge1 = new GelledEdge(i.type, i.hitbox.getTopLeft(), rightUp.subVector(i.hitbox.getTopLeft()), i.facing);
                            if (createHitbox(leftDown, i.hitbox.getBottomRight()))
                                newEdge2 = new GelledEdge(i.type, leftDown, i.hitbox.getBottomRight().subVector(leftDown), i.facing);
                        }
                        else {
                            if (createHitbox(i.hitbox.getTopLeft(), leftDown))
                                newEdge1 = new GelledEdge(i.type, i.hitbox.getTopLeft(), leftDown.subVector(i.hitbox.getTopLeft()), i.facing);
                            if (createHitbox(rightUp, i.hitbox.getBottomRight()))
                                newEdge2 = new GelledEdge(i.type, rightUp, i.hitbox.getBottomRight().subVector(rightUp), i.facing);
                        }
                        if (newEdge1)
                            adds[now].push(newEdge1);
                        if (newEdge2) {
                            adds[now].push(newEdge2);
                        }
                    }
                }
            }
        }
        adds[type].push(newEdge);
        for (let now = 0; now < 3; ++now) {
            for (let newEdge of adds[now])
                this.gelledEdges[now].push(newEdge);
            this.gelledEdges[now] = this.gelledEdges[now].filter(i => !dels[now].includes(i));
        }
    }
    draw() {
        for (let now = 0; now < 3; ++now)
            for (let i of this.gelledEdges[now]) {
                i.draw();
            }
    }
}
