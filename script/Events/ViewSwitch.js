class ViewSwitch extends GameEvent {
    constructor (id, type, position, size, toUrl) {
        super(id, type, position, size, []);
        this.toUrl = toUrl;
        this.onlyPlayer = true;
        this.canInteract = false;
    }

    update(t) {
        /**
         * @type {Entity[]}
         */
        const entities = [window.$game.view.entities[0]];
        let isActivate = false;
        entities.forEach((entity) => {
            if (this.hitbox.hit(entity.hitbox)) {
                if (isActivate) return;
                this.activate();
                isActivate = true;
            }
        });
        this.activated = isActivate;
        if (!isActivate) {
            this.deactivate();
        }
    }

    onActivate() {
        window.$game.switchView(this.toUrl);
    }
    onDeactivate() {

    }
}
