const basicSize = 40;
const halfSize = 20;
class Tile {
    /**
     *
     * @param {number} type
     * @param {Vector} position
     * @param {Vector} size
     */
    constructor(type, position, size) {
        this.type = type;  // 纹理
        this.hitbox = new Hitbox(position, size); // 每个 Tile 有一个 Hitbox
    }
    draw() {
        for (let i = 0; i < this.hitbox.size.x; i += basicSize)
            for (let j = 0; j < this.hitbox.size.y; j += basicSize) {
                window.$game.ctx.fillStyle = `rgba(0, ${0}, ${this.type * 100}, 1)`;
                window.$game.ctx.fillRect(this.hitbox.position.x + i, this.hitbox.position.y + j, basicSize, basicSize);
                // window.$game.ctx.drawImage(/*TODO:*/, position.x + i, position.j, basicSize,);
            }
    }
}
