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

        title.innerText = "Save"

        container.appendChild(title)

        this.getAll().forEach((save) => {
            const btn = document.createElement("div");
            btn.classList.add("list-item");
            btn.innerHTML = save;

            container.appendChild(btn)
        })

        if (this.getAll().length === 0) {
            const empty = document.createElement("div")
            empty.classList.add("empty")

            empty.innerText = "No save available. "

            container.appendChild(empty)
        }

        const newBtn = document.createElement("div")
        newBtn.classList.add("list-item");
        newBtn.innerHTML = "New"

        newBtn.addEventListener("click", () => {
            this.set(window.$game.chapterNow, `${window.$game.chapterNow}.json`)
            this.hide()
        })

        container.appendChild(newBtn)

        const backBtn = document.createElement("div");
        backBtn.classList.add("button");
        backBtn.innerHTML = "Back";

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
    constructor() {
        super();
    }

    build() {
        const container = document.querySelector(".save-container")

        const title = document.createElement("div");
        title.classList.add("title");

        title.innerText = "Load";

        container.appendChild(title)

        this.getAll().forEach((url, save) => {
            const btn = document.createElement("div")
            btn.classList.add("list-item")
            btn.innerHTML = save

            btn.addEventListener("click", () => {
                window.$game.switchView(url)
                this.hide()
            })

            container.appendChild(btn)
        })

        if (this.getAll().size === 0) {
            const empty = document.createElement("div");
            empty.classList.add("empty");

            empty.innerText = "No save available. ";

            container.appendChild(empty)
        }

        const backBtn = document.createElement("div");
        backBtn.classList.add("button");
        backBtn.innerHTML = "Back";

        backBtn.addEventListener("click", () => this.hide())

        container.appendChild(backBtn)

        this.ctx.appendChild(container)
    }
}
