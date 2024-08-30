class KeyboardMananger {
    /**
     * @type {Map<string, boolean>}
     */
    status;

    KEYMAP = new Map([
        [ 1, 'LB' ],
        [ 2, 'RB' ],
        [ 3, 'Ctrl-Break' ],
        [ 4, 'MB' ],
        [ 8, 'Backspace' ],
        [ 9, 'Tab' ],
        [ 12, 'Clear' ],
        [ 13, 'Enter' ],
        [ 16, 'Shift' ],
        [ 17, 'Ctrl' ],
        [ 18, 'Alt' ],
        [ 19, 'Pause' ],
        [ 20, 'Caps Lock' ],
        [ 27, 'Esc' ],
        [ 32, 'Space' ],
        [ 33, 'Page Up' ],
        [ 34, 'Page Down' ],
        [ 35, 'End' ],
        [ 36, 'Home' ],
        [ 37, 'Left' ],
        [ 38, 'Up' ],
        [ 39, 'Right' ],
        [ 40, 'Down' ],
        [ 41, 'Select' ],
        [ 42, 'Print' ],
        [ 43, 'Execute' ],
        [ 44, 'Print Screen' ],
        [ 45, 'Insert' ],
        [ 46, 'Delete' ],
        [ 47, 'Help' ],
        [ 48, '0' ],
        [ 49, '1' ],
        [ 50, '2' ],
        [ 51, '3' ],
        [ 52, '4' ],
        [ 53, '5' ],
        [ 54, '6' ],
        [ 55, '7' ],
        [ 56, '8' ],
        [ 57, '9' ],
        [ 65, 'A' ],
        [ 66, 'B' ],
        [ 67, 'C' ],
        [ 68, 'D' ],
        [ 69, 'E' ],
        [ 70, 'F' ],
        [ 71, 'G' ],
        [ 72, 'H' ],
        [ 73, 'I' ],
        [ 74, 'J' ],
        [ 75, 'K' ],
        [ 76, 'L' ],
        [ 77, 'M' ],
        [ 78, 'N' ],
        [ 79, 'O' ],
        [ 80, 'P' ],
        [ 81, 'Q' ],
        [ 82, 'R' ],
        [ 83, 'S' ],
        [ 84, 'T' ],
        [ 85, 'U' ],
        [ 86, 'V' ],
        [ 87, 'W' ],
        [ 88, 'X' ],
        [ 89, 'Y' ],
        [ 90, 'Z' ],
        [ 91, 'LWin' ],
        [ 92, 'RWin' ],
        [ 93, 'Apps' ],
        [ 95, 'Sleep' ],
        [ 96, 'NUMPAD0' ],
        [ 97, 'NUMPAD1' ],
        [ 98, 'NUMPAD2' ],
        [ 99, 'NUMPAD3' ],
        [ 100, 'NUMPAD4' ],
        [ 101, 'NUMPAD5' ],
        [ 102, 'NUMPAD6' ],
        [ 103, 'NUMPAD7' ],
        [ 104, 'NUMPAD8' ],
        [ 105, 'NUMPAD9' ],
        [ 106, 'Mul' ],
        [ 107, 'Add' ],
        [ 108, 'Sep' ],
        [ 109, 'Sub' ],
        [ 110, 'Dec' ],
        [ 111, 'Div' ],
        [ 112, 'F1' ],
        [ 113, 'F2' ],
        [ 114, 'F3' ],
        [ 115, 'F4' ],
        [ 116, 'F5' ],
        [ 117, 'F6' ],
        [ 118, 'F7' ],
        [ 119, 'F8' ],
        [ 120, 'F9' ],
        [ 121, 'F10' ],
        [ 122, 'F11' ],
        [ 123, 'F12' ],
        [ 124, 'F13' ],
        [ 125, 'F14' ],
        [ 126, 'F15' ],
        [ 127, 'F16' ],
        [ 128, 'F17' ],
        [ 129, 'F18' ],
        [ 130, 'F19' ],
        [ 131, 'F20' ],
        [ 132, 'F21' ],
        [ 133, 'F22' ],
        [ 134, 'F23' ],
        [ 135, 'F24' ],
        [ 144, 'Num Lock' ],
        [ 145, 'Scroll Lock' ],
        [ 160, 'LShift' ],
        [ 161, 'RShift' ],
        [ 162, 'LCtrl' ],
        [ 163, 'RCtrl' ],
        [ 164, 'LAlt' ],
        [ 165, 'RAlt' ],
    ]);

    constructor() {
        this.status = new Map();

        this.KEYMAP.forEach((value, key) => {
            this.status.set(value, false);
        });

        document.addEventListener("keydown", (event) => {
            const key = this.KEYMAP.get(event.keyCode);
            if (this.status.has(key)) {
                this.status.set(key, true);
            }
        });

        document.addEventListener("keyup", (event) => {
            const key = this.KEYMAP.get(event.keyCode);
            if (this.status.has(key)) {
                this.status.set(key, false);
            }
        });
        addEventListener("keydown", (e) => { e.preventDefault(); });
    }

    isKeyDown(key) {
        return this.status.get(key) || false;
    }

    /**
     *
     * @param {string[]} keys
     * @returns
     */
    isKeysDown(keys) {
        let ans = false;
        keys.forEach((key) => {
            ans = ans || this.isKeyDown(key);
        });
        return ans;
    }
}
