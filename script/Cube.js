class Cube extends Entity {
    constructor(position, size) {
        super(position, size);
        this.canPick = false;
        this.isPicked = false;
        this.isE = false;
    }
    hitRange() {
        return this.hitbox.add(new Vector(-basicSize / 2, -basicSize / 2), new Vector(basicSize, basicSize));
    }
    update(deltaTime) {
        let player = window.$game.view.player;
        if (player.hitbox.hit(this.hitRange())) {
            this.canPick = true;
        }
        else this.canPick = false;
        if (window.$game.keyboard.isKeyDown("E")) {
            if (!this.isE)
            {
                if (this.canPick)
                    this.isPicked = !this.isPicked;
            }
            this.isE = true;
        }
        else
            this.isE = false;
        if (this.isPicked) {
            this.hitbox.position.x = player.hitbox.position.x;
            this.hitbox.position.y = player.hitbox.position.y;
            let offset = new Vector(-0.4 * basicSize + (player.facing + 1) * 0.9 * basicSize, basicSize);
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
    }
    draw() {
        window.$game.ctx.drawImage(
            window.$game.textureManager.getTexture("entities", 1 + (!this.isPicked && this.canPick)),
            this.hitbox.position.x - offsetSize,
            this.hitbox.position.y - offsetSize,
            basicSize + offsetSize * 2,
            basicSize + offsetSize * 2);
    }
}
