class Entity {
    /**
     *
     * @param {Vector} position
     * @param {Vector} size
     * @param {Vector} velocity
     */
    constructor(position, size, velocity = new Vector()) {
        this.position = position;  // 实体的当前位置
        this.velocity = velocity;  // 实体的速度
        this.hitbox = new Hitbox(position, size);  // 实体的碰撞盒
    }

}
