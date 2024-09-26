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
    draw(kind) {
        if (kind == "backgrounds") {
            window.$game.ctx.globalAlpha = 0.7;
            window.$game.ctx.drawImage(
                window.$game.textureManager.getTexture(kind, this.type),
                this.hitbox.position.x,
                this.hitbox.position.y,
                1280,
                1280);
                window.$game.ctx.globalAlpha = 1;
            }
        else if (kind == "backgroundObjects") {
            let offset = 0;
            if (this.type <= 19 && this.type >= 17 || this.type === 15)
                offset = offsetSize * 1.6
            window.$game.ctx.drawImage(
                window.$game.textureManager.getTexture(kind, this.type),
                this.hitbox.position.x,
                this.hitbox.position.y + offset,
                this.hitbox.size.x,
                this.hitbox.size.y);
        }
        else {
            for (let i = 0; i < this.hitbox.size.x; i += basicSize)
                for (let j = 0; j < this.hitbox.size.y; j += basicSize) {
                    // window.$game.ctx.fillStyle = `rgba(0, ${0}, ${this.type * 100}, 1)`;
                    // window.$game.ctx.fillRect(this.hitbox.position.x + i, this.hitbox.position.y + j, basicSize, basicSize);
                    // console.log(window.$game.textureManager.getTexture(kind, this.type));
                    if (kind != "signs")
                        window.$game.ctx.drawImage(
                            window.$game.textureManager.getTexture(kind, this.type),
                            this.hitbox.position.x + i - offsetSize,
                            this.hitbox.position.y + j - offsetSize,
                            basicSize + offsetSize * 2,
                            basicSize + offsetSize * 2);
                    else {
                        window.$game.ctx.drawImage(
                            window.$game.textureManager.getTexture(kind, this.type),
                            this.hitbox.position.x + i + offsetSize / 2,
                            this.hitbox.position.y + j + offsetSize / 2,
                            basicSize - offsetSize,
                            basicSize - offsetSize);
                    }
                }
        }
    }
}
