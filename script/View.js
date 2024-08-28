class ViewData {
    constructor() {
        this.player = null;
        this.cubes = null;
        this.gelDispensers = null;
        this.portals = null;
    }
    load(data) {
        this.player = copyVector(data.player);
        this.cubes = data.cubes;
        this.gelDispensers = data.gelDispensers;
        this.portals = data.portals;
    }

    async loadFromURL(url) {
        try {
            const response = await window.$game.dataManager.loadJSON(url);
            this.load(response);
            console.log(this);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }
}
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
        this.map = map;
    }

    async load() {

    }

    draw() {
        this.renderings.forEach((rendering) => rendering());
    }

    compute(t) {
        this.computations.forEach((comp) => comp(t));
    }

    get mouse() {
        return window.$game.inputManager.mouse;
    }

    get ctx() {
        return window.$game.ctx;
    }
}

class PortalView extends View {
    constructor(map, viewData) {
        super(map);

        this.cubes = [];
        this.gelDispensers = [];
        this.player = new Player(viewData.player.copy());

        viewData.cubes.forEach(i => this.cubes.push(new Cube(copyVector(i))));
        viewData.gelDispensers.forEach(i => this.gelDispensers.push(new GelDispenser(copyVector(i.position), i.times, i.facing, i.type)));

        this.gelledEdgeList = new GelledEdgeList();
        /**
         * @type {Entity[]}
        */
        this.entities = [ this.player ];
        this.entities.push(...this.cubes);
        /**
         * @type {EventManager}
        */
        this.events = this.map.events;

        this.computations.push((t) => this.player.update(t.interval));
        this.cubes.forEach(i => this.computations.push((t) => i.update(t.interval)));
        this.gelDispensers.forEach(i => this.computations.push((t) => i.update(t.interval)));
        this.computations.push((t) => this.events.update(t.interval));

        /**
         * @type {PortalGun}
         */
        this.portalGun = new PortalGun();
        this.portal_positions = [ new Vector(0, 0), new Vector(0, 0) ];
        this.portals = viewData.portals.map(portalData => {
            return new Portal(portalData.type, copyVector(portalData.position), portalData.facing);

        });
        this.computations.push((t) => {
            this.portalGun.update(this.player.getCenter(), this.mouse.position);
            if (!window.$game.dialogManager.isReading) {
                if (this.mouse.left) {
                    this.portalGun.shot(this.player.getCenter(), 0, t);
                }
                if (this.mouse.right) {
                    this.portalGun.shot(this.player.getCenter(), 1, t);
                }
            }
            if (this.portalGun.isHit) {
                let position = this.portalGun.position;
                const edge = this.portalGun.edge;
                this.portal_positions[ this.portalGun.flyingType ] = position;

                this.portalGun.isHit = false;

                if (Portal.valid(position, edge, this.portals[ this.portalGun.flyingType ^ 1 ])) {
                    position = Portal.fixPosition(position, edge);

                    this.portals[ this.portalGun.flyingType ] = new Portal(this.portalGun.flyingType, position, edge.facing);
                }
            }
        });

        // 在这里执行所有渲染便于控制渲染顺序
        this.renderings.push(() => this.map.draw());
        this.gelDispensers.forEach(i => this.renderings.push(() => i.draw()));
        this.cubes.forEach(i => this.renderings.push(() => i.draw()));
        this.renderings.push(() => this.gelledEdgeList.draw());
        this.renderings.push(() => this.player.draw());
        this.renderings.push(() => this.portals[ 0 ].draw());
        this.renderings.push(() => this.portals[ 1 ].draw());
        this.renderings.push((t) => {
            this.portalGun.draw(t);
            this.portal_positions.forEach((pos, index) => {
                if (pos.x === 0 && pos.y === 0) {
                    return;
                }
                this.ctx.fillStyle = this.portalGun.COLOR[ index ];
                this.ctx.fillRect(pos.x, pos.y, 4, 4);
            });
        });
    }
}
