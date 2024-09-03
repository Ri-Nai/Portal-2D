class DramaEvent extends GameEvent {

    constructor(item) {
        super(item.id, -1, copyVector(item.position), copyVector(item.size), []);
        // this.type = "drama";
        this.onlyPlayer = true;
        this.events = item.events;
        this.events.forEach(element => {
            element.next = null;
        });
        this.canInteract = item.canInteract;
    }
    onActivate() {
        if (!window.$game.eventManager.processing)
            window.$game.eventManager.add(this.events);
    }
}
