class Game {
    /**
     * @typedef Computation
     * @type {Function}
     */

    /**
     * @type {Array<Computation>}
     */
    computations = [];

    loaded = false;

    constructor() {
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext('2d');

        /**
         * @type {KeyboardMananger}
         */
        this.keyboard = new KeyboardMananger();
        this.computations.push((t) => {
            if (this.keyboard.isKeyDown('Space')) {
                console.debug("Space key is pressed");
            }
        });

        /**
         * @type {MouseManager}
         */
        this.mouse = new MouseManager(this.canvas);
        this.computations.push(() => this.mouse.draw());

        this.dataManager = new DataManager();

        const fps = new FrameRate();
        this.computations.push((t) => fps.display(t.timestamp));
        this.map = new MapManager();
        this.player = new Player(
            new Vector(4 * BasicSize, 10 * BasicSize),
            new Vector(2 * BasicSize, 3 * BasicSize));
        this.computations.push((t) => this.player.update(t.interval));
        this.computations.push(() => this.map.draw());
        this.computations.push(() => this.player.draw());
        // this.player = new Player();
    }

    async load() {
        await this.map.loadFromURL('./assets/maps/Test.json');
        this.loaded = true;
    }

    start() {
        if (!this.loaded) {
            console.error('Game not loaded');
            return;
        }
        window.requestAnimationFrame((timestamp) => this.loop(timestamp, 0));
    }

    /**
     * @param {number} timestamp frame interval in milliseconds
     * @param {number} prev previous frame timestamp
     */
    loop(timestamp, prev) {
        const interval = timestamp - prev;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.computations.forEach((comp) => comp({ timestamp, interval }));

        window.requestAnimationFrame((timestamp) => this.loop(timestamp, timestamp));
    }
}
