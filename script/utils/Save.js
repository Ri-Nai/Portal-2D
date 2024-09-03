class Save {
    constructor() {
        this.ctx = document.querySelector("#save-load");
    }

    show() {
        this.build();
        this.ctx.classList.remove("hidden");
    }

    hide() {
        this.ctx.classList.add("hidden");
        this.ctx.innerHTML = "";
        const container = document.createElement("div")
        container.classList.add("save-container")
        this.ctx.appendChild(container)
    }

    build() {
        const container = document.querySelector(".save-container")

        const title = document.createElement("div")
        title.classList.add("title")

        title.innerText = "保存"

        container.appendChild(title)

        this.getAll().forEach((url, save) => {
            const btn = document.createElement("div");
            btn.classList.add("list-item");
            btn.innerHTML = save;

            container.appendChild(btn)
        })

        if (this.getAll().length === 0) {
            const empty = document.createElement("div")
            empty.classList.add("empty")

            empty.innerText = "没有可用的存档"

            container.appendChild(empty)
        }

        const newBtn = document.createElement("div")
        newBtn.classList.add("list-item");
        newBtn.innerHTML = "新建存档";
        newBtn.style["fontWeight"] = 800;

        newBtn.addEventListener("click", () => {
            const parfait = JSON.parse(Store.get("parfait") ?? "[]");
            let title = window.$game.chapterNow;

            this.set(`${title}-${(new Date()).toISOString()}`, {
                url: `${window.$game.chapterNow}.json`,
                parfait
            })
            this.hide()
        })

        container.appendChild(newBtn)

        const backBtn = document.createElement("div");
        backBtn.classList.add("button");
        backBtn.innerHTML = "返回";

        backBtn.addEventListener("click", () => this.hide())

        container.appendChild(backBtn)

        this.ctx.appendChild(container)
    }

    get(key) {
        return JSON.parse(localStorage.getItem("saves"))[key];
    }
    set(key, value) {
        const saves = JSON.parse(localStorage.getItem("saves")) || {};
        saves[key] = value;
        localStorage.setItem("saves", JSON.stringify(saves));
    }
    /**
     * @typedef SaveData
     * @type {{
     *      url: string,
     *      parfait: string[]
     * }}
     */

    /**
     * @returns {Map<string, SaveData>}
     */
    getAll() {
        const data = JSON.parse(localStorage.getItem("saves")) ?? {};

        const result = new Map()
        Object.keys(data).forEach((v, k) => {
            result.set(v, data[v])
        })

        return result;
    }
}

class Load extends Save {
    constructor(callback) {
        super();
        this.switchCallback = callback;
    }

    build() {
        const container = document.querySelector(".save-container")

        const title = document.createElement("div");
        title.classList.add("title");

        title.innerText = "加载";

        container.appendChild(title)

        const scroll = document.createElement("div");
        scroll.classList.add("list");

        this.getAll().forEach((data, save) => {
            const btn = document.createElement("div")
            btn.classList.add("list-item")
            btn.innerHTML = save

            btn.addEventListener("click", this.switchCallback.bind(this, data))

            scroll.appendChild(btn)
        })

        container.appendChild(scroll)

        if (this.getAll().size === 0) {
            const empty = document.createElement("div");
            empty.classList.add("empty");

            empty.innerText = "没有可用的存档";

            container.appendChild(empty)
        }

        const backBtn = document.createElement("div");
        backBtn.classList.add("button");
        backBtn.innerHTML = "返回";

        backBtn.addEventListener("click", () => this.hide())

        container.appendChild(backBtn)

        this.ctx.appendChild(container)
    }
}
