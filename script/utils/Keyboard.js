class KeyboardMananger {
    /**
     * @type {Map<string, boolean>}
     */
    status

    KEYMAP = [
        'LB',
        'RB',
        'Ctrl-Break',
        'MB',
        'Backspace',
        'Tab',
        'Clear',
        'Enter',
        'Shift',
        'Ctrl',
        'Alt',
        'Pause',
        'Caps Lock',
        'Esc',
        'Space',
        'Page Up',
        'Page Down',
        'End',
        'Home',
        'Left',
        'Up',
        'Right',
        'Down',
        'Select',
        'Print',
        'Execute',
        'Print Screen',
        'Insert',
        'Delete',
        'Help',
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
        'LWin',
        'RWin',
        'Apps',
        'Sleep',
        'NUMPAD0',
        'NUMPAD1',
        'NUMPAD2',
        'NUMPAD3',
        'NUMPAD4',
        'NUMPAD5',
        'NUMPAD6',
        'NUMPAD7',
        'NUMPAD8',
        'NUMPAD9',
        'Mul',
        'Add',
        'Sep',
        'Sub',
        'Dec',
        'Div',
        'F1',
        'F2',
        'F3',
        'F4',
        'F5',
        'F6',
        'F7',
        'F8',
        'F9',
        'F10',
        'F11',
        'F12',
        'F13',
        'F14',
        'F15',
        'F16',
        'F17',
        'F18',
        'F19',
        'F20',
        'F21',
        'F22',
        'F23',
        'F24',
        'Num Lock',
        'Scroll Lock',
        'LShift',
        'RShift',
        'LCtrl',
        'RCtrl',
        'LAlt',
        'RAlt',
    ]

    constructor() {
        this.status = new Map()

        this.KEYMAP.forEach((key) => {
            this.status.set(key, false)
        })

        document.addEventListener("keydown", (event) => {
            if (this.status.has(event.key)) {
                this.status.set(event.key, true)
            }
        })

        document.addEventListener("keyup", (event) => {
            if (this.status.has(event.key)) {
                this.status.set(event.key, false);
            }
        })
    }

    isKeyDown(key) {
        return this.status.get(key) || false
    }
}
