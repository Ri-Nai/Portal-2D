class Game {
    /**
     * @typedef Computation
     * @type {Function}
     */

    /**
     * @type {Array<Computation>}
     */
    computations = [];

    /**
     * @type {Array<Computation>}
     */
    renderings = [];

    loaded = false;

    constructor() {
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext('2d');

        /**
         * @type {KeyboardMananger}
         */
        let keyboard = new KeyboardMananger();

        /**
         * @type {MouseManager}
        */
       let mouse = new MouseManager(this.canvas);

       this.inputmanager = new InputManager(keyboard, mouse);
       this.dataManager = new DataManager();

        /**
         * @type {MapManager}
         */
        this.map = new MapManager();
        this.textureManager = new TextureManager();
        this.stop = false;
        this.restartBtn = document.querySelector('#control-restart')
        this.restartBtn.addEventListener('click', () => this.restart())
    }

    async load() {
        const defaultUrl = './assets/maps/Test.json'
        await this.map.loadFromURL(defaultUrl);
        this.loaded = true;
        await this.textureManager.load();
        this.view = new PortalView(this.map);
    }

    start() {
        this.stop = false;
        this.computations = [];
        this.renderings = [];
        if (!this.loaded) {
            console.error('Game not loaded');
            return;
        }

        this.computations.push((t) => this.view.compute(t));
        this.renderings.push(() => this.view.draw())

        const fps = new FrameRate();
        this.computations.push((t) => fps.display(t.timestamp));

        this.renderings.push(() => this.inputmanager.mouse.draw());
        window.requestAnimationFrame((timestamp) => this.loop(timestamp, performance.now()));
    }

    /**
     * @param {number} timestamp frame interval in milliseconds
     * @param {number} prev previous frame timestamp
     */
    loop(timestamp, prev) {
        const interval = timestamp - prev;
        const now = timestamp;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.computations.forEach((comp) => comp({ timestamp, interval }));
        this.renderings.forEach((render) => render({ timestamp, interval }));

        if (this.stop) {
            this.start();
            return;
        }

        window.requestAnimationFrame((timestamp) => this.loop(timestamp, now));
    }

    restart() {
        this.stop = true;
        this.view = new PortalView(this.map);
        this.restartBtn.blur();
    }
}
