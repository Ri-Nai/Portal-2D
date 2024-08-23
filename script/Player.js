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
        this.MaxSpeed = 6;
    }

    isOnGround() {
        let hitbox = this.hitbox;
        let hitboxes = window.$game.map.blocks;
        //试着判断y轴向下+1是否会与地碰撞
        if (this.checkPortal(new Vector(0, 1)))
            return false;
        hitbox.position.y += 1;
        for (let tile of hitboxes) {
            if (tile.hitbox.hit(hitbox)) {
                hitbox.position.y -= 1;
                return true;
            }
        }
        hitbox.position.y -= 1;

        return false;
    }
    /**
     *
     * @param {Portal} portal
     */
    moveOutPortalPosition(portal, diff) {
        //从碰撞箱顶点开始的offsets
        let offsets = [
            new Vector(0, -this.hitbox.size.y - 1),
            new Vector(-this.hitbox.size.x, 0),
            new Vector(0, Portal.portalWidth),
            new Vector(Portal.portalWidth, 0)
        ];
        let newPosition = new Vector(portal.hitbox.position.x, portal.hitbox.position.y).addVector(offsets[ portal.facing ]);
        newPosition.addEqual(diff);
        return newPosition;
    }
    rotateVelocity(infacing, outfacing) {
        let angle = Math.PI / 2 * ((infacing - outfacing + 4) % 4);
        this.velocity = this.velocity.rotate(angle);
        this.jumping.jumpVelocity = -this.velocity.y;
    }
    checkPortal(delta) {
        // return false;
        this.hitbox.position.addEqual(delta);
        let portals = window.$game.view.portals;
        for (let i = 0; i < 2; ++i) {
            let diff = portals[ i ].isMoveIn(this.hitbox);
            if (diff) {
                this.hitbox.position = this.moveOutPortalPosition(portals[ i ^ 1 ], diff);
                this.rotateVelocity(portals[ i ].infacing, portals[ i ^ 1 ].facing);
                console.log(this.hitbox.position);
                return true;
            }
        }
        this.hitbox.position.addEqual(delta.scale(-1));
    }
    moveHitbox(move, hitboxes) {
        let dir = Math.sign(move.x);
        let flag = 0;

        let move_direction = (delta, value) => {
            if (this.checkPortal(delta)) {
                return false;
            }
            this.hitbox.position.addEqual(delta);
            let collided = false;
            // 判断在这个方向上是否发生碰撞，如果未发生碰撞就向前move
            for (let tile of hitboxes) {
                if (this.hitbox.hit(tile.hitbox)) {
                    collided = true;
                    this.hitbox.position.addEqual(delta.scale(-1));
                    //撤回move操作
                    break;
                }
            }
            if (collided) {
                flag |= 1 << value;
                // 两位二进制代表发生碰撞的维度（状态压缩）
                // & 1代表与x碰撞，& 2代表与y碰撞
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

    /**
     *
     * @param {Vector} velocity
     * @param {number} deltaTime
     * @returns {number}
     */
    rigidMove(velocity, deltaTime) {
        //移动路程需要乘上deltaTime
        //round是因为，如果沾上浮点数判断，这辈子有了
        let move = velocity.scale(deltaTime).round();
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
        let moveLeft = window.$game.keyboard.isKeysDown([ "A", "Left" ]);
        let moveRight = window.$game.keyboard.isKeysDown([ "D", "Right" ]);
        let move = 0;
        if (moveLeft)
            this.facing = move = -1;
        if (moveRight)
            this.facing = move = 1;
        let nextVelocityX = this.velocity.x;
        if (Math.abs(nextVelocityX) <= this.MaxSpeed) {
            if (move == 0)
                nextVelocityX = nextVelocityX * Math.exp(-0.5 * deltaTime);
            else
                nextVelocityX = move * Math.min(Math.sqrt(nextVelocityX * nextVelocityX + 10 * deltaTime), this.MaxSpeed);
        }
        else
        {
            if (move == 0)
            {
                if (this.isOnGround())
                    nextVelocityX = Math.sqrt(nextVelocityX * nextVelocityX - 0.32 * deltaTime * nextVelocityX * nextVelocityX) * Math.sign(nextVelocityX);
                else
                    nextVelocityX = Math.sqrt(nextVelocityX * nextVelocityX - 0.02 * deltaTime * nextVelocityX * nextVelocityX) * Math.sign(nextVelocityX);
            }
            else if (move * nextVelocityX > 0)
            {
                if (this.isOnGround())
                    nextVelocityX = Math.sqrt(nextVelocityX * nextVelocityX - 0.3 * deltaTime * nextVelocityX * nextVelocityX) * Math.sign(nextVelocityX);
                else
                    nextVelocityX = Math.sqrt(nextVelocityX * nextVelocityX - 0.01 * deltaTime * nextVelocityX * nextVelocityX) * Math.sign(nextVelocityX);
            }
            else
                nextVelocityX = move * Math.min(Math.sqrt(nextVelocityX * nextVelocityX + 10 * deltaTime), this.MaxSpeed);
        }
        return nextVelocityX;
    }

    getCenter() {
        return this.hitbox.position.addVector(this.hitbox.size.scale(0.5));
    }

    update(deltaTime) {
        //此时的deltaTime当前环境下的1帧，在60帧环境下走了多少帧
        //于是在moveRigid函数中，需要将velocity乘上deltaTime代表在当前环境下走过的路程
        deltaTime = 60 * deltaTime / 1000;
        this.updateJumping(deltaTime);
        let nextVelocityY = -this.jumping.jumpVelocity;
        let nextVelocityX = this.updateX(deltaTime);
        this.velocity.x = nextVelocityX;
        this.velocity.y = nextVelocityY;
        let side = this.rigidMove(new Vector(nextVelocityX, nextVelocityY), deltaTime);
        if (side & 1)
            this.velocity.x = 0;
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
