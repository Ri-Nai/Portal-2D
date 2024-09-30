class PortalGun {
    /**
     * @type {Vector}
     */
    direction;

    constructor() {
        this.status = [ false, false ];
        this.direction = new Vector(1, 0);
        this.prev = 0;
        this.position = new Vector(0, 0);
        // 发射间隔
        this.INTERVAL = 250;
        this.isShot = false;
        this.isHit = false;
        this.target = 0;

        this.flyingType = 0;
        this.COLOR = [ "blue", "orange" ];
        this.edge = null;
    }

    /**
     *
     * @param {Vector} player Player center position
     * @param {Vector} mouse Mouse position
     */
    update(player, mouse) {
        // 如果已发射, 不更新飞行方向
        if (this.isShot) {
            return;
        }
        this.direction = mouse.subVector(player).normalize();
    }

    /**
     * @param {Vector} player Player center position
     * @param {number} type Portal type
     */
    shot(player, type, t) {
        const frameRatio = (t.interval / 1000) * 60;
        const SPEED = 25;
        if (this.status[ type ]) {
            return;
        }
        if (t.timestamp - this.prev >= this.INTERVAL && this.isShot === false) {
            window.$game.soundManager.playSound('portal-shooting', type);
            this.prev = t.timestamp;
            this.position = new Vector(player.x, player.y);
            this.isShot = true;
            this.isHit = false;
            this.target = this.direction.scale(SPEED * frameRatio).magnitude();
            this.flyingType = type;
            this.edge = null;
        }
    }

    draw(t) {
        if (!this.isShot) {
            return;
        }

        let angle = Math.atan(this.direction.y / this.direction.x) / Math.PI * 180;
        (this.direction.x < 0) ? (angle > 0) ? angle -= 180 : angle += 180 : angle;

        const texture = window.$game.textureManager.getTexture("portalBullets", this.COLOR[ this.flyingType ]);
        const rotated = window.$game.textureManager.rotateTexture(texture, angle);

        window.$game.ctx.drawImage(rotated, 10, 10, 20, 20, this.position.x, this.position.y, 20, 20);

        /**
         * @type {Edge[]}
         */
        const edges = window.$game.map.edges;
        const superEdges = window.$game.map.superEdges;
        const gelledEdgeList = window.$game.view.gelledEdgeList.gelledEdges[ 2 ];

        let validEdges = edges.filter((edge) => { return edge.type == 2; });
        for (let i = 0; i < this.target; i++) {
            this.position.addEqual(this.direction);

            if (!validPosition(this.position)) {
                this.isShot = false;
                return;
            }
            let done = false;
            for (let edge of edges) {
                if (edge.hitbox.contains(this.position)) {
                    this.isShot = false;
                    this.isHit = true;
                    this.edge = edge;
                    this.position = fixPosition(this.position, edge);
                    window.$game.statistics.portal++;
                    done = true;
                    break;
                }
            }
            for (let edge of gelledEdgeList) {
                if (edge.hitbox.contains(this.position)) {
                    this.isShot = false;
                    this.isHit = true;
                    let newEdge = new Edge(edge.type, edge.hitbox.position.copy(), edge.hitbox.size.copy(), edge.facing);
                    for (let valid of validEdges)
                        if (valid.facing == newEdge.facing && valid.hitbox.hit(newEdge.hitbox))
                            newEdge.hitbox = newEdge.hitbox.merge(valid.hitbox);
                    this.edge = newEdge;
                    this.position = fixPosition(this.position, edge);
                    done = true;
                    break;
                }
            }
            if (done)
                return;
            for (let superEdge of superEdges) {
                if (superEdge.hitbox.contains(this.position)) {
                    this.isShot = false;
                    done = true;
                    break;
                }
            }
            if (done)
                return;
        }
    }
}

const validPosition = (position) => {
    return (
        position.x >= 0 &&
        position.x <= window.$game.canvas.width &&
        position.y >= 0 &&
        position.y <= window.$game.canvas.height
    );
};

/**
 *
 * @param {Vector} position
 * @param {Edge} edge
 */
const fixPosition = (position, edge) => {
    const fix = [
        new Vector(position.x, edge.hitbox.getTopLeft().y),
        new Vector(edge.hitbox.getTopLeft().x, position.y),
        new Vector(position.x, edge.hitbox.getBottomRight().y),
        new Vector(edge.hitbox.getBottomRight().x, position.y),
    ];
    return fix[ edge.facing ];
};
