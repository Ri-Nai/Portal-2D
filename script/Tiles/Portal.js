class Portal extends Edge {
    static unitDirection = [
        new Vector(0, -1),
        new Vector(-1, 0),
        new Vector(0, 1),
        new Vector(1, 0)
    ];
    //传送门半径1.5格
    static portalRadius = 1 * basicSize;
    static portalWidth = 0.5 * basicSize;
    static portalDirection = [
        new Vector(-Portal.portalRadius, 0),
        new Vector(0, -Portal.portalRadius),
        new Vector(-Portal.portalRadius, -Portal.portalWidth),
        new Vector(-Portal.portalWidth, -Portal.portalRadius)
    ];
    static portalSize = [
        new Vector(2 * Portal.portalRadius, Portal.portalWidth),
        new Vector(Portal.portalWidth, 2 * Portal.portalRadius)
    ];
    /**
     *
     * @param {number} type
     * @param {Vector} position
     * @param {Vector} idNumber
     * @param {number} facing
     */
    //类型，中心位置，朝向
    constructor(type, position, facing) {
        super(type, position.addVector(Portal.portalDirection[ facing ]), Portal.portalSize[ facing & 1 ], facing);
        this.infacing = facing + 2 & 3;
    }
    isMoveIn(hitbox) {
        const thisLeft = this.hitbox.getTopLeft().x;
        const thisRight = this.hitbox.getBottomRight().x;
        const thisTop = this.hitbox.getTopLeft().y;
        const thisBottom = this.hitbox.getBottomRight().y;

        const otherLeft = hitbox.getTopLeft().x;
        const otherRight = hitbox.getBottomRight().x;
        const otherTop = hitbox.getTopLeft().y;
        const otherBottom = hitbox.getBottomRight().y;

        let containsX = thisLeft <= otherLeft && otherRight <= thisRight;
        let containsY = thisTop <= otherTop && otherBottom <= thisBottom;
        let axis = this.facing & 1;
        let containsAxis = !axis ? containsX : containsY;
        return containsAxis && hitbox.hit(this.hitbox);

    }
    draw() {
        if (this.type == -1)
            return;
        //0, 0, 80, 20
        //0, 0, 20, 80
        //0, 20, 80, 20
        //20, 0, 20, 80
        let positionX = (this.facing >> 1) * (this.facing & 1) * halfSize;
        let positionY = (this.facing >> 1) * (this.facing & 1  ^ 1) * halfSize;
        //0, 0, 80, 40
        //0, 0, 40, 80
        //0, 0, 80, 40
        //0, 0, 40, 80
        window.$game.ctx.drawImage(
            window.$game.textureManager.getTexture("portals", `${this.type}-in-${this.facing}`),
            positionX, positionY,
            this.hitbox.size.x, this.hitbox.size.y,
            this.hitbox.position.x,
            this.hitbox.position.y,
            this.hitbox.size.x,
            this.hitbox.size.y
        );
        let sizeX = (this.facing & 1 ^ 1) * basicSize + basicSize;
        let sizeY = (this.facing & 1) * basicSize + basicSize;
        window.$game.ctx.drawImage(
            window.$game.textureManager.getTexture("portals", `${this.type}-out-${this.facing}`),
            0, 0, sizeX, sizeY,
            this.hitbox.position.x + Portal.unitDirection[ this.facing ].x * halfSize * (2 - (this.facing >> 1)),
            this.hitbox.position.y + Portal.unitDirection[ this.facing ].y * halfSize * (2 - (this.facing >> 1)),
            sizeX, sizeY
        );
    }

    /**
     * @param {Vector} position
     * @param {Edge} edge
     * @param {Portal} anotherPortal
     */
    static valid(position, edge, anotherPortal) {
        const portalSize = Portal.portalSize[ edge.facing & 1 ];
        if (edge.type != 2)
            return false;
        const edgeSize = edge.hitbox.size;

        const edgeLength = edge.facing & 1 ? edgeSize.y : edgeSize.x;
        const portalLength = edge.facing & 1 ? portalSize.y : portalSize.x;

        const leftUp = position.addVector(Portal.portalDirection[ edge.facing ]);
        const rightDown = leftUp.addVector(Portal.portalSize[ edge.facing & 1 ]);

        if (anotherPortal.type === -1) {
            return edgeLength >= portalLength;
        }

        const hitAnother = anotherPortal.hitbox.contains(leftUp)
            || anotherPortal.hitbox.contains(rightDown);

        return edgeLength >= portalLength && !hitAnother;
    }

    /**
     *
     * @param {Vector} position
     * @param {Edge} edge
     */
    static fixPosition(position, edge) {
        const leftUp = position.addVector(Portal.portalDirection[ edge.facing ]);
        const rightDown = leftUp.addVector(Portal.portalSize[ edge.facing & 1 ]);

        if (edge.hitbox.contains(leftUp) && edge.hitbox.contains(rightDown)) {
            return position;
        }

        if (edge.hitbox.contains(rightDown)) {
            return edge.hitbox.position.subVector(Portal.portalDirection[ edge.facing ]);
        }

        else {
            const delta = [
                new Vector(-this.portalRadius, -this.portalWidth),
                new Vector(-this.portalWidth, -this.portalRadius),
                new Vector(-this.portalRadius, 0),
                new Vector(0, -this.portalRadius)
            ];
            return edge.hitbox.position.addVector(edge.hitbox.size).addVector(delta[ edge.facing ]);
        }
    }
}
