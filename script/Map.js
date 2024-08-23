const BasicSize = 40;
class Tile {
    constructor(type, position, size) {
        this.type = type;  // 纹理
        this.hitbox = new Hitbox(position, size); // 每个 Tile 有一个 Hitbox
    }
    draw() {
        for (let i = 0; i < this.hitbox.size.x; i += BasicSize / 2)
            for (let j = 0; j < this.hitbox.size.y; j += BasicSize / 2) {
                window.$game.ctx.fillStyle = `rgba(0, ${this.type * 100}, ${this.type * 200}, 1)`;
                window.$game.ctx.fillRect(this.hitbox.position.x + i, this.hitbox.position.y + j, BasicSize / 2, BasicSize / 2);
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

        /**
         * @type {Tile[]}
         */
        this.edges = [];
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
                new Vector(tileData.position.x, tileData.position.y),
                new Vector(tileData.size.x, tileData.size.y)
            ));
            return layer;
        });
        this.blocks = this.layers[ 4 ].tiles;
        this.edges = this.layers[ 5 ].tiles;
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
