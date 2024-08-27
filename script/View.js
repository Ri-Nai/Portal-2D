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
        return window.$game.inputmanager.mouse
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
            new Vector(1.8 * basicSize, 2.8 * basicSize));

        this.cube = new Cube(
            new Vector(7 * basicSize, 4 * basicSize),
            new Vector(1 * basicSize, 1 * basicSize));
        this.computations.push((t) => this.player.update(t.interval));
        this.computations.push((t) => this.cube.update(t.interval));

        /**
         * @type {Entity[]}
         */
        this.entities = [this.player, this.cube];

        /**
         * @type {EventManager}
         */
        this.events = this.map.events;
        this.computations.push((t) => this.events.update(t));

        /**
         * @type {PortalGun}
         */
        this.portalGun = new PortalGun();
        this.portal_positions = [new Vector(0, 0), new Vector(0, 0)];
        this.portals = [new Portal(-1, new Vector(), 0), new Portal(-1, new Vector(), 0)];
        this.computations.push((t) => {
            this.portalGun.update(this.player.getCenter(), this.mouse.position);
            if (this.mouse.left) {
                this.portalGun.shot(this.player.getCenter(), 0, t);
            }
            if (this.mouse.right) {
                this.portalGun.shot(this.player.getCenter(), 1, t);
            }
            if (this.portalGun.isHit) {
                let position = this.portalGun.position;
                const edge = this.portalGun.edge;
                this.portal_positions[this.portalGun.flyingType] = position;

                this.portalGun.isHit = false;

                if (Portal.valid(position, edge, this.portals[this.portalGun.flyingType ^ 1])) {
                    position = Portal.fixPosition(position, edge)

                    this.portals[this.portalGun.flyingType] = new Portal(this.portalGun.flyingType, position, edge.facing);
                }
            }
        });

        // 在这里执行所有渲染便于控制渲染顺序
        this.renderings.push(() => this.map.draw());
        this.renderings.push(() => this.player.draw());
        this.renderings.push(() => this.cube.draw());
        this.renderings.push(() => this.portals[0].draw());
        this.renderings.push(() => this.portals[1].draw());
        this.renderings.push((t) => {
            this.portalGun.draw(t);
            this.portal_positions.forEach((pos, index) => {
                if (pos.x === 0 && pos.y === 0) {
                    return ;
                }
                this.ctx.fillStyle = this.portalGun.COLOR[index];
                this.ctx.fillRect(pos.x, pos.y, 4, 4);
            })
        });
    }
}
