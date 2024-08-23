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
        this.computations.push((t) => {
            if (this.keyboard.isKeyDown('Space')) {
                console.debug("Space key is pressed");
            }
        });

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
        this.player = new Player(
            new Vector(4 * BasicSize, 4 * BasicSize),
            new Vector(2 * BasicSize, 3 * BasicSize));

        this.computations.push((t) => this.player.update(t.interval));

        /**
         * @type {PortalGun}
         */
        this.portalGun = new PortalGun();
        // TODO: 在这里实现Portal类
        this.portal = new Vector();
        this.computations.push((t) => {
            this.portalGun.update(this.player.getCenter(), this.mouse.position);
            if (this.mouse.left) {
                this.portalGun.shot(this.player.getCenter(), 'orange', t);
            }
            if (this.portalGun.isHit) {
                const position = this.portalGun.position
                if (position && position.x !== this.portal.x && position.y !== this.portal.y) {
                    this.portal = position;
                }
            }
        });

        // 在这里执行所有渲染便于控制渲染顺序
        this.renderings.push(() => this.map.draw());
        this.renderings.push(() => this.player.draw());
        this.renderings.push((t) => {
            this.portalGun.draw(t)
            if (this.portal.x !== 0 && this.portal.y !== 0) {
                this.ctx.fillStyle = 'orange';
                this.ctx.fillRect(this.portal.x, this.portal.y, 4, 4);
            }
        });

        this.renderings.push(() => this.mouse.draw());
    }

    async load() {
        await this.map.loadFromURL('./assets/maps/Test2.json');
        this.loaded = true;
    }

    start() {
        if (!this.loaded) {
            console.error('Game not loaded');
            return;
        }
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
