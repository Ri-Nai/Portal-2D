class Cube extends Entity {
    static cubeSize = 0.8 * basicSize;
    constructor(position, size = new Vector(Cube.cubeSize, Cube.cubeSize)) {
        super(position, size);
        this.canPick = false;
        this.isPicked = false;
        this.hasPicked = 0;
    }
    hitRange() {
        return this.hitbox.add(new Vector(-basicSize / 2, -basicSize / 2), new Vector(basicSize, basicSize));
    }
    async update(deltaTime) {
        let player = window.$game.view.player;
        if (player.hitbox.hit(this.hitRange())) {
            this.canPick = true;
        }
        else this.canPick = false;
        if (this.canPick)
            window.$game.inputManager.firstDown("E", () => {
                    this.isPicked = !this.isPicked;
                    this.hasPicked += 1;
            });
        if (this.isPicked) {
            this.hitbox.position.x = player.hitbox.position.x;
            this.hitbox.position.y = player.hitbox.position.y;
            let offset = new Vector(player.facing * Cube.cubeSize + (player.facing + 1) * (Player.PlayerSize.x - Cube.cubeSize) / 2, 0.32 * Player.PlayerSize.y);
            this.hitbox.position.addEqual(offset);
            this.velocity.x = player.velocity.x;
            this.velocity.y = player.velocity.y;
            this.jumping.jumpVelocity = player.jumping.jumpVelocity;
        }
        else {

            deltaTime = 60 * deltaTime / 1000;
            this.updateXY(deltaTime, () => { return 0; }, () => { return 0; }, false);
        }
        this.hitbox.position = this.hitbox.position.round();
        this.checkOutOfMap();
    }
    draw() {
        window.$game.ctx.drawImage(
            window.$game.textureManager.getTexture("cubes", Number(!this.isPicked && this.canPick)),
            this.hitbox.position.x - offsetSize,
            this.hitbox.position.y - offsetSize,
            Cube.cubeSize + offsetSize * 2,
            Cube.cubeSize + offsetSize * 2);
    }
}
