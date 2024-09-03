class AchievementDisp {
    /**
     *
     * @param {HTMLElement} ele
     */
    constructor(ele) {
        this.container = ele
    }

    getAll() {
        return JSON.parse(localStorage.getItem("achievements")) || [];
    }

    disp() {
        const achievements = this.getAll();
        const container = this.container;

        achievements.forEach((achievement) => {
            const btn = this.generate(achievement);
            container.appendChild(btn);
        });

        if (achievements.length === 0) {
            const empty = document.createElement("div");
            empty.classList.add("empty");
            empty.innerText = "没有可用的成就";
            container.appendChild(empty);
        }
    }

    generate(achievement) {
        const ele = document.createElement("div");
        ele.classList.add("list-item");

        const title = document.createElement("div");
        title.classList.add("title");
        title.innerText = achievement.title;
        ele.appendChild(title);

        const desc = document.createElement("div");
        desc.classList.add("desc");
        desc.innerText = achievement.desc;
        ele.appendChild(desc);

        return ele;
    }
}
