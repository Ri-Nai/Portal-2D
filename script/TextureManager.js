class TextureManager {
    constructor() {
    }
    async load() {
        this.texturesURL = await window.$game.dataManager.loadJSON("./assets/imgs/Textures.json");
        this.textures = {};
        let resources = new Map();
        let urls = [];

        Object.keys(this.texturesURL).forEach(async (kind) => {
            Object.keys(this.texturesURL[kind]).forEach(async (id) => {
                urls.push(this.texturesURL[kind][id])
            });
        });

        const tasks = urls.map(async (url) => {
            const ctx = await window.$game.dataManager.loadImg(url);
            resources.set(url, await createImageBitmap(ctx));
        })

        await Promise.all(tasks)

        Object.keys(this.texturesURL).forEach(async (kind) => {
            this.textures[kind] = {};
            Object.keys(this.texturesURL[kind]).forEach(async (id) => {
                this.textures[kind][id] = resources.get(this.texturesURL[kind][id]);
            });
        });

        console.log("texture: ", this.textures);
    }
    getTexture(kind, id) {
        console.debug("getTexture: ", kind, id);
        return this.textures[ kind ][ id ];
    }
}
