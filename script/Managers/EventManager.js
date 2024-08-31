class EventManager {
    constructor() {
        this.events = [];
    }
    add(events) {
        this.events.push(...events);
    }
    async handle() {
        if (this.progress != 'start') return;
        let e = this.event;
        this.progress = 'processing';
        let player = window.$game.view.player;
        player.blockMove = true;

        switch (e.type) {
            case "delay":
                await delay(e.time);
                break;
            case "dialog":
                await window.$game.dialogManager.prints(e.text);
                break;
            case "fadeIn":
                await window.$game.fadeIn();
                break;
            case "fadeOut":
                await window.$game.fadeOut();
                break;
            case "turn":
                player.facing = e.facing;
                break;
            case "showCG":
                window.$game.status = "CG";
                let img = await window.$game.dataManager.loadImg(e.src);
                window.$game.ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, window.$game.width, window.$game.height);
                await window.$game.mapManager.fadeIn();
                break;
            case "addTile":
                await window.$game.mapManager.addTile(e.tile);
                break;
            case "removeTile":
                window.$game.mapManager.removeTile(e.id);
                break;
            case "unlockDash":
                window.$game.saveManager.data.canDash = true;
                break;
            case "achieve":
                if (!window.$game.saveManager.hasAchieve(e.id)) {
                    window.$game.saveManager.achieve(e.id);
                    let achi = new Achieve(e.src, e.title);
                    await achi.init();
                }
                break;
            case "over":
                window.$game.status = "end";
                await over();
                window.$game.saveManager.addFlag([ 'over' ]);
                window.$game.saveManager.save(true);
                window.location.href = "index.html";
                break;
            case "end":
                window.$game.status = "end";
                await end();
                window.location.href = "index.html";
                break;
            default: break;
        }

        player.blockMove = false;

        window.$game.saveManager.addFlag(e.flag);
        if (e.next && e.next.length > 0) {
            let next = e.next.shift();
            next.next = e.next;
            this.set(next);
        } else {
            this.event = null;
            this.progress = 'end';
        }
    }
}
