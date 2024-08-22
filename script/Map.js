const BasicSize = 40;
class Tile {
    constructor(type, position, size) {
        this.type = type;  // 纹理
        this.hitbox = new Hitbox(position, size); // 每个 Tile 有一个 Hitbox
    }
    draw() {
        for (let i = 0; i < this.hitbox.size.x; i += BasicSize)
            for (let j = 0; j < this.hitbox.size.y; j += BasicSize) {
                window.$game.ctx.fillStyle = `rgba(0, 0, ${this.type * 50}, 1)`;
                window.$game.ctx.fillRect(this.hitbox.position.x + i, this.hitbox.position.y + j, BasicSize, BasicSize);
                // window.$game.ctx.drawImage(/*TODO:*/, position.x + i, position.j, BasicSize,);
            }
    }
}
class Layer {
    constructor() {
        /**
         * @type {Tile[]}
        */
        this.tiles = [];
        /**
         * @type {number}
         */
        this.opacity = 1;
    }
    draw() {
        for (let i of this.tiles)
            i.draw();
    }
}
class MapManager {
    constructor() {
        /**
         * @type {Layer[]}
         */
        this.layers = [];

        /**
         * @type {Tile[]}
         */
        this.blocks = [];
    }
    loadFromJSON(jsonData) {
        const data = JSON.parse(jsonData);
        this.load(data);
    }

    load(data) {
        this.layers = data.layers.map(layerData => {
            const layer = new Layer();
            layer.opacity = layerData.opacity;
            layer.tiles = layerData.tiles.map(tileData => new Tile(
                tileData.type,
                tileData.position,
                tileData.size
            ));
            return layer;
        });
        this.blocks = this.layers[ 4 ];
    }

    async loadFromURL(url) {
        try {
            const response = await window.$game.dataManager.loadJSON(url);
            this.load(response);
            console.log(this);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }
    draw() {
        for (let i of this.layers)
            i.draw();
    }
}
