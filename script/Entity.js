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
    }

}
