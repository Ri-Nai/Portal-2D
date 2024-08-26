class Entity {
    /**
     *
     * @param {Vector} position
     * @param {Vector} size
     * @param {Vector} velocity
     */
    constructor(position, size, velocity = new Vector()) {
        /**
         * @type {Vector}
         */
        this.position = position;  // 实体的当前位置

        /**
         * @type {Vector}
         */
        this.velocity = velocity;  // 实体的速度

        /**
         * @type {Hitbox}
         */
        this.hitbox = new Hitbox(position, size);  // 实体的碰撞盒
        this.MaxSpeed = 6;
        this.portalBuffer = 3;
        this.inPortal = 0;
        this.flyingBuffer = 240;
        this.isflying = 0;

    }
    getCenter() {
        return this.hitbox.position.addVector(this.hitbox.size.scale(0.5));
    }
    checkHit(hitbox, operate) {
        let hitboxes = window.$game.map.blocks;
        for (let tile of hitboxes) {
            if (tile.hitbox.hit(hitbox)) {
                operate();
                return true;
            }
        }
        return false;
    }

    checkPortal(delta) {
        // return false;

        let portals = window.$game.view.portals;
        if (portals[ 0 ].type == -1 || portals[ 1 ].type == -1)
            return false;
        this.hitbox.position.addEqual(delta);
        for (let i = 0; i < 2; ++i) {
            let flag = portals[ i ].isMoveIn(this.hitbox);
            if (flag) {
                let infacing = portals[ i ].infacing;
                let newPosition = this.moveOutPortalPosition(portals[ i ^ 1 ]);
                if (newPosition == null)
                    break;
                if (this.velocity.dot(Portal.unitDirection[ infacing ]) <= this.MaxSpeed * 1.2) {
                    if (Portal.unitDirection[ infacing ].x != 0)
                        this.velocity.x = Portal.unitDirection[ infacing ].x * this.MaxSpeed * 1.2;
                    else
                        this.velocity.y = Portal.unitDirection[ infacing ].y * this.MaxSpeed * 1.2;
                }
                this.velocity = Portal.unitDirection[ infacing ].scale(this.velocity.magnitude());
                this.rotateVelocity(infacing, portals[ i ^ 1 ].facing);
                if (portals[ i ^ 1 ].facing & 1)
                    this.isflying = this.flyingBuffer;
                this.hitbox.position = newPosition;
                return true;
            }
        }
        this.hitbox.position.addEqual(delta.scale(-1));
        return false;
    }
    moveOutPortalPosition(portal) {
        //从碰撞箱顶点开始的offsets
        let offsets = [
            new Vector(0, -this.hitbox.size.y),
            new Vector(-this.hitbox.size.x, 0),
            new Vector(0, Portal.portalWidth),
            new Vector(Portal.portalWidth, 0)
        ];
        let newPosition = new Vector(portal.hitbox.position.x, portal.hitbox.position.y).addVector(offsets[ portal.facing ]);
        // newPosition.addEqual(diff);
        if (portal.facing & 1)
            newPosition.addEqual(new Vector(0, Portal.portalRadius - 0.5 * this.hitbox.size.y));
        else
            newPosition.addEqual(new Vector(Portal.portalRadius - 0.5 * this.hitbox.size.x, 0));
        newPosition = newPosition.round();
        if (this.checkHit(new Hitbox(newPosition, this.hitbox.size), () => { }))
            return null;
        this.inPortal = this.portalBuffer;
        return newPosition;
    }
    /**
 *
 * @param {Portal} portal
 */
    moveOutPortalPosition(portal) {
        //从碰撞箱顶点开始的offsets
        let offsets = [
            new Vector(0, -this.hitbox.size.y),
            new Vector(-this.hitbox.size.x, 0),
            new Vector(0, Portal.portalWidth),
            new Vector(Portal.portalWidth, 0)
        ];
        let newPosition = new Vector(portal.hitbox.position.x, portal.hitbox.position.y).addVector(offsets[ portal.facing ]);
        // newPosition.addEqual(diff);
        if (portal.facing & 1)
            newPosition.addEqual(new Vector(0, Portal.portalRadius - 0.5 * this.hitbox.size.y));
        else
            newPosition.addEqual(new Vector(Portal.portalRadius - 0.5 * this.hitbox.size.x, 0));
        newPosition = newPosition.round();
        if (this.checkHit(new Hitbox(newPosition, this.hitbox.size), () => { }))
            return null;
        this.inPortal = this.portalBuffer;
        return newPosition;
    }
    rotateVelocity(infacing, outfacing) {
        let angle = Math.PI / 2 * ((infacing - outfacing + 4) % 4);
        this.velocity = this.velocity.rotate(angle);
        this.jumping.jumpVelocity = -this.velocity.y;
    }
    isOnGround() {
        //试着判断y轴向下+1是否会与地碰撞
        if (this.velocity.y < 0)
            return false;
        if (this.checkPortal(new Vector(0, 1)))
            return false;
        this.hitbox.position.y += 1;
        let collided = this.checkHit(this.hitbox, () => { });
        this.hitbox.position.y -= 1;
        if (collided)
            this.isflying = 0;
        return collided;
    }
    /**
 *
 * @param {Vector} velocity
 * @param {number} deltaTime
 * @returns {number}
 */
    rigidMove(deltaTime) {
        //移动路程需要乘上deltaTime
        //round是因为，如果沾上浮点数判断，这辈子有了
        let move = this.velocity.scale(deltaTime).round();
        let flag = 0;
        let moveDirection = (delta, value) => {
            if (this.checkPortal(delta)) {
                return false;
            }

            this.hitbox.position.addEqual(delta);
            // 判断在这个方向上是否发生碰撞，如果未发生碰撞就向前move
            let collided = this.checkHit(this.hitbox, () => { this.hitbox.position.addEqual(delta.scale(-1)); });
            if (collided)
                flag |= 1 << value;
            // 两位二进制代表发生碰撞的维度（状态压缩）
            // & 1代表与x碰撞，& 2代表与y碰撞
            return !collided;
        };
        let dir = Math.sign(move.x);
        for (let i = 0; i != move.x; i += dir) {
            if (!moveDirection(new Vector(dir, 0), 0))
                break;
        }
        move = this.velocity.scale(deltaTime).round();
        dir = Math.sign(move.y);
        for (let i = 0; i != move.y; i += dir) {
            if (!moveDirection(new Vector(0, dir), 1))
                break;
        }
        return flag;
    }
}
