class Animation {
    static Framerate = {
        "run": 6,
        "jump": 30,
        "fall": 30,
        "stand": 8,
    };
    static Frames = {
        "run": 6,
        "jump": 4,
        "fall": 2,
        "stand": 7,
    };
    constructor() {
        this.status = "run";
        this.facing = 1;
        this.frame = 1;
        this.frameRun = 0;
    }
    setStatus(status, facing) {
        if (status != this.status || facing != this.facing) {
            this.frame = 1;
            this.frameRun = 0;
            this.status = status;
            this.facing = facing;
        }
    }
    update(deltaTime) {
        this.frameRun += deltaTime;
        if (this.frameRun > Animation.Framerate[ this.status ]) {
            ++this.frame;
            this.frameRun = 0;
        }
        if (this.frame > Animation.Frames[ this.status ])
            switch (this.status) {
                case "run":
                    this.frame = 1;
                    break;
                case "stand":
                    this.frame = 1;
                    break;
                default:
                    --this.frame;
                    break;
            }
    }
    getFrame() {
        return window.$game.textureManager.getTexture(this.status, this.frame * this.facing);
    }
}
class Player extends Entity {
    static PlayerSize = new Vector(1.2 * basicSize, 1.8 * basicSize);
    static PlayerOffset = new Vector(0.7 * basicSize, 0.4 * basicSize);
    static bloodLimit = 120;
    constructor(position) {
        super(position, Player.PlayerSize);
        this.facing = 1;
        this.animation = new Animation();
        this.blockMove = false;
        this.onEvent = false;
        this.blood = Player.bloodLimit;
    }

    async update(deltaTime) {
        const deltaFrame = 60 * deltaTime / 1000;
        let move = 0;
        this.updateXY(deltaFrame,
            () => {
                if (this.blockMove) return 0;
                let moveLeft = window.$game.inputManager.isKeysDown([ "A", "Left" ]);
                let moveRight = window.$game.inputManager.isKeysDown([ "D", "Right" ]);
                move = 0;
                if (moveLeft)
                    this.facing = move = -1;
                if (moveRight)
                    this.facing = move = 1;

                return move;
            },
            () => {
                if (this.blockMove) return 0;
                return window.$game.inputManager.firstDown("Space", () => {
                    if (this.isOnGround()) {
                        window.$game.statistics.jump++;
                    }
                    this.jumping.setJumpBuffer();
                });
            },
            true
        );
        if (this.jumping.jumpVelocity > 0) {
            this.animation.setStatus("jump", this.facing);
        } else if (!this.isOnGround()) {
            window.$game.statistics.jumpTime += deltaTime;
            if (this.jumping.jumpVelocity < 0)
                this.animation.setStatus("fall", this.facing);
        } else {
            if (move) {
                this.animation.setStatus("run", this.facing);
            }
            else
                this.animation.setStatus("stand", this.facing);
        }
        this.animation.update(deltaFrame);
        this.checkOutOfMap();
    }
    draw() {
        window.$game.ctx.drawImage(
            this.animation.getFrame(),
            this.hitbox.position.x - Player.PlayerOffset.x,
            this.hitbox.position.y - 2 * Player.PlayerOffset.y,
            Player.PlayerSize.x + Player.PlayerOffset.x * 2,
            Player.PlayerSize.y + Player.PlayerOffset.y * 2);
        if (!this.onEvent) return;
        window.$game.ctx.drawImage(
            window.$game.textureManager.getTexture("onEvent", 0),
            this.hitbox.position.x + Player.PlayerSize.x / 2 - halfSize,
            this.hitbox.position.y - halfSize - basicSize,
            basicSize, basicSize);
    }

}
