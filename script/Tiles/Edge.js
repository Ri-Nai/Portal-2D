class Edge extends Tile {
    /**
     *
     * @param {number} type
     * @param {Vector} position
     * @param {Vector} size
     * @param {number} facing
     */
    constructor(type, position, size, facing) {
        super(type, position, size);
        this.facing = facing;
    }
    draw() {
        // for (let i = 0; i < this.hitbox.size.x; i += halfSize)
        //     for (let j = 0; j < this.hitbox.size.y; j += halfSize) {
        //         window.$game.ctx.fillStyle = `rgba(0, ${(this.facing + 3) * 50}, ${this.type * 100}, 1)`;
        //         window.$game.ctx.fillRect(this.hitbox.position.x + i, this.hitbox.position.y + j, halfSize, halfSize);
        //         // window.$game.ctx.drawImage(/*TODO:*/, position.x + i, position.j, basicSize,);
        //     }
    }
}
