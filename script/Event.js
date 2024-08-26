class GameEvent extends Tile {
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
        if (!this.activated)
            this.onActivate();
        this.activated = true;
        this.affect.forEach((id) => {
            const event = window.$game.view.events.getEvent(id);
            event.activate();
        })
    }

    deactivate() {
        if (this.activated)
            this.onDeactivate();
        this.activated = false;
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
