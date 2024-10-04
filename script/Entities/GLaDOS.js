class GLaDOS extends Entity {
    static GLaDOSX = 4 * basicSize;
    static GLaDOSY = 8 * basicSize;
    static PictureSizeY = 287 * 2;
    static bloodLimit = 120;
    constructor(stillAlive) {
        super(
            new Vector(16 * basicSize - GLaDOS.GLaDOSX / 2, 9 * basicSize - GLaDOS.GLaDOSY / 2),
            new Vector(GLaDOS.GLaDOSX, GLaDOS.GLaDOSY),
        )
        this.stillAlive = stillAlive;
        this.shootingBuffetTime = 60;
        this.movingBufferTime = 600;
        this.tragetPosition = this.hitbox.position.copy();
        this.shootingBuffer = this.shootingBuffetTime * 2;
        this.movingBuffer = this.movingBufferTime;
        this.blood = GLaDOS.bloodLimit;
        this.bullets = [];
        this.shootingStyle = 0;
        this.shootingFormat = [
            (deltaTime) => this.shootingTrack(deltaTime),
            (deltaTime) => this.shootingRound(deltaTime),
            (deltaTime) => this.shootingRect(deltaTime),
            (deltaTime) => this.shootingFlower(deltaTime)
        ];
        this.baseAngle = 0;
        this.paused = false;
    }
    shootingTrack(deltaTime) {
        this.shootingBuffer -= deltaTime + Math.random() * deltaTime / 2;
        if (this.shootingBuffer <= 0) {
            let player = window.$game.view.player;
            let width = Math.random() * 100 + GLaDOS.GLaDOSX;
            let height = Math.random() * 100 + GLaDOS.GLaDOSY;
            let left = this.hitbox.getCenter().x - width / 2;
            let top = this.hitbox.getCenter().y - height / 2;
            let right = this.hitbox.getCenter().x + width / 2;
            let bottom = this.hitbox.getCenter().y + height / 2;
            let bulletNumber = 10 + random(0, 20);

            let style = 3;

            for (let i = 0; i < bulletNumber; i++) {
                let newPosition = new Vector(random(left, right), random(top, bottom));
                let direction = player.hitbox.getCenter().subVector(newPosition);
                // direction.x += random(-5, 5);
                // direction.y += random(-5, 5);
                direction = direction.normalize();
                let velocity = direction.scale(random(0.5, 5));
                this.bullets.push(new Bullet(newPosition, velocity, style));
            }
            this.shootingBuffer = this.shootingBuffetTime;
        }
    }
    shootingRound(deltaTime) {
        this.shootingBuffer -= deltaTime * 2 + Math.random() * deltaTime * 2;
        let style = 1;
        if (this.shootingBuffer <= 0) {
            let radius = random(1, 10);
            let space = random(20, 40)
            let l = random(-270, -150), r = random(-30, 90);
            for (let i = l; i < r; i += space) {
                let direction = new Vector(cos(i), -sin(i)).scale(radius);
                this.bullets.push(new Bullet(this.hitbox.getCenter().addVector(direction), direction, style));
            }
            this.shootingBuffer = this.shootingBuffetTime;
        }
    }
    shootingRect(deltaTime) {
        this.shootingBuffer -= deltaTime + Math.random() * deltaTime / 2;
        if (this.shootingBuffer <= 0) {
            let width = Math.random() * 100 + GLaDOS.GLaDOSX;
            let height = Math.random() * 100 + GLaDOS.GLaDOSY;
            let left = this.hitbox.getCenter().x - width / 2;
            let top = this.hitbox.getCenter().y - height / 2;
            let right = this.hitbox.getCenter().x + width / 2;
            let bottom = this.hitbox.getCenter().y + height / 2;
            let space = random(10, 30);
            let velocity = random(3, 5);

            let style = 1;

            if (random(0, 1) < 0.2)
                velocity = -velocity;
            for (let i = left; i < right; i += space) {
                // let direction = new Vector(i - this.hitbox.getCenter().x, top - this.hitbox.getCenter().y);
                let direction = new Vector(0, -1);
                // let velocity = direction.scale(Math.random() * 5);
                this.bullets.push(new Bullet(new Vector(i, top), direction.scale(velocity), style));
                direction = new Vector(0, 1);
                this.bullets.push(new Bullet(new Vector(i, bottom), direction.scale(velocity), style));
            }
            for (let i = top; i < bottom; i += space) {
                let direction = new Vector(-1, 0);
                this.bullets.push(new Bullet(new Vector(left, i), direction.scale(velocity), style));
                direction = new Vector(1, 0);
                this.bullets.push(new Bullet(new Vector(right, i), direction.scale(velocity), style));
            }
            this.shootingBuffer = this.shootingBuffetTime;
        }
    }
    shootingFlower(deltaTime) {
        this.shootingBuffer -= deltaTime + Math.random() * deltaTime / 2;
        if (this.shootingBuffer <= 0) {
            const center = this.hitbox.getCenter();
            const numBullets = 36 + random(0, 20); // 子弹数量决定螺旋密度
            const angleStep = 27;  // 每个子弹的角度偏移步长
            let angleOffset = random(0, 360);
            let style = 2;
            for (let i = 1; i <= numBullets; i++) {
                let currentAngle = angleOffset + this.baseAngle + i * angleStep; // 当前子弹的角度
                let radius = i * 2;  // 半径随着子弹序号增大而增大，形成螺旋效果

                // 计算当前子弹的位置
                let direction = new Vector(cos(currentAngle), -sin(currentAngle)).scale(radius);
                let velocity = direction.normalize().scale(radius / 100); // 子弹速度，方向归一化

                // 创建并添加子弹
                this.bullets.push(new Bullet(center.addVector(direction), velocity.scale(1 + i / 100), style));
            }

            this.baseAngle += angleStep;  // 每次发射后基础角度增加，用于下一次射击产生螺旋效果
            this.shootingBuffer = this.shootingBuffetTime;
        }
    }
    update(deltaTime) {
        if (!this.stillAlive) return;
        let player = window.$game.view.player;
        if (player.blockMove) return;
        deltaTime = 60 * deltaTime / 1000;
        let dels = [];

        this.movingBuffer = Math.max(0, this.movingBuffer - deltaTime - Math.random() * deltaTime);
        if (this.movingBuffer == 0) {
            // this.tragetPosition = this.hitbox.getCenter().add(new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1));
            this.tragetPosition = new Vector(random(0, 30 * basicSize - GLaDOS.GLaDOSX), random(0, 16 * basicSize - GLaDOS.GLaDOSY - Player.PlayerSize.y - 100));
            this.tragetPosition.addEqual(new Vector(1 * basicSize, 1 * basicSize));
            this.movingBuffer = this.movingBufferTime;
            this.shootingStyle = Math.floor(Math.random() * this.shootingFormat.length);
        }
        this.shootingFormat[this.shootingStyle](deltaTime);
        this.hitbox.position.addEqual(this.tragetPosition.subVector(this.hitbox.position).scale(deltaTime  * random(0.1, 0.5) * random(0.2, 0.5) * random(0.3, 0.5)));
        for (let i of this.bullets) {
            i.update(deltaTime, this, player);
            if (i.destroyed)
                dels.push(i);
        }
        if (this.blood <= 0 || player.blood <= 0) {
            this.gameEnd();
        }
        const gladosBar = document.getElementById('glados-health-bar');
        gladosBar.style.display = this.stillAlive ? 'block' : 'none';
        const gladosHealth = document.getElementById('glados-health');
        gladosHealth.style.width = (this.blood / GLaDOS.bloodLimit * 100) + '%';

        const playerBar = document.getElementById('player-health-bar');
        playerBar.style.display = 'block';
        const playerHealth = document.getElementById('player-health');
        playerHealth.style.width = (player.blood / Player.bloodLimit * 100) + '%';
        this.bullets = this.bullets.filter(i => !dels.includes(i));
    }
    draw() {
        if (!this.stillAlive) return;
        const texture = window.$game.textureManager.getTexture("GLaDOS");
        window.$game.ctx.drawImage(texture, this.hitbox.position.x, this.hitbox.position.y - GLaDOS.PictureSizeY + this.hitbox.size.y, this.hitbox.size.x, GLaDOS.PictureSizeY);

        for (let i of this.bullets)
            i.draw();
    }
    async gameEnd() {
        if (this.paused) return;
        this.paused = true;
        const stages = await window.$game.dataManager.loadJSON("./assets/stages/events/GLaDOS.json");
        if (this.blood <= 0) {
            this.stillAlive = false;
            Store.set("ending", "good")
            window.$game.eventManager.add(stages[1].events);
        }
        else if (window.$game.view.player.blood <= 0) {
            window.$game.eventManager.add(stages[0].events);
            window.$game.eventManager.add([{
                type: "deathSelect",
            }]);
        }
    }
}
const random = (min, max) => min + Math.random() * (max - min);
const cos = (a) => Math.cos(a * Math.PI / 180);
const sin = (a) => Math.sin(a * Math.PI / 180);
