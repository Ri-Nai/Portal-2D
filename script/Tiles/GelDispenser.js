class GelDispenser {
    static shootOffset = [
        new Vector(0.1 * basicSize, -0.8 * basicSize),
        new Vector(-0.8 * basicSize, 0.1 * basicSize),
        new Vector(0.1 * basicSize, basicSize),
        new Vector(basicSize, 0.1 * basicSize)
    ];
    static gelDispenserX = basicSize;
    static gelDispenserY = basicSize;
    constructor(position, times, facing, type) {
        this.position = position;
        this.facing = facing;
        this.times = times;
        this.shootPosition = position.addVector(GelDispenser.shootOffset[ this.facing ]);
        this.gels = [];
        this.bufferTime = 60;
        this.now = 120;
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
        // window.$game.ctx.fillStyle = Gel.gelColors[ this.type ];
        // window.$game.ctx.fillRect(this.position.x, this.position.y, GelDispenser.gelDispenserX, GelDispenser.gelDispenserY);
        const texture = window.$game.textureManager.getTexture("gelDispensers", "0-0");
        let angle = -(this.facing - 1 + 4 & 3) * 90;
        const rotated = window.$game.textureManager.rotateTexture(texture, angle);
        window.$game.ctx.drawImage(
            rotated,
            this.position.x + offsetSize, this.position.y + offsetSize, GelDispenser.gelDispenserX, GelDispenser.gelDispenserY);
        for (let i of this.gels)
            i.draw();
    }
}
