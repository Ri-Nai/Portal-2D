class EventManager {
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
            this.init(events);
    }

    /**
     *
     * @param {IEvent} events
     */
    init(events) {
        /**
         * @type {Map<string, GameEvent>}
         */
        this.events = new Map();

        for (let [k, v] of Object.entries(events)) {
            this.events.set(k, createEvent(k, v));
        }
    }

    update(t) {
        this.events.forEach((event) => {
            event.update(t);
        });
    }

    getEvent(id) {
        return this.events.get(id);
    }

    draw() {
        this.events.forEach((event) => {
            event.draw();
        });
    }
}

const createEvent = (id, event) => {
    // ButtonEvent
    if (event.type === 1) {
        const e = new ButtonEvent(
            id,
            event.type,
            new Vector(event.position.x, event.position.y),
            new Vector(event.size.x, event.size.y),
            event.affect
        );

        window.$game.map.blocks.push(e.block);

        return e;
    }
    // Wire
    if (event.type === 2) {
        return new Wire(
            id,
            event.type,
            new Vector(event.position.x, event.position.y),
            new Vector(event.size.x, event.size.y),
            event.affect
        );
    }
    return new GameEvent(
        id,
        event.type,
        new Vector(event.position.x, event.position.y),
        new Vector(event.size.x, event.size.y),
        event.affect
    )
};
