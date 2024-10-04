class DialogManager {
    constructor() {
        this.createDialog();
        this.buffer = []; // 文本缓冲区
        this.printing = false;
        this.audio = new Audio();
    }

    // 创建对话框的 DOM 元素
    createDialog() {
        let dialog = document.querySelector(".dialogue-container");
        let textContainer = document.querySelector(".dialogue-box");
        let name = document.createElement("div");
        let text = document.createElement("p");
        // 设置 ID 和样式
        dialog.id = "dialogue-container";
        dialog.style.display = "none";

        textContainer.id = "dialogue-box";
        textContainer.classList.add("dialogue-box");

        name.id = "character-name";
        name.classList.add("character-name");

        text.id = "text";
        text.classList.add("text");

        // 组装 DOM 元素
        dialog.appendChild(name);
        dialog.appendChild(textContainer);
        textContainer.appendChild(text);
        document.getElementById("game").appendChild(dialog);

        // 存储 DOM 元素的引用
        this.dialog = dialog;
        this.name = name;
        this.text = text;
    }
    load(data) {
        this.buffer = data.texts;
    }

    async loadFromURL(url) {
        try {
            const response = await window.$game.dataManager.loadJSON(url);
            this.load(response);
            console.log(this);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }
    async play_audio(src) {
        if (src == null) return;
        if (this.audio) this.audio.pause();
        this.audio = new Audio(src);
        this.audio.play();
    }

    // 打开对话框动画
    async open() {

        this.name.innerHTML = ""; // 清空名称和文本
        this.text.innerHTML = "";

        this.dialog.classList.remove('fadeOut');
        this.dialog.classList.add('fadeIn');
        this.dialog.style.display = "block";

        await wait(300);
        this.dialog.classList.remove('fadeIn');
    }

    // 关闭对话框动画
    async close() {
        this.dialog.classList.remove('fadeIn');
        this.dialog.classList.add('fadeOut');

        await wait(300);
        this.dialog.classList.remove('fadeOut');
        this.dialog.style.display = "none";

        this.name.innerHTML = ""; // 清空名称和文本
        this.text.innerHTML = "";
    }

    // 打印文本
    async prints(contents = []) {
        this.buffer.push(...contents);
        if (this.buffer.length == 0)
            return;
        await this.open(); // 打开对话框
        await this._prints(); // 打印文本
        await this.close(); // 关闭对话框
    }
    clear() {
        this.buffer = [];
        this.printing = false;
    }
    // 打印缓冲区中的文本
    async _prints() {
        this.printing = true;

        for (let content of this.buffer) {
            if (!this.printing) return;
            this.name.innerHTML = ""; // 清空名称和文本
            this.text.innerHTML = "";
            let text = content.text;
            if (text[ 0 ] === "【") {
                let end = text.indexOf("】");
                let name = text.slice(1, end);
                if (name == "要乐奈") name = "要<span>乐</span>奈"
                else if (name == "GLaDOS") name = "GL<span>a</span>DOS"
                else if (name == "长崎素世") name = "长崎<span>素</span>世"
                else name = name[0] + "<span>" + name[1] + "</span>" + name.slice(2);
                this.name.innerHTML = name; // 设置角色名称
                text = text.slice(end + 1); // 移除名称部分
            }
            let getEnd = () => {
                let res = false;
                window.$game.inputManager.firstDown("Enter", () => { res = true; });
                window.$game.inputManager.firstDown("Space", () => { res = true; });
                window.$game.inputManager.firstDown("ClickLeft", () => { res = true; });
                return res;
            };
            let toEnd = false;
            this.play_audio(content.url);
            for (let i of text.split("")) {
                if (!this.printing) return;

                let span = document.createElement("span");
                span.textContent = i;
                this.text.appendChild(span); // 逐字显示文本
                if (window.$game.inputManager.isKeysDown([ "LCtrl", "RCtrl" ])) {
                    await delay(10); // 控制打印速度
                    continue;
                }
                if (toEnd) continue;
                toEnd = getEnd();
                await delay(50); // 控制打印速度
            }

            // 等待用户输入
            if (!window.$game.inputManager.isKeysDown([ "LCtrl", "RCtrl" ]))
                while (
                    await (async () => {
                        await delay(100);
                        return !getEnd() && !window.$game.inputManager.isKeysDown([ "LCtrl", "RCtrl" ]);
                    })()
                );
            else await delay(100);
        }
        this.buffer = [];
        this.printing = false;
    }

    async clear() {
        this.buffer = [];
        this.name.innerHTML = "";
        this.text.innerHTML = "";
        this.printing = false;
        await this.close();
    }
}

// 辅助延迟函数
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
