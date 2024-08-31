class DataManager {
    constructor() {

    }
    async loadJSON(src) {
        let jsonp = document.createElement('script');
        jsonp.src = src;
        let json = await new Promise((resolve) => {
            // 为JSONP提供回调函数
            this.resolve = resolve;

            // 挂在在DOM上, 开始加载
            document.getElementById('resource').appendChild(jsonp);
        });
        // document.getElementById('resource').removeChild(jsonp);
        return json;
    }
    async loadImg(src) {
        let img = await new Promise(resolve => {
            let img = new Image();
            img.src = src;
            document.getElementById('resource').appendChild(img);
            img.onload = () => resolve(img);
        });
        return img;
    }
    async loadSpritesheet(src) {
        let json = await this.loadJSON(src);
        let imgsrc = src.split('/');
        imgsrc[imgsrc.length - 1] = json.meta.image;
        imgsrc = imgsrc.join('/');
        let img = await this.loadImg(imgsrc);

        return new Spritesheet(json, img);;
    }
}
