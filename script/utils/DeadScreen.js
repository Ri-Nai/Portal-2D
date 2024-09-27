class DeadScreen {
    constructor() {
        this.ele = document.querySelector(".dead-screen");
        this.isShow = false;

        this.retryBtn = this.ele.querySelector(".dead-screen #retry");
        this.cancelBtn = this.ele.querySelector(".dead-screen #cancel");
    }

    show() {
        this.isShow = true;
        this.ele.classList.remove("hidden");
        console.debug(document.pointerLockElement);
        if (document.pointerLockElement)
            document.exitPointerLock();
        return new Promise((resolve, reject) => {
            this.retryBtn.onclick = () => {
                this.hide();
                resolve();
            }
            this.cancelBtn.onclick = () => {
                this.hide();
                reject();
            }
        })
    }

    hide() {
        this.isShow = false;
        this.ele.classList.add("hidden");
        window.$game.resume();
    }
}
