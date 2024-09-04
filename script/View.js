class ViewData {
    constructor() {
        this.player = null;
        this.cubes = null;
        this.gelDispensers = null;
        this.portals = null;
        this.GLaDOS = false;
    }
    load(data) {
        this.player = copyVector(data.player);
        this.cubes = data.cubes;
        this.gelDispensers = data.gelDispensers;
        this.portals = data.portals;
        this.GLaDOS = Boolean(data.GLaDOS);
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

    constructor() {
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
        super();

        this.map = map;

        this.cubes = [];
        this.gelDispensers = [];
        this.player = new Player(viewData.player.copy());
        this.GLaDOS = new GLaDOS(viewData.GLaDOS);

        viewData.cubes.forEach(i => this.cubes.push(new Cube(copyVector(i))));
        viewData.gelDispensers.forEach(i => this.gelDispensers.push(new GelDispenser(copyVector(i.position), i.times, i.facing, i.type)));

        this.gelledEdgeList = new GelledEdgeList();
        /**
         * @type {Entity[]}
        */
        this.entities = [ this.player ];
        this.entities.push(...this.cubes);
        /**
         * @type {EventList}
        */
        this.events = this.map.events;
        this.dramaEvents = this.map.dramaEvents;

        this.computations.push((t) => this.player.update(t.interval));
        this.cubes.forEach(i => this.computations.push((t) => i.update(t.interval)));
        this.gelDispensers.forEach(i => this.computations.push((t) => i.update(t.interval)));
        this.computations.push((t) => this.events.update(t.interval));
        this.computations.push((t) => this.dramaEvents.update(t.interval));
        this.computations.push((t) => this.GLaDOS.update(t.interval));
        this.computations.push((t) => window.$game.achievementManager.update(t));

        /**
         * @type {PortalGun}
         */
        this.portalGun = new PortalGun();
        this.portals = viewData.portals.map(portalData => {
            return new Portal(portalData.type, copyVector(portalData.position), portalData.facing);

        });
        this.computations.push((t) => {
            this.portalGun.update(this.player.getCenter(), this.mouse.position);
            if (!this.player.blockMove) {
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

                this.portalGun.isHit = false;

                if (Portal.valid(position, edge, this.portals[ this.portalGun.flyingType ^ 1 ])) {
                    position = Portal.fixPosition(position, edge);

                    this.portals[ this.portalGun.flyingType ] = new Portal(this.portalGun.flyingType, position, edge.facing);
                }
            }
        });

        // 在这里执行所有渲染便于控制渲染顺序
        this.renderings.push(() => this.map.draw(() => this.GLaDOS.draw()));
        this.gelDispensers.forEach(i => this.renderings.push(() => i.draw()));
        this.cubes.forEach(i => this.renderings.push(() => i.draw()));
        this.renderings.push(() => this.gelledEdgeList.draw());
        this.renderings.push(() => this.events.draw());
        this.renderings.push(() => this.player.draw());
        this.renderings.push(() => this.portals[ 0 ].draw());
        this.renderings.push(() => this.portals[ 1 ].draw());
        this.renderings.push((t) => {this.portalGun.draw(t);});
    }
}
