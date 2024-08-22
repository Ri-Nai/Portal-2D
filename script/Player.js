class Jumping {
    constructor(baseJump, maxJump, gravity, coyoteTime, jumpBufferTime) {
        this.baseJump = baseJump;
        this.maxJump = maxJump;
        this.gravity = gravity;
        this.coyoteTime = coyoteTime;
        this.jumpBufferTime = jumpBufferTime;

        this.isJumping = false;
        this.isFalling = false;
        this.jumpVelocity = 0;
        this.chargeTime = 0;
        this.coyoteTimer = 0;
        this.jumpBuffer = 0;
        this.isSpaceHeld = false;
    }

    // Check if player can jump, manage coyote time and jump buffer
    canJump(onGround, deltaTime) {
        if (onGround) {
            this.coyoteTimer = this.coyoteTime;
            this.isJumping = false;
            this.isFalling = false;
            this.jumpVelocity = 0;
        } else {
            if (!this.isJumping)
                this.isFalling = true;
            this.coyoteTimer = Math.max(this.coyoteTimer - deltaTime, 0);
        }
        if (!this.isJumping && this.jumpBuffer > 0 && (this.isFalling && this.coyoteTimer > 0 || onGround)) {
            this.startJump();
        }
    }

    startJump() {
        this.isJumping = true;
        this.isFalling = false;
        this.chargeTime = 0;
        this.jumpBuffer = 0;
        this.coyoteTimer = 0;
    }

    updateJump(isSpaceHeld, deltaTime) {
        if (this.isJumping) {
            if (isSpaceHeld && this.chargeTime < this.maxJump) {
                this.chargeTime += deltaTime;
                this.jumpVelocity = Math.min(this.baseJump + (this.chargeTime / this.maxJump) * (this.maxJump - this.baseJump), this.maxJump);
            } else {
                this.jumpVelocity -= this.gravity * deltaTime;
            }
        } else if (this.isFalling) {
            this.jumpVelocity += this.gravity * deltaTime;
        }
    }

    applyJump(position, deltaTime) {
        position.y -= this.jumpVelocity * deltaTime;
        return position;
    }

    reduceJumpBuffer(deltaTime) {
        this.jumpBuffer = Math.max(this.jumpBuffer - deltaTime, 0);
    }

    setJumpBuffer() {
        this.jumpBuffer = this.jumpBufferTime;
    }
    setFalling() {
        this.isFalling = true;
        this.isJumping = false;
    }
    resetJump() {
        this.isJumping = false;
        this.isFalling = false;
        this.jumpVelocity = 0;
    }
}


class Player extends Entity {

    constructor(position, size) {
        super(position, size);
        //this.velocity.y === -this.jumping.jumpVelocity
        this.jumping = new Jumping();
        this.facing = 1;
        this.isSpaceHeld = false;
        this.MaxSpeed = 6;
    }

    isOnGround() {
        let hitbox = this.hitbox;
        let hitboxes = window.$game.map.blocks;
        hitbox.position.y;
        for (let tile of hitboxes)
            if (tile.hitbox.hit(hitbox))
                return true;
        return false;
    }
    moveHitbox(move, hitboxes) {
        let dir = Math.sign(move.x);
        let pos = this.position;
        let hitbox = this.hitbox;
        let flag = 0;
        let fun = (delta, value) => {
            hitbox.position.addEqual(delta);
            let collided = false;
            for (let tile of hitboxes) {
                if (hitbox.hit(tile.hitbox)) {
                    collided = true;
                    break;
                }
            }
            pos.addEqual(dir, 0);
            if (collided) {
                flag |= value;
                return false;
            }
            return true
        }
        for (let i = 0; i != move.x; i += dir) {
            if (!fun(new Vector(dir, 0), 1))
                break;
        }
        dir = Math.sign(move.y);
        for (let i = 0; i != move.y; i += dir) {
            if (!fun(new Vector(0, dir), 2))
                break;
        }
        return flag;
    }

    rigidMove(velocity, callback) {
        let move = velocity.round();
        callback(this.moveHitbox(move, window.$game.map.blocks));
    }
    updateJumping(deltaTime) {
        if (window.$game.keyboard.isKeyDown("Space")) {
            if (!this.isSpaceHeld)
                this.jumping.setJumpBuffer();
            this.isSpaceHeld = true;
        }
        else
            this.isSpaceHeld = false;
        this.jumping.canJump(this.isOnGround(), deltaTime);
        this.jumping.updateJump(this.isSpaceHeld, deltaTime);
    }
    updateX(deltaTime) {
        let moveLeft = window.$game.keyboard.isKeysDown([ "A", "Left" ]);
        let moveRight = window.$game.keyboard.isKeysDown([ "D", "Right" ]);
        let move = 0;
        if (moveLeft)
            this.facing = move = 1;
        if (moveRight)
            this.facing = move = -1;
        let nextVelocityX = this.velocity.x;
        if (move == 0)
            nextVelocityX = nextVelocityX * Math.exp(-0.5);
        else {
            nextVelocityX = move * Math.min(Math.sqrt(nextVelocityX * nextVelocityX + 10) * deltaTime, this.MaxSpeed);
        }
        return nextVelocityX;
    }
    update(deltaTime) {
        this.updateJumping(deltaTime);
        let nextVelocityY = this.jumping.jumpVelocity;
        let nextVelocityX = this.updateX(deltaTime);
        this.rigidMove(new Vector(nextVelocityY, nextVelocityX), (side) => {
            if (side & 1)
                nextVelocityX = 0;
            if (side & 2)
                nextVelocityY = 0;
        });
        this.velocity.x = nextVelocityX;
        this.velocity.y = nextVelocityY;
        if (nextVelocityY == 0) {
            this.jumping.jumpVelocity = 0;
            this.jumping.setFalling();
        }
    }
    draw() {
        for (let i = 0; i < this.hitbox.size.x; i += BasicSize)
            for (let j = 0; j < this.hitbox.size.y; j += BasicSize) {
                window.$game.ctx.fillStyle = `rgba(221, 100, 0, 1)`;
                window.$game.ctx.fillRect(this.hitbox.position.x + i, this.hitbox.position.y + j, BasicSize, BasicSize);
                // window.$game.ctx.drawImage(/*TODO:*/, position.x + i, position.j, BasicSize,);
            }
    }
}
