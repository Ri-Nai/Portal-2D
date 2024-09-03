class Button extends Tile {
    /**
     *
     * @param {number} type
     * @param {Vector} position
     * @param {Vector} size
     * @param {ButtonEvent} event
     */
    constructor(type, position, size, event) {
        super(type, position, size);
        this.event = event;
        this.size = size;
        this.position = position;
        this.activated = false;
    }

    onActivate() {
        // console.debug('Button activated')
        this.activated = true;
        this.hitbox = new Hitbox(new Vector(this.position.x, this.position.y + this.size.y / 2), new Vector(this.size.x, this.size.y / 2));
        window.$game.soundManager.playSound("button", 0);
    }

    onDeactivate() {
        this.activated = false;
        this.hitbox = new Hitbox(this.position, this.size);
        window.$game.soundManager.playSound("button", 1);
    }

    draw() {
        // window.$game.ctx.fillStyle = `yellow`;
        // window.$game.ctx.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.size.x, this.hitbox.size.y);
        window.$game.ctx.drawImage(
            window.$game.textureManager.getTexture("buttons", Number(this.activated)),
            8, 25, 64, 15,
            this.position.x,
            this.position.y,
            this.size.x,
            this.size.y - offsetSize
        );
    }
}

class ButtonEvent extends GameEvent {
    /**
     *
     * @param {string} id
     * @param {number} type
     * @param {Vector} position
     * @param {Vector} size
     * @param {string[]} affect
     */
    constructor(id, type, position, size, affect) {
        super(id, type, position, size, affect);
        this.block = new Button(10, position, size, this);
        this.onlyPlayer = false;
        this.canInteract = false;
    }

    /**
     * @return {Entity[]}
     */
    get entities() {
        return window.$game.view.entities;
    }

    update() {
        let isActivate = false;
        this.entities.forEach((entity) => {
            if (
                this.hitbox.hit(new Hitbox(
                    new Vector(entity.hitbox.position.x, entity.hitbox.position.y + 1),
                    entity.hitbox.size
                ))
            ) {
                this.activate();
                isActivate = true;
            }
        });

        if (!isActivate) {
            this.deactivate();
        }
    }
    draw() {
        this.block.draw();
    }
    onActivate() {
        this.block.onActivate();
    }
    onDeactivate() {
        this.block.onDeactivate();
    }
}
