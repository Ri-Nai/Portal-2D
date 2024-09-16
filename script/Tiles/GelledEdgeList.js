class GelledEdge extends Edge {
    constructor(type, position, size, facing) {
        super(type, position, size, facing);
    }
    draw() {

        if (this.facing & 1)
            for (let i = 0; i < this.hitbox.size.y; i += basicSize) {
                let sizeY = Math.min(basicSize, this.hitbox.size.y - i);
                window.$game.ctx.drawImage(
                    window.$game.textureManager.getTexture("gelledEdges", `${this.type}-${this.facing}`),
                    0, 0, basicSize, sizeY,
                    this.hitbox.position.x - (this.facing >> 1) * halfSize - offsetSize,
                    this.hitbox.position.y + i - offsetSize,
                    basicSize + 2 * offsetSize, sizeY + 2 * offsetSize
                );
            }
        else
            for (let i = 0; i < this.hitbox.size.x; i += basicSize) {
                let sizeX = Math.min(basicSize, this.hitbox.size.x - i);
                window.$game.ctx.drawImage(
                    window.$game.textureManager.getTexture("gelledEdges", `${this.type}-${this.facing}`),
                    0, 0, sizeX, basicSize,
                    this.hitbox.position.x + i - offsetSize,
                    this.hitbox.position.y - (this.facing >> 1) * halfSize - offsetSize,
                    sizeX + 2 * offsetSize, basicSize + 2 * offsetSize
                );
            }

    }
}
class GelledEdgeList {
    constructor() {
        this.gelledEdges = [ [], [], [] ];
        this.length = 0;
    }
    addEdge(type, position, edge) {
        let dels = [ [], [], [] ];
        let adds = [ [], [], [] ];
        let newEdge = new GelledEdge(type, position.addVector(Portal.portalDirection[ edge.facing ]), Portal.portalSize[ edge.facing & 1 ], edge.facing);
        newEdge.hitbox = newEdge.hitbox.clip(edge.hitbox);
        for (let now = 0; now < 3; ++now) {
            for (let i of this.gelledEdges[ now ]) {
                if (i.facing == newEdge.facing && i.hitbox.hit(newEdge.hitbox)) {
                    if (now == type) {
                        dels[ now ].push(i);
                        newEdge.hitbox = newEdge.hitbox.merge(i.hitbox);
                    } else {
                        dels[ now ].push(i);
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
                            adds[ now ].push(newEdge1);
                        if (newEdge2) {
                            adds[ now ].push(newEdge2);
                        }
                    }
                }
            }
        }
        adds[ type ].push(newEdge);
        for (let now = 0; now < 3; ++now) {
            for (let newEdge of adds[ now ])
                this.gelledEdges[ now ].push(newEdge);
            this.gelledEdges[ now ] = this.gelledEdges[ now ].filter(i => !dels[ now ].includes(i));
        }
        this.length = 0;
        for (let edges of this.gelledEdges) {
            for (let edge of edges) {
                if (edge.facing & 1)
                    this.length += edge.hitbox.size.y;
                else
                    this.length += edge.hitbox.size.x;
            }
        }
    }
    draw() {
        for (let now = 0; now < 3; ++now)
            for (let i of this.gelledEdges[ now ]) {
                i.draw();
            }
    }
}
