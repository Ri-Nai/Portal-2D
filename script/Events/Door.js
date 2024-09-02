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
        this.size = size;
        this.position = position;
        this.bufferTime = 5;
        this.buffer = 5;
        this.frame = 1;
    }

    draw() {
        // window.$game.ctx.fillStyle = this.event.activated ? `green` : `red`;
        // window.$game.ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        window.$game.ctx.drawImage(
            window.$game.textureManager.getTexture("doors", this.frame),
            this.position.x,
            this.position.y,
            this.size.x,
            this.size.y);
    }

    onActivate() {
        console.debug("Door: activated");
        this.activated = true;
        this.hitbox = new Hitbox(new Vector(), new Vector(1, 1));
    }

    onDeactivate() {
        this.activated = false;
        this.hitbox = new Hitbox(this.position, this.size);
    }
    update(deltaTime) {
        this.buffer -= deltaTime * 60 / 1000;
        if (this.buffer <= 0) {
            if (this.activated)
                this.frame = Math.min(7, this.frame + 1);
            else
                this.frame = Math.max(1, this.frame - 1);
            this.buffer = this.bufferTime;
        }
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
        super(id, type, position, size, []);
        this.block = new Door(101, position, size, this);
    }

    update(deltaTime) {
        this.block.update(deltaTime);
    }
    draw() {
        this.block.draw();
    }
    onActivate() {
        console.debug("DoorEvent: activated");
        this.block.onActivate();
    }

    onDeactivate() {
        this.block.onDeactivate();
    }
}
