class GLaDOS extends Entity {
    static GlaDOSX = 4 * basicSize;
    static GLaDOSY = 8 * basicSize;
    static BloodLimit = 20;
    constructor(stillAlive) {
        super(
            new Vector(16 * basicSize - GLaDOS.GlaDOSX / 2, 9 * basicSize - GLaDOS.GLaDOSY / 2),
            new Vector(GLaDOS.GlaDOSX, GLaDOS.GLaDOSY),
        )
        this.stillAlive = stillAlive;
        this.shootingBuffetTime = 60;
        this.movingBufferTime = 600;
        this.tragetPosition = this.hitbox.position.copy();
        this.shootingBuffer = 0;
        this.movingBuffer = this.movingBufferTime;
        this.blood = GLaDOS.BloodLimit;
        this.bullets = [];
    }
    update(deltaTime) {
        if (!this.stillAlive) return;
        deltaTime = 60 * deltaTime / 1000;
        let dels = [];
        function random(min, max) {
            return Math.random() * (max - min) + min;
        }
        this.shootingBuffer = Math.max(0, this.shootingBuffer - deltaTime - Math.random() * deltaTime / 2);
        this.movingBuffer = Math.max(0, this.movingBuffer - deltaTime - Math.random() * deltaTime);
        if (this.shootingBuffer == 0) {
            let player = window.$game.view.player;
            let direction = player.hitbox.getCenter().subVector(this.hitbox.getCenter());
            direction.x += random(-5, 5);
            direction.y += random(-5, 5);
            direction = direction.normalize();
            let velocity = direction.scale(Math.random() * 5);
            this.bullets.push(new Bullet(this.hitbox.getCenter(), velocity));
            this.shootingBuffer = this.shootingBuffetTime;
        }
        if (this.movingBuffer == 0) {
            // this.tragetPosition = this.hitbox.getCenter().add(new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1));
            this.tragetPosition = new Vector(random(0, 30 * basicSize - GLaDOS.GlaDOSX), random(0, 16 * basicSize - GLaDOS.GLaDOSY));
            this.tragetPosition.addEqual(new Vector(1 * basicSize, 1 * basicSize));
            this.movingBuffer = this.movingBufferTime;
        }
        this.hitbox.position.addEqual(this.tragetPosition.subVector(this.hitbox.position).scale(deltaTime  * random(0.1, 0.5) * random(0.2, 0.5) * random(0.3, 0.5)));
        for (let i of this.bullets) {
            i.update(deltaTime, this);
            if (i.destroyed)
                dels.push(i);
        }
        if (this.blood <= 0) {
            //TODO: window.$game.eventManager.add();
            this.stillAlive = false;
        }
        this.bullets = this.bullets.filter(i => !dels.includes(i));
    }
    draw() {
        if (!this.stillAlive) return;
        window.$game.ctx.fillStyle = "black";
        window.$game.ctx.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.size.x, this.hitbox.size.y);
        for (let i of this.bullets)
            i.draw();
    }
}
