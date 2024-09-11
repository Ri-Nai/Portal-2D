class CameraEvent extends AchivementEvent {
    constructor(id, type, position, size, affect, facing) {
        super(id, type, position, size, affect);
        this.exist = !this.getHistory().includes(id);
        this.name = "camera";
        this.facing = facing;
    }
    update() {
        if (!this.exist) return;
        let isActivate = false;
        if (this.hitbox.contains(window.$game.view.portalGun.position)) {
            if (isActivate) return;
            this.activate();
            isActivate = true;
        }
        this.activated = isActivate;
        if (!isActivate) {
            this.deactivate();
        }
    }

    draw() {
        if (!this.exist) return;
        window.$game.ctx.drawImage(
            window.$game.textureManager.getTexture(this.name, this.facing),
            this.hitbox.position.x - offsetSize,
            this.hitbox.position.y,
            this.hitbox.size.x + offsetSize * 2,
            this.hitbox.size.y + offsetSize * 2);
    }
}
