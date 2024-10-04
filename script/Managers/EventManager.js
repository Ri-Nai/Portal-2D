class EventManager {
    constructor() {
        this.head = null; // 指向队列的第一个元素
        this.tail = null;  // 指向队列的最后一个元素
        this.hasProcess = false;
        this.processing = false;
    }

    add(events) {
        for (let event of events) {
            if (this.tail == null) {
                this.head = this.tail = event;
            } else {
                this.tail.next = event;
                this.tail = event;
            }
        }
        this.hasProcess = true;
    }

    async handle() {
        if (!this.hasProcess)
            return;
        this.hasProcess = false;
        let player = window.$game.view.player;
        if (!this.head || this.head == null)
        {
            player.blockMove = false;
            return;
        }
        player.blockMove = true;
        let event = this.head;
        // console.log(event);
        this.processing = true;
        switch (event.type) {
            case "delay":
                await wait(event.time);
                break;
            case "dialog":
                if (window.$game.dialogManager.printing)
                    window.$game.dialogManager.clear();
                window.$game.dialogManager.printing = false;
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
            case "showImg":
                await window.$game.splash.showImg(event.url);
                break;
            case "hideImg":
                await window.$game.splash.hide();
                break;
            case "fadeHalf":
                await window.$game.splash.fadeHalf();
                break;
            case "playBGM":
                window.$game.soundManager.playBGM(event.name);
                break;
            case "deathSelect":
                await window.$game.deadScreen.show().then(async () => {
                    // retry
                    await window.$game.restart();
                }, async () => {
                    // cancel
                    Store.set("ending", "bad")
                    await window.$game.gameEnd();
                });
                break;
            case "gameEnd":
                await window.$game.gameEnd();
                break;
            default:
                break;
        }
        // player.blockMove = false;
        this.processing = false;
        if (this.head == null) {
            return;
        }
        this.head = this.head.next; // 移除已处理的事件
        if (this.head == null)
            this.tail = null;
        this.hasProcess = true;
    }

    clear() {
        this.hasProcess = false;
        this.processing = false;
        window.$game.view.player.blockMove = true;
        this.head = this.tail = null;
    }
}
