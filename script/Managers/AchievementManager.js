class AchievementManager {
    static getAll() {
        return JSON.parse(localStorage.getItem("achievements"))?.[ Auth.getToken() ] || [];
    }

    /**
     * @returns {Map<string, boolean>}
     */
    getAllStatus() {
        const all = AchievementManager.getAll();

        const status = new Map();
        all.forEach((achievement) => {
            status.set(achievement.title, achievement._completed);
        });

        return status;
    }

    constructor() {
        /**
         * @type {Achievement[]}
         */
        this.achievements = [];

        /**
         * @type {Map<string, boolean>}
         */
        this.status = this.getAllStatus();
        this.popup = document.querySelector(".achievement");
        this.user = Auth.getToken();

        this.load();
    }

    async load() {
        const achievements = await window.$game.dataManager.loadJSON("./assets/stages/achievements.json")
        achievements.forEach((a) => {
            if (a.type == 0) {
                this.add(new RoomArrivalAchievement(a.title, a.desc, a.room));
            }
            if (a.type == 1) {
                this.add(new GelledEdgeAchievement(a.title, a.desc));
            }
            if (a.type == 2) {
                this.add(new PlayerFallingSpeedAchievement(a.title, a.desc));
            }
            if (a.type == 3) {
                this.add(new CubeUntouchedAchievement(a.title, a.desc));
            }
            if (a.type == 4) {
                this.add(new UngelledAchievement(a.title, a.desc));
            }
        })
    }

    get game() {
        return window.$game;
    }

    get view() {
        return this.game.view;
    }

    get player() {
        return this.view.player;
    }

    getStatus(title) {
        return this.getAllStatus().get(title) || false;
    }

    update(t) {
        this.achievements.forEach((achievement) => {
            if (achievement.completed) return;
            achievement.check(t, this);
        });
    }

    add(achievement) {
        if (!this.getAllStatus().has(achievement.title)) {
            this.status.set(achievement.title, false);
        }
        const status = this.getStatus(achievement.title);
        achievement.completed = status;
        this.achievements.push(achievement);

        console.debug(this.achievements, this.status);
    }

    onCompleted(achievement) {
        this.achievements.forEach((a) => {
            if (a.title === achievement.title) {
                a.completed = true;
                this.status.set(a.title, true);
            }
        });
        this.refresh();

        this.popup.querySelector(".title").innerText = achievement.title;
        this.popup.querySelector(".desc").innerText = achievement.desc;
        this.popup.classList.remove("hidden");
        setTimeout(() => {
            this.popup.classList.add("hide");
            setTimeout(() => {
                this.popup.classList.add("hidden");
                this.popup.classList.remove("hide");
            }, 1000);
        }, 5000);
    }

    refresh() {
        const all = JSON.parse(localStorage.getItem("achievements")) ?? {};
        all[ this.user ] = this.achievements.map((achievement) => {
            return {
                title: achievement.title,
                desc: achievement.desc,
                _completed: this.status.get(achievement.title) || false
            };
        });
        localStorage.setItem("achievements", JSON.stringify(all));
    }
}

/**
 * @abstract
 */
class Achievement {
    constructor(title, desc) {
        this.title = title;
        this.desc = desc;
        this._completed = false;
    }

    get completed() {
        return this._completed;
    }

    set completed(value) {
        this._completed = value;
    }

    check(t, that) {
        if (this.completed) return;
        if (this.condition(t, that)) {
            this.completed = true;
            that.onCompleted(this);
        }
    }

    condition(t, that) {
        return false;
    }
}

class RoomArrivalAchievement extends Achievement {
    constructor(title, desc, room) {
        super(title, desc);
        this.room = room;
    }

    condition(t, that) {
        return that.game.chapterNow === this.room;
    }
}

class GelledEdgeAchievement extends Achievement {
    constructor(title, desc) {
        super(title, desc);
    }
    condition(t, that) {
        // return that.player.gelled;
        let length = that.game.view.gelledEdgeList.length;
        return length >= 1000;
    }
}

class PlayerFallingSpeedAchievement extends Achievement {
    constructor(title, desc) {
        super(title, desc);
    }
    condition(t, that) {
        return that.player.velocity.x > that.player.jumping.baseJump * 5.98;
    }
}
class CubeUntouchedAchievement extends Achievement {
    constructor(title, desc) {
        super(title, desc);
    }
    condition(t, that) {
        // return that.player.velocity.x > that.player.jumping.baseJump * 5.98;
        if (that.game.chapterNow != "Room11")
            return false;
        const event = that.view.events.getEvent("event-area-02-14");
        const cube = that.view.cubes[ 0 ];
        return event.activated && cube.hasPicked == 0;
    }
}
class UngelledAchievement extends Achievement {
    constructor(title, desc) {
        super(title, desc);
    }
    condition(t, that) {
        // return that.player.velocity.x > that.player.jumping.baseJump * 5.98;
        if (that.game.chapterNow != "Room18")
            return false;
        let length = that.game.view.gelledEdgeList.length;
        let player = that.game.view.player;
        return player.hitbox.position.x > 1180 && player.hitbox.position.y < 480 && length < 100;
    }
}
