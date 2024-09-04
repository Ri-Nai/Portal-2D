class AchievementManager {
    static getAll() {
        return JSON.parse(localStorage.getItem("achievements"))?.[Auth.getToken()] || [];
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
        debugger;
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
        })
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
        all[this.user] = all[this.user].map((achievement) => {
            return {
                ...achievement,
                _completed: this.status.get(achievement.title) || false
            }
        })
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
        let gelledEdgeList = that.game.view.gelledEdgeList;
        let gelledEdges = gelledEdgeList.gelledEdges;
        let length = 0;
        for (let edges of gelledEdges) {
            for (let edge of edges) {
                // if (edge.gelled) return true;
                if (edge.facing & 1)
                    length += edge.hitbox.size.y;
                else
                    length += edge.hitbox.size.x;
            }
        }
        return length >= 100;
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
