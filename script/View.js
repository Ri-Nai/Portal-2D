/**
 * @abstract
 */
class View {
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

    constructor(map) {
        this.map = map
    }

    async load() {

    }

    draw() {
        this.renderings.forEach((rendering) => rendering());
    }

    compute(t) {
        this.computations.forEach((comp) => comp(t))
    }

    get mouse() {
        return window.$game.mouse
    }

    get ctx() {
        return window.$game.ctx
    }
}

class PortalView extends View {
    constructor(map) {
        super(map)

        this.player = new Player(
            new Vector(4 * basicSize, 4 * basicSize),
            new Vector(2 * basicSize, 3 * basicSize));

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
                const position = this.portalGun.position;
                if (position && position.x !== this.portal.x && position.y !== this.portal.y) {
                    this.portal = position;
                }
            }
        });

        // 在这里执行所有渲染便于控制渲染顺序
        this.renderings.push(() => this.map.draw());
        this.renderings.push(() => this.player.draw());
        this.renderings.push((t) => {
            this.portalGun.draw(t);
            if (this.portal.x !== 0 && this.portal.y !== 0) {
                this.ctx.fillStyle = 'orange';
                this.ctx.fillRect(this.portal.x, this.portal.y, 4, 4);
            }
        });
    }
}
