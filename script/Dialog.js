class Dialog {
    constructor() {
        this.createDialog();
        this.buffer = []; // 文本缓冲区
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

    // 打开对话框动画
    async open() {
        this.dialog.style.display = "block";
        this.dialog.style.opacity = 0;
        for (let i = 0; i <= 10; i++) {
            this.dialog.style.opacity = i / 10;
            await delay(20);
        }
    }

    // 关闭对话框动画
    async close() {
        for (let i = 10; i >= 0; i--) {
            this.dialog.style.opacity = i / 10;
            await delay(20);
        }
        this.dialog.style.display = "none";
    }

    // 打印文本
    async prints(texts) {
        this.buffer.push(...texts); // 添加文本到缓冲区
        await this.open(); // 打开对话框
        await this._prints(); // 打印文本
        await this.close(); // 关闭对话框
    }

    getSkip() {}
    // 打印缓冲区中的文本
    async _prints() {
        let isEntered = false;
        let isSpaced = false;
        let isClicked = false;
        while (true) {
            if (this.buffer.length === 0) return; // 缓冲区为空时返回

            let text = this.buffer.shift(); // 获取缓冲区的第一条文本
            if (text[0] === "【") {
                let end = text.indexOf("】");
                this.name.textContent = text.slice(0, end + 1); // 设置角色名称
                text = text.slice(end + 1); // 移除名称部分
            }
            let getEnd = () => {
                let res = false;
                if (window.$game.keyboard.isKeyDown("Enter")) {
                    if (!isEntered) (isEntered = true), (res = true);
                } else isEntered = false;
                if (window.$game.keyboard.isKeyDown("Space")) {
                    if (!isSpaced) (isSpaced = true), (res = true);
                } else isSpaced = false;
                if (window.$game.mouse.left) {
                    if (!isClicked) (isClicked = true), (res = true);
                } else isClicked = false;
                return res;
            };
            let toEnd = false;
            for (let i of text.split("")) {
                let span = document.createElement("span");
                span.textContent = i;
                this.text.appendChild(span); // 逐字显示文本
                if (toEnd) continue;
                toEnd = getEnd();
                await delay(50); // 控制打印速度
                if (this.canceled) return; // 如果被取消，退出
            }

            // 等待用户输入

            while (
                await (async () => {
                    await delay(50);
                    return !getEnd();
                })()
            );
            this.name.innerHTML = ""; // 清空名称和文本
            this.text.innerHTML = "";
        }
    }
}

// 辅助延迟函数
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
