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
    draw(typename) {
        for (let i of this.tiles) {
            i.draw(typename);
        }
    }
}
class MapManager {
    static mapHitbox = createHitbox(new Vector(0, 0), new Vector(1280, 720));
    static typename = [ "backgrounds", "", "", "backgroundTextures", "", "", "signs" ];
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
        /**
         * @type {Edge[]}
         */
        this.superEdges = [];
        this.events = new EventList();
        this.dramaEvents = new DramaEventList();
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
        this.superEdges = data.super_edges.map(edgeData => {
            return new Edge(edgeData.type,
                new Vector(edgeData.position.x, edgeData.position.y),
                new Vector(edgeData.size.x, edgeData.size.y), edgeData.facing);
        });
        this.events.init(data.events);
        this.dramaEvents.init(data.drama_events);
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
        for (let i = 0; i < this.layers.length - 1; ++i)
            this.layers[ i ].draw(MapManager.typename[ i ]);
        for (let i of this.blocks)
            i.draw("blocks");
        this.layers[ this.layers.length - 1 ].draw(MapManager.typename[ this.layers.length - 1 ]);
    }
}
