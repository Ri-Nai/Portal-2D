class Bullet extends Entity {
    constructor(position, size, velocity) {
        super(position, size, velocity);
        this.destroyed = false;
        this.isBullet = true;
    }
    update(deltaTime) {
        if (this.destroyed) return;
        let direction = this.velocity.normalize();
        let length = this.velocity.scale(deltaTime).magnitude();
        for (let i = 0; i < length; ++i) {
            if (this.checkPortal(direction)) {
                direction = this.velocity.normalize();
                continue;
            }
            this.hitbox.position.addEqual(direction);
            let centeredPosition = this.hitbox.getCenter();

        }
    }
}
