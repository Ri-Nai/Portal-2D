class AchievementManager {
    static getAll() {
        return JSON.parse(Store.get("achievements"))?.[ Auth.getToken() ] || [];
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

    async load() {
        const achievements = await window.$game.dataManager.loadJSON("./assets/stages/achievements.json");
        const Achievements = [
            RoomArrivalAchievement,
            GelledEdgeAchievement,
            PlayerFallingSpeedAchievement,
            CubeUntouchedAchievement,
            UngelledAchievement,
            PlayerFlyingAchievement,
            HaruhikageAchievement,
            EndingAchievement,
            ParfaitAchievement,
            CameraAchievement
        ];
        achievements.forEach((a) => {
            this.add(new Achievements[ a.type ](a));
        });
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
        console.log(achievement);
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
        const all = JSON.parse(Store.get("achievements")) ?? {};
        all[ this.user ] = this.achievements.map((achievement) => {
            return {
                title: achievement.title,
                desc: achievement.desc,
                _condition: achievement._condition,
                _completed: this.status.get(achievement.title) || false
            };
        });
        Store.set("achievements", JSON.stringify(all));
    }
}

/**
 * @abstract
 */
class Achievement {
    constructor(a) {
        this.title = a.title;
        this.desc = a.desc;
        this._condition = a.condition;
        console.log(a);
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
    constructor(a) {
        super(a);
        this.room = a.room;
    }

    condition(t, that) {
        return that.game.chapterNow === this.room;
    }
}

class GelledEdgeAchievement extends Achievement {
    constructor(a) {
        super(a);
    }
    condition(t, that) {
        // return that.player.gelled;
        let length = that.game.view.gelledEdgeList.length;
        return length >= 1000;
    }
}

class PlayerFallingSpeedAchievement extends Achievement {
    constructor(a) {
        super(a);
    }
    condition(t, that) {
        if (!that.player.velocity)
            return false;
        return that.player.velocity.x > that.player.jumping.baseJump * 5.98;
    }
}
class CubeUntouchedAchievement extends Achievement {
    constructor(a) {
        super(a);
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
    constructor(a) {
        super(a);
        this.room = a.room;
        this.hitbox = new Hitbox(
            copyVector(a.hitbox.position),
            copyVector(a.hitbox.size)
        );
    }
    condition(t, that) {
        // return that.player.velocity.x > that.player.jumping.baseJump * 5.98;
        if (that.game.chapterNow != this.room)
            return false;
        let length = that.game.view.gelledEdgeList.length;
        let player = that.game.view.player;
        if (length > 100)
            return false;
        return this.hitbox.hit(player.hitbox);
    }
}
class PlayerFlyingAchievement extends Achievement {
    constructor(a) {
        super(a);
        this.flyingTime = 0;
    }
    condition(t, that) {
        let player = that.game.view.player;
        if (player.isOnGround())
            this.flyingTime = 0;
        else this.flyingTime += t.interval;
        return this.flyingTime > 15000;
    }
}
class HaruhikageAchievement extends Achievement {
    constructor(a) {
        super(a);
    }
    condition(t, that) {
        if (that.game.chapterNow != "Haruhikage")
            return false;
        const event = that.view.events.getEvent("event-area-24-12");
        if (event.activated && that.game.chapterNow === "Haruhikage") {
            Store.set("haruhikage", true);
            return true;
        }
    }
}
class EndingAchievement extends Achievement {
    constructor(a) {
        super(a);
        this.ending = a.ending;
    }
    condition(t, that) {
        return that.game.chapterNow === "Outro" && that.game.ending == this.ending;
    }
}
class ParfaitAchievement extends Achievement {
    constructor(a) {
        super(a);
    }
    condition(t, that) {
        let parfait = JSON.parse(Store.get("parfait"))?.length ?? 0;
        return that.game.chapterNow === "Outro" && that.game.ending == 2 && parfait == 8;
    }
}
class CameraAchievement extends Achievement {
    constructor(a) {
        super(a);
    }
    condition(t, that) {
        let camera = JSON.parse(Store.get("camera"))?.length ?? 0;
        return that.game.chapterNow === "Outro" && that.game.ending == 2 && camera == 7;
    }
}
