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
    setFalling(x) {
        this.isFalling = x;
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
        ++hitbox.position.y;
        for (let hit of hitboxes)
            if (hit.hit(hitbox))
                return True;
        return False;
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
        nextVelocityX = this.velocity.x;
        if (move == 0)
            nextVelocityX = nextVelocityX * Math.exp(-0.5);
        else {
            nextVelocityX = move * Math.min(Math.sqrt(nextVelocityX * nextVelocityX + 10) * deltaTime, this.MaxSpeed);
        }

    }
    update(deltaTime) {
        this.updateJumping(deltaTime);
        nextVelocityY = this.jumping.jumpVelocity;
        nextVelocityX = updateX(deltaTime);
    }
}
