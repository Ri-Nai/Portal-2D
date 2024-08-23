class Portal extends Edge {
    static unitDirection = [
        new Vector(0, -1),
        new Vector(-1, 0),
        new Vector(0, 1),
        new Vector(1, 0)
    ]
    //传送门半径1.5格
    static portalRadius = 1.5 * basicSize
    static portalWidth = 0.5 * basicSize
    static portalDirection = [
        new Vector(-Portal.portalRadius, 0),
        new Vector(0, -Portal.portalRadius),
        new Vector(-Portal.portalRadius, -Portal.portalWidth),
        new Vector(-Portal.portalWidth, -Portal.portalRadius)
    ]
    static portalSize = [
        new Vector(2 * Portal.portalRadius, Portal.portalWidth),
        new Vector(Portal.portalWidth, 2 * Portal.portalRadius)
    ]
    static needHitbox = [
        new Vector(0, -1),
        new Vector(-1, 0),
        new Vector(0, 1),
        new Vector(1, 0)
    ]
    /**
     *
     * @param {number} type
     * @param {Vector} position
     * @param {Vector} idNumber
     * @param {number} facing
     */
    //类型，中心位置，朝向，idNumber
    constructor(type, position, facing) {
        super(type, position.addVector(Portal.portalDirection[facing]), Portal.portalSize[facing & 1], facing);
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
        let difference = !axis ? otherLeft - thisLeft : otherTop - thisTop;
        if (containsAxis && hitbox.hit(this.hitbox))
            return Portal.unitDirection[axis].scale(-difference);
        return null;
    }
    draw() {
        for (let i = 0; i < this.hitbox.size.x; i += halfSize)
            for (let j = 0; j < this.hitbox.size.y; j += halfSize) {
                window.$game.ctx.fillStyle = `rgba(114, 14, 233, 1)`;
                window.$game.ctx.fillRect(this.hitbox.position.x + i, this.hitbox.position.y + j, halfSize, halfSize);
                // window.$game.ctx.drawImage(/*TODO:*/, position.x + i, position.j, basicSize,);
            }
    }

    /**
     *
     * @param {Vector} position
     * @param {Edge} edge
     */
    static valid(position, edge) {
        const leftUp = position.addVector(Portal.portalDirection[edge.facing]);
        const rightDown = leftUp.addVector(Portal.portalSize[edge.facing & 1]);

        console.debug(leftUp, rightDown, edge.hitbox);

        return (edge.hitbox.contains(leftUp) && edge.hitbox.contains(rightDown));
    }
}
