class Portal extends Tile {
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
    /**
     *
     * @param {number} type
     * @param {Vector} position
     * @param {Vector} idNumber
     */
    constructor(type, position, idNumber) {
        this.exitDirection = type % 4;
        this.idNumber = idNumber;
        super(type, position.add(portalDirection[type & 3]), Portal.portalSize[type & 1]);
    }

}
