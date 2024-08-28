class Door extends Tile {
    /**
     *
     * @param {number} type
     * @param {Vector} position
     * @param {Vector} size
     * @param {DoorEvent} event
     */
    constructor(type, position, size, event) {
        super(type, position, size);
        this.event = event;
        this.size = size
        this.position = position
    }

    draw() {
        window.$game.ctx.fillStyle = this.event.activated ? `green` : `red`;
        window.$game.ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }

    onActivate() {
        console.debug("Door: activated")
        this.hitbox = new Hitbox(new Vector(), new Vector());
    }

    onDeactivate() {
        this.hitbox = new Hitbox(this.position, this.size);
    }
}

class DoorEvent extends GameEvent {
    /**
     *
     * @param {string} id
     * @param {number} type
     * @param {Vector} position
     * @param {Vector} size
     */
    constructor(id, type, position, size) {
        super(id, type, position, size, [])
        this.block = new Door(101, position, size, this);
    }

    update() {}

    onActivate() {
        console.debug("DoorEvent: activated")
        this.block.onActivate();
    }

    onDeactivate() {
        this.block.onDeactivate();
    }
}
