class AchievementManager {
    constructor() {
        /**
         * @type {Achievement[]}
         */
        this.achievements = [];
        this.popup = document.querySelector(".achievement");
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

    static getAll() {
        return JSON.parse(localStorage.getItem("achievements")) || [];
    }

    static getStatus(title) {
        const achievements = AchievementManager.getAll() ?? this.achievements;
        achievements.forEach((achievement) => {
            if (achievement.title === title) {
                return achievement.completed;
            }
        });
        return false;
    }

    update(t) {
        this.achievements.forEach((achievement) => {
            if (achievement.completed) return ;
            achievement.check(t, this);
        });
    }

    add(achievement) {
        const status = AchievementManager.getStatus(achievement.title);
        achievement.completed = status;
        this.achievements.push(achievement);
    }

    onCompleted(achievement) {
        this.achievements.forEach((a) => {
            if (a.title === achievement.title) {
                a.completed = true;
            }
        })
        localStorage.setItem("achievements", JSON.stringify(this.achievements));

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
}

/**
 * @abstract
 */
class Achievement {
    constructor(title, desc) {
        this.title = title;
        this.desc = desc;
        this.completed = false;
    }

    check(t, that) {
        if (this.completed) return ;
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
        return that.game.chapterNow === this.room
    }
}
