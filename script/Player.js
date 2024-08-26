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
            //蓄力跳
            if (!this.isFalling && isSpaceHeld && this.chargeTime < this.maxJump) {
                // console.log("jumpingnow", this.chargeTime);
                this.chargeTime += deltaTime;
                this.jumpVelocity = Math.min(this.baseJump + (this.chargeTime / this.maxJump) * (this.maxJump - this.baseJump), this.maxJump);
                //蓄力跳
            } else {
                this.isFalling = true;
                this.jumpVelocity -= this.gravity * deltaTime;
            }
        } else if (this.isFalling) {
            this.jumpVelocity -= this.gravity * deltaTime;
        }
        this.jumpVelocity = Math.max(-5 * this.baseJump, this.jumpVelocity);
        this.reduceJumpBuffer(deltaTime);
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
        //this.velocity.y === -this.jumping.jumpVelocity恒成立
        this.jumping = new Jumping(5, 10, 0.5, 10, 1);
        this.facing = 1;
        this.isSpaceHeld = false;

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
            this.facing = move = -1;
        if (moveRight)
            this.facing = move = 1;
        let nextVelocityX = this.velocity.x;
        if (!this.isflying && Math.abs(nextVelocityX) <= this.MaxSpeed) {
            if (move == 0)
                nextVelocityX = nextVelocityX * Math.exp(-0.5 * deltaTime);
            else
                nextVelocityX = move * Math.min(Math.sqrt(nextVelocityX * nextVelocityX + 10 * deltaTime), this.MaxSpeed);
        }
        else {
            if (move == 0) {
                if (this.isOnGround())
                    nextVelocityX = Math.sqrt(nextVelocityX * nextVelocityX - 0.32 * deltaTime * nextVelocityX * nextVelocityX) * Math.sign(nextVelocityX);
                else
                    nextVelocityX = Math.sqrt(nextVelocityX * nextVelocityX - 0.02 * deltaTime * nextVelocityX * nextVelocityX) * Math.sign(nextVelocityX);
            }
            else if (move * nextVelocityX > 0) {
                if (this.isOnGround())
                    nextVelocityX = Math.sqrt(nextVelocityX * nextVelocityX - 0.3 * deltaTime * nextVelocityX * nextVelocityX) * Math.sign(nextVelocityX);
                else
                    nextVelocityX = Math.sqrt(nextVelocityX * nextVelocityX - 0.01 * deltaTime * nextVelocityX * nextVelocityX) * Math.sign(nextVelocityX);
            }
            else {
                if (this.isOnGround())
                    nextVelocityX = Math.sqrt(nextVelocityX * nextVelocityX - 0.5 * deltaTime * nextVelocityX * nextVelocityX) * Math.sign(nextVelocityX);
                else
                    nextVelocityX = Math.sqrt(nextVelocityX * nextVelocityX - 0.1 * deltaTime * nextVelocityX * nextVelocityX) * Math.sign(nextVelocityX);
            }
        }
        return nextVelocityX;
    }



    update(deltaTime) {
        //此时的deltaTime当前环境下的1帧，在60帧环境下走了多少帧
        //于是在moveRigid函数中，需要将velocity乘上deltaTime代表在当前环境下走过的路程
        deltaTime = 60 * deltaTime / 1000;
        this.inPortal = Math.max(this.inPortal - deltaTime, 0);
        this.isflying = Math.max(this.isflying - deltaTime, 0);
        this.updateJumping(deltaTime);
        let nextVelocityY = -this.jumping.jumpVelocity;
        let nextVelocityX = this.velocity.x;
        if (!this.inPortal)
            nextVelocityX = this.updateX(deltaTime);
        this.velocity.x = nextVelocityX;
        this.velocity.y = nextVelocityY;
        let side = this.rigidMove(deltaTime);
        if (side & 1)
            this.velocity.x = 0, this.isflying = 0;
        if (side & 2)
            this.velocity.y = 0;
        if (this.velocity.y == 0) {
            this.jumping.jumpVelocity = 0;
            this.jumping.setFalling();
        }
    }
    draw() {
        window.$game.ctx.fillStyle = `rgba(221, 100, 0, 1)`;
        window.$game.ctx.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.size.x, this.hitbox.size.y);

    }
}
