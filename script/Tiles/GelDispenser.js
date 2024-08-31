class GelDispenser {
    static shootOffset = [
        new Vector(basicSize / 2, 0),
        new Vector(0, basicSize / 2),
        new Vector(basicSize / 2, basicSize),
        new Vector(basicSize, basicSize / 2)
    ];
    static gelDispenserX = basicSize;
    static gelDispenserY = basicSize;
    constructor(position, times, facing, type) {
        this.position = position;
        this.facing = facing;
        this.times = times;
        this.shootPosition = position.addVector(GelDispenser.shootOffset[ facing ]);
        this.gels = [];
        this.bufferTime = 60;
        this.now = 0;
        this.type = type;
    }
    getType() {
        if (this.type == -1)
            return Math.floor(Math.random() * 3);
        return this.type;
    }
    update(deltaTime) {
        deltaTime = 60 * deltaTime / 1000;
        let dels = [];
        this.now = Math.max(0, this.now - deltaTime);
        if (this.now == 0) {
            this.gels.push(new Gel(this.shootPosition.copy(), Gel.gelSize, Portal.unitDirection[ this.facing ].scale(this.times), this.getType()));
            this.now = this.bufferTime;
        }
        for (let i of this.gels) {
            i.update(deltaTime);
            if (i.destroyed) dels.push(i);
        }
        this.gels = this.gels.filter(i => !dels.includes(i));
    }
    draw() {
        window.$game.ctx.fillStyle = Gel.gelColors[ this.type ];
        window.$game.ctx.fillRect(this.position.x, this.position.y, GelDispenser.gelDispenserX, GelDispenser.gelDispenserY);
        for (let i of this.gels)
            i.draw();
    }
}
