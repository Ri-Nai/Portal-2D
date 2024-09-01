class EventManager {
    constructor() {
        this.head = null; // 指向队列的第一个元素
        this.tail = null;  // 指向队列的最后一个元素
        this.process = false;
    }

    add(events) {
        for (let event of events) {
            if (this.tail === null) {
                this.head = this.tail = event;
            } else {
                this.tail.next = event;
                this.tail = event;
            }
        }
        this.process = true;
    }

    async handle() {
        if (!this.process)
            return;
        this.process = false;
        if (this.head === null)
            return;
        let player = window.$game.view.player;
        player.blockMove = true;
        let event = this.head;
        switch (event.type) {
            case "delay":
                await wait(event.time);
                break;
            case "dialog":
                await window.$game.dialogManager.prints(event.texts);
                break;
            case "fadeIn":
                await window.$game.fadeIn();
                break;
            case "fadeOut":
                await window.$game.fadeOut();
                break;
            case "turn":
                player.facing = event.facing;
                break;
            default:
                break;
        }
        this.head = this.head.next; // 移除已处理的事件
        if (this.head === null)
            this.tail = null;
        this.process = true;
        player.blockMove = false;
    }
}
