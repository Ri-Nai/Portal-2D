class GlaDOS extends Entity {
    static GlaDOSX = basicSize;
    static GLaDOSY = basicSize;
    static BloodLimit = 20;
    constructor() {
        this.hitbox = createHitbox(
            new Vector(16 * basicSize - GlaDOS.GlaDOSX / 2, 9 * basicSize - GlaDOS.GLaDOSY / 2),
            new Vector(16 * basicSize + GlaDOS.GlaDOSX / 2, 9 * basicSize + GlaDOS.GLaDOSY / 2)
        );
        this.shootingBuffetTime = 60;
        this.movingBufferTime = 1200;
        this.tragetPosition = this.hitbox.position.copy();
        this.shootingBuffer = 0;
        this.movingBuffer = this.movingBufferTime;
        this.blood = BloodLimit;
        this.bullets = [];
    }
    update(deltaTime) {
        deltaTime = 60 * deltaTime / 1000;
        let dels = [];
        function random(min, max) {
            return Math.random() * (max - min) + min;
        }
        this.shootingBuffer = Math.max(0, this.shootingBuffer - deltaTime - Math.random() * deltaTime / 2);
        this.movingBuffer = Math.max(0, this.movingBuffer - deltaTime - Math.random() * deltaTime);
        if (this.shootingBuffer == 0) {
            let player = window.$game.view.player;
            let direction = player.hitbox.getCenter().subtract(this.hitbox.getCenter()).normalize();
            let velocity = direction.scale(Math.random() * 5);
            velocity.x += Math.random() - 1;
            velocity.y += Math.random() - 1;
            this.bullets.push(new Bullet(this.hitbox.getCenter(), velocity, this.type));
            this.shootingBuffer = this.shootingBuffetTime;
        }
        if (this.movingBuffer == 0) {
            // this.tragetPosition = this.hitbox.getCenter().add(new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1));
            this.tragetPosition = new Vector(random(0, 30 * basicSize - GlaDOS.GlaDOSX), random(0, 16 * basicSize - GlaDOS.GLaDOSY));
            this.tragetPosition.addEqual(new Vector(2 * basicSize, 2 * basicSize));
            this.movingBuffer = this.movingBufferTime;
        }
        this.hitbox.position.addEqual(this.tragetPosition.subtract(this.hitbox.position).scale(deltaTime) * random(0.1, 0.5) * random(0.2, 0.5) * random(0.3, 0.5));
        for (let i of this.bullets) {
            i.update(deltaTime, this);
            if (i.destroyed)
                dels.push(i);
        }
        this.bullets = this.bullets.filter(i => !dels.includes(i));
    }
    draw() {
        window.$game.ctx.fillStyle = Gel.gelColors[ this.type ];
        window.$game.ctx.fillRect(this.position.x, this.position.y, GelDispenser.gelDispenserX, GelDispenser.gelDispenserY);
        for (let i of this.gels)
            i.draw();
    }
}
