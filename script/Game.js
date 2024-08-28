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
        /**
        * @type {InputManager}
        */
       this.inputManager = new InputManager(keyboard, mouse);
        /**
        * @type {DataManager}
        */
       this.dataManager = new DataManager();

        /**
         * @type {MapManager}
         */

        this.dialogManager = new DialogManager();

        this.map = new MapManager();
        this.viewData = new ViewData();
        this.textureManager = new TextureManager();

        this.stop = false;
        this.isPaused = false;

        this.controlMenu = document.querySelector('.control')
        this.resumeBtn = document.querySelector('#control-resume');
        this.resumeBtn.addEventListener('click', () => this.resume())
        this.restartBtn = document.querySelector('#control-restart')
        this.restartBtn.addEventListener('click', () => this.restart())
        this.backBtn = document.querySelector('#control-back')
        this.backBtn.addEventListener('click', () => { window.location.href = './start.html'; })
    }

    async init(filename = 'Test1.json') {
        await this.textureManager.load();
        await this.load(filename);
    }

    async load(filename = 'Test1.json') {
        await this.map.loadFromURL('./assets/stages/maps/' + filename);
        await this.dialogManager.loadFromURL('./assets/stages/dialogs/' + filename);
        await this.viewData.loadFromURL('./assets/stages/viewdatas/' + filename);
        this.loaded = true;
        this.view = new PortalView(this.map, this.viewData);
    }

    start(prev = 0) {
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

        this.renderings.push(() => this.inputManager.mouse.draw());

        this.computations.push((t) => { if (this.inputManager.keyboard.isKeyDown('Esc')) { this.pause() } });
        this.dialogManager.prints();
        window.requestAnimationFrame((timestamp) => this.loop(timestamp, prev));
    }

    /**
     * @param {number} timestamp frame interval in milliseconds
     * @param {number} prev previous frame timestamp
     */
    async loop(timestamp, prev) {
        const interval = timestamp - prev;
        const now = timestamp;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.computations.forEach((comp) => comp({ timestamp, interval }));
        this.renderings.forEach((render) => render({ timestamp, interval }));

        if (this.stop) {
            while (!this.loaded) {
                await wait(100);
            }
            this.start(timestamp);
            return;
        }

        const beforePause = performance.now();
        while (this.isPaused) {
            await wait(100);
        }
        const pauseTime = performance.now() - beforePause;

        window.requestAnimationFrame((timestamp) => this.loop(timestamp, now + pauseTime));
    }

    restart() {
        this.stop = true;
        this.view = new PortalView(this.map, this.viewData);
        this.restartBtn.blur();
        this.resume();
    }

    async switchView(url) {
        this.loaded = false;
        this.map = new MapManager();
        await this.load(url);
        this.restart();
    }

    pause() {
        if (!this.isPaused) {
            this.controlMenu.classList.remove('hidden');
            this.isPaused = true;
        }
    }

    resume() {
        if (this.isPaused) {
            this.controlMenu.classList.add('hidden');
            this.isPaused = false;
        }
    }
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
