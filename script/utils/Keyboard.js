class KeyboardManager {
    /**
     * @type {Map<string, boolean>}
     */
    status;

    KEYMAP = new Map([
        // Modifier Keys
        [ 'ShiftLeft', 'LShift' ],
        [ 'ShiftRight', 'RShift' ],
        [ 'ControlLeft', 'LCtrl' ],
        [ 'ControlRight', 'RCtrl' ],
        [ 'AltLeft', 'LAlt' ],
        [ 'AltRight', 'RAlt' ],
        [ 'MetaLeft', 'LWin' ],
        [ 'MetaRight', 'RWin' ],

        // Function Keys
        [ 'Escape', 'Esc' ],
        [ 'F1', 'F1' ],
        [ 'F2', 'F2' ],
        [ 'F3', 'F3' ],
        [ 'F4', 'F4' ],
        [ 'F5', 'F5' ],
        [ 'F6', 'F6' ],
        [ 'F7', 'F7' ],
        [ 'F8', 'F8' ],
        [ 'F9', 'F9' ],
        [ 'F10', 'F10' ],
        [ 'F11', 'F11' ],
        [ 'F12', 'F12' ],

        // Alphanumeric Keys
        [ 'Digit0', '0' ],
        [ 'Digit1', '1' ],
        [ 'Digit2', '2' ],
        [ 'Digit3', '3' ],
        [ 'Digit4', '4' ],
        [ 'Digit5', '5' ],
        [ 'Digit6', '6' ],
        [ 'Digit7', '7' ],
        [ 'Digit8', '8' ],
        [ 'Digit9', '9' ],

        [ 'KeyA', 'A' ],
        [ 'KeyB', 'B' ],
        [ 'KeyC', 'C' ],
        [ 'KeyD', 'D' ],
        [ 'KeyE', 'E' ],
        [ 'KeyF', 'F' ],
        [ 'KeyG', 'G' ],
        [ 'KeyH', 'H' ],
        [ 'KeyI', 'I' ],
        [ 'KeyJ', 'J' ],
        [ 'KeyK', 'K' ],
        [ 'KeyL', 'L' ],
        [ 'KeyM', 'M' ],
        [ 'KeyN', 'N' ],
        [ 'KeyO', 'O' ],
        [ 'KeyP', 'P' ],
        [ 'KeyQ', 'Q' ],
        [ 'KeyR', 'R' ],
        [ 'KeyS', 'S' ],
        [ 'KeyT', 'T' ],
        [ 'KeyU', 'U' ],
        [ 'KeyV', 'V' ],
        [ 'KeyW', 'W' ],
        [ 'KeyX', 'X' ],
        [ 'KeyY', 'Y' ],
        [ 'KeyZ', 'Z' ],

        // Navigation Keys
        [ 'ArrowUp', 'Up' ],
        [ 'ArrowDown', 'Down' ],
        [ 'ArrowLeft', 'Left' ],
        [ 'ArrowRight', 'Right' ],
        [ 'Home', 'Home' ],
        [ 'End', 'End' ],
        [ 'PageUp', 'Page Up' ],
        [ 'PageDown', 'Page Down' ],

        // Control Keys
        [ 'Enter', 'Enter' ],
        [ 'Space', 'Space' ],
        [ 'Backspace', 'Backspace' ],
        [ 'Tab', 'Tab' ],
        [ 'Delete', 'Delete' ],
        [ 'Insert', 'Insert' ],
        [ 'CapsLock', 'Caps Lock' ],
        [ 'NumLock', 'Num Lock' ],
        [ 'ScrollLock', 'Scroll Lock' ],
        [ 'Pause', 'Pause' ],
        [ 'PrintScreen', 'Print Screen' ],

        // Numpad Keys
        [ 'Numpad0', 'NUMPAD0' ],
        [ 'Numpad1', 'NUMPAD1' ],
        [ 'Numpad2', 'NUMPAD2' ],
        [ 'Numpad3', 'NUMPAD3' ],
        [ 'Numpad4', 'NUMPAD4' ],
        [ 'Numpad5', 'NUMPAD5' ],
        [ 'Numpad6', 'NUMPAD6' ],
        [ 'Numpad7', 'NUMPAD7' ],
        [ 'Numpad8', 'NUMPAD8' ],
        [ 'Numpad9', 'NUMPAD9' ],
        [ 'NumpadMultiply', 'Mul' ],
        [ 'NumpadAdd', 'Add' ],
        [ 'NumpadSubtract', 'Sub' ],
        [ 'NumpadDecimal', 'Dec' ],
        [ 'NumpadDivide', 'Div' ],

        // Miscellaneous
        [ 'ContextMenu', 'Apps' ],
        [ 'Help', 'Help' ]
    ]);
    constructor() {
        this.status = new Map();

        this.KEYMAP.forEach((value, key) => {
            this.status.set(value, false);
        });

        document.addEventListener("keydown", (event) => {
            const key = this.KEYMAP.get(event.code);
            if (this.status.has(key)) {
                this.status.set(key, true);
            }
        });

        document.addEventListener("keyup", (event) => {
            const key = this.KEYMAP.get(event.code);
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
