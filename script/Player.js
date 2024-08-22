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
        //this.velocity.y === -this.jumping.jumpVelocity
        this.jumping = new Jumping(5, 10, 0.5, 10, 1);
        this.facing = 1;
        this.isSpaceHeld = false;
        this.MaxSpeed = 6;
    }

    isOnGround() {
        let hitbox = this.hitbox;
        let hitboxes = window.$game.map.blocks;
        hitbox.position.y += 1;
        // console.log(hitbox.position.y)
        for (let tile of hitboxes) {

            if (tile.hitbox.hit(hitbox)) {
                hitbox.position.y -= 1;
                return true;
            }
        }
        hitbox.position.y -= 1;

        return false;
    }
    moveHitbox(move, hitboxes) {
        let dir = Math.sign(move.x);
        let copy_hitbox = this.hitbox;
        let flag = 0;

        let move_direction = (delta, value) => {
            copy_hitbox.position.addEqual(delta);
            let collided = false;
            for (let tile of hitboxes) {
                if (copy_hitbox.hit(tile.hitbox)) {
                    collided = true;
                    if (value == 0)
                        console.log(copy_hitbox.position.x, copy_hitbox.position.y, tile.hitbox.position.x, tile.hitbox.position.y);
                    console.log("1", copy_hitbox.position.x, copy_hitbox.position.y, tile.hitbox.position.x, tile.hitbox.position.y);
                    copy_hitbox.position.addEqual(new Vector(-delta.x, -delta.y));
                    // copy_hitbox.position.addEqual(new Vector(-delta.x, -delta.y));
                    console.log("2", copy_hitbox.position.x, copy_hitbox.position.y, tile.hitbox.position.x, tile.hitbox.position.y);

                    break;
                }
            }
            // this.hitbox.position.addEqual(delta);
            if (collided) {
                flag |= 1 << value;
                // & 1代表与x碰撞
                // & 2代表与y碰撞
                return false;
            }
            return true;
        };
        for (let i = 0; i != move.x; i += dir) {
            if (!move_direction(new Vector(dir, 0), 0))
                break;
        }
        dir = Math.sign(move.y);
        for (let i = 0; i != move.y; i += dir) {
            if (!move_direction(new Vector(0, dir), 1))
                break;
        }
        return flag;
    }

    rigidMove(velocity) {
        let move = velocity.round();
        return this.moveHitbox(move, window.$game.map.blocks);
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
        let moveLeft = window.$game.keyboard.isKeysDown(["A", "Left"]);
        let moveRight = window.$game.keyboard.isKeysDown(["D", "Right"]);
        if (moveRight)
            console.debug("Write");
        let move = 0;
        if (moveLeft)
            this.facing = move = -1;
        if (moveRight)
            this.facing = move = 1;
        let nextVelocityX = this.velocity.x;
        if (move == 0)
            nextVelocityX = nextVelocityX * Math.exp(-0.5);
        else {
            /*TODO:修改超速时在地面减速 */
            nextVelocityX = move * Math.min(Math.sqrt(nextVelocityX * nextVelocityX + 10 * deltaTime), this.MaxSpeed);
        }
        return nextVelocityX;
    }
    update(deltaTime) {
        deltaTime = 60 * deltaTime / 1000;
        this.updateJumping(deltaTime);
        let nextVelocityY = -this.jumping.jumpVelocity;
        let nextVelocityX = this.updateX(deltaTime);
        let side = this.rigidMove(new Vector(nextVelocityX, nextVelocityY));
        if (side & 1)
            nextVelocityX = 0;
        if (side & 2)
            nextVelocityY = 0;
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
