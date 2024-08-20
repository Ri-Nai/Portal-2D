class Game {
    /**
     * @typedef Computation
     * @type {Function}
     */

    /**
     * @type {Array<Computation>}
     */
    computations = [];

    loaded = false

    constructor() {

    }

    async load() {
        this.loaded = true;
    }

    start() {
        if (!this.loaded) {
            console.error('Game not loaded');
            return;
        }
        window.requestAnimationFrame((timestamp) => this.loop(timestamp, 0))
    }

    /**
     * 
     * @param {number} timestamp frame interval in milliseconds
     * @param {number} prev previous frame timestamp
     */
    loop(timestamp, prev) {
        const interval = timestamp - prev;
        this.computations.forEach((comp) => comp(interval))

        window.requestAnimationFrame((timestamp) => this.loop(timestamp, timestamp))
    }
}

