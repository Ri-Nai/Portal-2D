class Tile {
    constructor(position, size, texture, passable) {
        this.hitbox = new Hitbox(position, size); // 每个 Tile 有一个 Hitbox
        this.texture = texture;  // 纹理
        this.passable = passable;  // 是否可通过
    }
}
