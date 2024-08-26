class Event extends Tile {
    /**
     *
     * @param {number} type
     * @param {Vector} position
     * @param {Vector} size
     * @param {string[]} affect
     */
    constructor(id, type, position, size, affect) {
        super(type, position, size);
        this.id = id;
        this.activated = false;
        this.affect = affect;
    }

    update(t) {
        /**
         * @type {Entity[]}
         */
        const entities = window.$game.view.entities;
        let isActivate = false
        entities.forEach((entity) => {
            if (this.hitbox.hit(entity.hitbox)) {
                if (isActivate) return;
                this.activate();
                isActivate = true
            }
        })
        this.activated = isActivate
        if (!isActivate) {
            this.deactivate();
        }
    }

    activate() {
        this.activated = true;
        this.onActivate();
        this.affect.forEach((id) => {
            const event = window.$game.view.events.getEvent(id);
            event.activate();
        })
    }

    deactivate() {
        this.activated = false;
        this.onDeactivate();
        this.affect.forEach((id) => {
            const event = window.$game.view.events.getEvent(id);
            event.deactivate();
        })
    }

    onActivate() {
    }

    onDeactivate() {
    }

    draw() {

    }
}

class Events {
    /**
     * @typedef IEvent
     * @type {
     *   {
     *     [k: string]: {
     *       type: number,
     *       position: { x: number, y: number},
     *       size: {x: number, y: number},
     *       affect: string[]
     *     }
     *   }
     * }
     */

    /**
     *
     * @param {IEvent} events
     */
    constructor(events) {
        if (events)
            this.init(events)
    }

    /**
     *
     * @param {IEvent} events
     */
    init(events) {
        /**
         * @type {Map<string, Event>}
         */
        this.events = new Map();

        for (let [k, v] of Object.entries(events)) {
            this.events.set(k, new Event(
                k,
                v.type,
                new Vector(v.position.x, v.position.y),
                new Vector(v.size.x, v.size.y),
                v.affect
            ));
        }
    }

    update(t) {
        this.events.forEach((event) => {
            event.update(t);
        })
    }

    getEvent(id) {
        return this.events.get(id);
    }
}
