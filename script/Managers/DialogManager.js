class DialogManager {
    constructor() {
        this.createDialog();
        this.buffer = []; // 文本缓冲区
        this.printing = false;
    }

    // 创建对话框的 DOM 元素
    createDialog() {
        let dialog = document.createElement("div");
        let textContainer = document.createElement("div");
        let name = document.createElement("div");
        let text = document.createElement("p");

        // 设置 ID 和样式
        dialog.id = "dialogue-container";
        dialog.classList.add("dialogue-container"); // 使用 CSS 类来应用样式
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
    // 打开对话框动画
    async open() {
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
    }

    // 打印文本
    async prints(texts = []) {
        this.buffer.push(...texts);
        if (this.buffer.length == 0)
            return;
        await this.open(); // 打开对话框
        await this._prints(); // 打印文本
        await this.close(); // 关闭对话框
    }
    // 打印缓冲区中的文本
    async _prints() {
        this.printing = true;
        for (let text of this.buffer) {
            if (text[0] === "【") {
                let end = text.indexOf("】");
                this.name.textContent = text.slice(0, end + 1); // 设置角色名称
                text = text.slice(end + 1); // 移除名称部分
            }
            let getEnd = () => {
                let res = false;
                window.$game.inputManager.firstDown("Enter", () => {res = true;});
                window.$game.inputManager.firstDown("Space", () => {res = true;});
                window.$game.inputManager.firstDown("ClickLeft", () => {res = true;});
                return res;
            };
            let toEnd = false;
            for (let i of text.split("")) {
                let span = document.createElement("span");
                span.textContent = i;
                this.text.appendChild(span); // 逐字显示文本
                if (window.$game.inputManager.isKeyDown("Ctrl"))
                {
                    await delay(10); // 控制打印速度
                    continue;
                }
                if (toEnd) continue;
                toEnd = getEnd();
                await delay(50); // 控制打印速度
            }

            // 等待用户输入
            if (!window.$game.inputManager.isKeyDown("Ctrl"))
                while (
                    await (async () => {
                        await delay(100);
                        return !getEnd() && !window.$game.inputManager.isKeyDown("Ctrl");
                    })()
                );
            else await delay(100);
            this.name.innerHTML = ""; // 清空名称和文本
            this.text.innerHTML = "";
        }
        this.buffer = [];
        this.printing = false;
    }
}

// 辅助延迟函数
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
