class PortalGun {
    /**
     * @type {Vector}
     */
    direction

    constructor() {
        this.status = [false, false]
        this.direction = new Vector(1, 0);
        this.prev = 0

        // 发射间隔
        this.INTERVAL = 500;
        this.isShot = false
        this.isHit = false
        this.target = 0

        this.flyingType = 0
        this.COLOR = ['blue', 'orange']
        this.edge = null
    }

    /**
     *
     * @param {Vector} player Player center position
     * @param {Vector} mouse Mouse position
     */
    update(player, mouse) {
        // 如果已发射, 不更新飞行方向
        if (this.isShot) {
            return ;
        }
        this.direction = mouse.subVector(player).normalize();
    }


    /**
     * @param {Vector} player Player center position
     * @param {number} type Portal type
     */
    shot(player, type, t) {
        const frameRatio = t.interval / 1000 * 60;
        const SPEED = 10;
        if (this.status[type]) {
            return ;
        }

        if (t.timestamp - this.prev >= this.INTERVAL && this.isShot === false) {
            this.prev = t.timestamp
            this.position = new Vector(player.x, player.y);
            this.isShot = true
            this.isHit = false

            this.target = this.direction.scale(SPEED * frameRatio).magnitude();
            this.flyingType = type;
            this.edge = null;
        }
    }

    draw(t) {
        if (!this.isShot) {
            return ;
        }
        window.$game.ctx.fillStyle = this.COLOR[this.flyingType];
        window.$game.ctx.fillRect(this.position.x, this.position.y, 4, 4);

        /**
         * @type {Edge[]}
         */
        const edges = window.$game.map.edges;
        const blocks = window.$game.map.blocks;

        for (let i = 0; i < this.target; i++) {
            this.position.addEqual(this.direction);

            if (!validPosition(this.position)) {
                this.isShot = false;
                return;
            }

            for (let edge of edges) {
                if (edge.hitbox.contains(this.position)) {
                    this.isShot = false;
                    this.isHit = true;
                    this.edge = edge;

                    this.position = fixPosition(this.position, edge);
                    return;
                }
            }

            for (let block of blocks) {
                if (block.hitbox.contains(this.position)) {
                    this.isShot = false;
                    return;
                }
            }
        }
    }
}

const validPosition = (position) => {
    return position.x >= 0 && position.x <= window.$game.canvas.width &&
        position.y >= 0 && position.y <= window.$game.canvas.height;
}

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
    ]
    return fix[edge.facing];
}
