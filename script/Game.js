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
        this.keyboard = new KeyboardMananger();

        /**
         * @type {MouseManager}
         */
        this.mouse = new MouseManager(this.canvas);

        this.dataManager = new DataManager();

        const fps = new FrameRate();
        this.computations.push((t) => fps.display(t.timestamp));

        /**
         * @type {MapManager}
         */
        this.map = new MapManager();
    }

    async load() {
        const defaultUrl = './assets/maps/Test2.json'
        await this.map.loadFromURL(defaultUrl);
        this.loaded = true;

        this.view = new PortalView(this.map);
        this.computations.push((t) => this.view.compute(t));
        this.renderings.push(() => this.view.draw())
    }

    start() {
        if (!this.loaded) {
            console.error('Game not loaded');
            return;
        }
        this.renderings.push(() => this.mouse.draw());
        window.requestAnimationFrame((timestamp) => this.loop(timestamp, performance.now()));
    }

    /**
     * @param {number} timestamp frame interval in milliseconds
     * @param {number} prev previous frame timestamp
     */
    loop(timestamp, prev) {
        // timestamp = performance.now()
        const interval = timestamp - prev;
        const now = timestamp;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.computations.forEach((comp) => comp({ timestamp, interval }));
        this.renderings.forEach((render) => render({ timestamp, interval }));

        window.requestAnimationFrame((timestamp) => this.loop(timestamp, now));
    }
}
