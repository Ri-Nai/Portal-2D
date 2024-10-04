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
         * @type {KeyboardManager}
         */
        let keyboard = new KeyboardManager();

        /**
         * @type {MouseManager}
        */
        let mouse = new MouseManager(document.querySelector("#game-container"), this.canvas);
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


        this.map = new MapManager();
        this.viewData = new ViewData();
        this.dialogManager = new DialogManager();
        this.textureManager = new TextureManager();
        this.soundManager = new SoundManager();
        this.eventManager = new EventManager();
        this.achievementManager = new AchievementManager();

        this.stop = false;
        this.isPaused = false;

        this.store = new Store();
        this.statistics = {
            portal: 0,
            bullet: 0,
            restart: 0,
            jump: 0,
            jumpTime: 0,
        };
        window.$store = this.store;

        this.savePopup = new Save();
        this.loadPopup = new Load((data) => {
            Store.set("parfait", JSON.stringify(data.parfait));
            Store.set("camera", JSON.stringify(data.camera));
            Store.set("statistics", JSON.stringify(data.statistics ?? {}));
            Object.keys(data.statistics ?? {}).forEach((key) => {
                window.$game.statistics[key] = data.statistics[key];
            });
            window.$game.switchView(data.url);
            this.loadPopup.hide();
        });

        this.controlMenu = document.querySelector('#control');
        this.resumeBtn = document.querySelector('#control-resume');
        this.resumeBtn.addEventListener('click', () => this.resume());
        this.restartBtn = document.querySelector('#control-restart');
        this.restartBtn.addEventListener('click', () => this.restart());
        this.backBtn = document.querySelector('#control-back');
        this.backBtn.addEventListener('click', () => this.exit());
        this.saveBtn = document.querySelector('#control-save');
        this.saveBtn.addEventListener('click', () => this.savePopup.show());
        this.loadBtn = document.querySelector('#control-load');
        this.loadBtn.addEventListener('click', () => this.loadPopup.show());

        this.deadScreen = new DeadScreen();

        this.chapterNow = 'Room1';

        this.splash = new Splash();
    }

    async init(filename = 'Room1.json') {
        await this.textureManager.load();
        await this.soundManager.load();
        await this.achievementManager.load();
        await this.load(filename);
    }

    async load(filename = 'Room1.json') {
        await this.map.loadFromURL('./assets/stages/maps/' + filename);
        // await this.dialogManager.loadFromURL('./assets/stages/dialogs/' + filename);
        await this.viewData.loadFromURL('./assets/stages/viewdatas/' + filename);
        this.loaded = true;
        this.view = new PortalView(this.map, this.viewData);

        this.chapterNow = filename.split('.')[ 0 ];
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
        this.renderings.push(() => this.view.draw());

        const fps = new FrameRate();
        this.computations.push((t) => fps.display(t.timestamp));

        this.renderings.push(() => this.inputManager.mouse.draw());

        this.computations.push((t) => { if (this.inputManager.keyboard.isKeyDown('Esc')) { this.pause(); } });
        // this.dialogManager.prints();
        window.requestAnimationFrame((timestamp) => this.loop(timestamp, prev));
    }

    /**
     * @param {number} timestamp frame interval in milliseconds
     * @param {number} prev previous frame timestamp
     */
    async loop(timestamp, prev) {
        // console.log(Store.get("achievements"));
        const interval = timestamp - prev;
        const now = timestamp;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.eventManager.handle();

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

    async fadeIn() {
        this.canvas.classList.remove('fadeOut');
        this.canvas.classList.add('fadeIn');

        await wait(500);
        this.canvas.classList.remove('fadeIn');
    }
    async fadeOut() {
        this.canvas.classList.remove('fadeIn');
        this.canvas.classList.add('fadeOut');

        await wait(500);
        // this.canvas.classList.remove('fadeOut');
    }

    async rebuild(oprerate) {
        await this.fadeOut();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        await oprerate();
        await this.fadeIn();
    }

    async restart() {
        this.restartBtn.blur();
        this.isPaused = true;
        this.statistics.restart++;
        await this.rebuild(async () => {
            await this.eventManager.clear();
            await this.resetView();
            this.resume();
        });
    }

    async resetView() {
        Store.set("statistics", JSON.stringify(this.statistics));
        this.load(this.chapterNow + '.json');
        this.stop = true;
        this.view = new PortalView(this.map, this.viewData);
    }

    async switchView(url) {
        Store.set("statistics", JSON.stringify(this.statistics));
        this.isPaused = true;
        await this.rebuild(async () => {
            this.loaded = false;
            await this.dialogManager.clear();
            await this.splash.hide();
            this.eventManager.clear();
            this.map = new MapManager();
            await this.load(url);
            this.resume();
            this.resetView();
        });
    }

    pause() {
        if (!this.isPaused) {
            this.soundManager.playSound('pause');
            this.controlMenu.classList.remove('hidden');
            this.isPaused = true;
            Store.set("statistics", JSON.stringify(this.statistics));
        }
    }

    resume() {
        if (this.isPaused) {
            this.soundManager.playSound('resume');
            this.controlMenu.classList.add('hidden');
            this.isPaused = false;
        }
    }

    exit() {
        Store.set("statistics", JSON.stringify(this.statistics));
        this.savePopup.save("Autosave");
        window.location.href = `./index.html?${window.$store.encode()}`;
    }

    gameEnd() {
        Store.set("statistics", JSON.stringify(this.statistics));
        window.location.href = `./outro.html?${window.$store.encode()}`;
    }
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
