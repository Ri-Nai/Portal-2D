class DramaEventList {
    constructor(events) {
        if (events)
            this.init(events);
    }

    init(events) {
        this.events = events.map((event) => {
            return new DramaEvent(event);
        });
    }

    update(t) {
        window.$game.view.player.onEvent = false;
        this.events.forEach((event) => {
            event.update(t);
        });
    }

}
