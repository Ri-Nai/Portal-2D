class TextureManager {
    constructor() {
    }
    async load() {
        this.texturesURL = await window.$game.dataManager.loadJSON("./assets/imgs/Textures.json");
        this.textures = {};
        Object.keys(this.texturesURL).forEach(async (kind) => {
            this.textures[ kind ] = {};
            await (Object.keys(this.texturesURL[ kind ]).forEach(async (id) => {
                this.textures[ kind ][ id ] = await createImageBitmap(await window.$game.dataManager.loadImg(this.texturesURL[ kind ][ id ]));
            }));
        });
        console.log(this.textures);
    }
    getTexture(kind, id) {
        return this.textures[ kind ][ id ];
    }
}
