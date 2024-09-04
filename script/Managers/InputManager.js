class InputManager {

    /**
     *
     * @param {KeyboardManager} keyboard
     * @param {MouseManager} mouse
     */
    constructor(keyboard, mouse) {
        this.keyboard = keyboard;
        this.mouse = mouse;
        this.isHeld = {
            "E" : false,
            "Space" : false,
            "Enter" : false,
            "ClickLeft" : false,
            "ClickRight" : false,
        }
    }
    isKeyDown(key) {
        if (key == "ClickLeft")
            return this.mouse.left;
        if (key == "ClickRight")
            return this.mouse.right;
        return this.keyboard.isKeyDown(key);
    }
    isKeysDown(keys) {
        let ans = false
        keys.forEach((key) => {
            ans = ans || this.isKeyDown(key)
        })
        return ans
    }
    firstDown(key, operate) {
        if (this.isKeyDown(key)) {
            if (!this.isHeld[key]) {
                this.isHeld[key] = true;
                operate();
            }
        }
        else this.isHeld[key] = false;
        return this.isHeld[key];
    }
}
