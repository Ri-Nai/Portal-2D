class Tile {
    constructor(type, position, size, passable) {
        this.type = type;  // 纹理
        this.hitbox = new Hitbox(position, size); // 每个 Tile 有一个 Hitbox
        this.passable = passable;  // 是否可通过
    }
}
class Layer {
    constructor() {
        this.tiles = [];
        this.opacity = 1;
    }
}
class Map {
    constructor() {
        this.layers = [];
    }
    loadFromJSON(jsonData) {
        const data = JSON.parse(jsonData);
        this.layers = data.layers.map(layerData => {
            const layer = new Layer();
            layer.opacity = layerData.opacity;
            layer.tiles = layerData.tiles.map(tileData => new Tile(
                tileData.type,
                tileData.position,
                tileData.size,
                tileData.passable
            ));
            return layer;
        });
    }

    async loadFromURL(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.json();
            this.loadFromJSON(JSON.stringify(jsonData));
            console.log(this);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }
}
