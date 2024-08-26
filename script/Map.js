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
        for (let i = 0; i < this.hitbox.size.x; i += halfSize)
            for (let j = 0; j < this.hitbox.size.y; j += halfSize) {
                window.$game.ctx.fillStyle = `rgba(0, ${(this.facing + 3) * 50}, ${this.type * 100}, 1)`;
                window.$game.ctx.fillRect(this.hitbox.position.x + i, this.hitbox.position.y + j, halfSize, halfSize);
                // window.$game.ctx.drawImage(/*TODO:*/, position.x + i, position.j, basicSize,);
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
         * @type {Edge[]}
         */
        this.edges = [];

        this.events = new Events()
    }
    loadFromJSON(jsonData) {
        const data = JSON.parse(jsonData);
        this.load(data);
    }

    load(data) {
        let constructTile = tileData => {
            return new Tile(tileData.type,
                new Vector(tileData.position.x, tileData.position.y),
                new Vector(tileData.size.x, tileData.size.y));
        };
        this.layers = data.layers.map(layerData => {
            const layer = new Layer();
            layer.opacity = layerData.opacity;
            layer.tiles = layerData.tiles.map(constructTile);
            return layer;
        });
        this.blocks = data.blocks.map(blockData => {
            return constructTile(blockData);
        });
        this.edges = data.edges.map(edgeData => {
            return new Edge(edgeData.type,
                new Vector(edgeData.position.x, edgeData.position.y),
                new Vector(edgeData.size.x, edgeData.size.y), edgeData.facing);
        });
        this.events.init(data.events);
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
        for (let i of this.blocks)
            i.draw()
        for (let i of this.edges)
            i.draw()
    }
}
