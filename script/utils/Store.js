class Store {
    constructor() {
        const p = new URLSearchParams(window.location.search);
        p.forEach((v, k) => {
            localStorage.setItem(k, v);
        });

        if (window.location.search)
            window.location.search = "";
    }

    static get(key) {
        return localStorage.getItem(key);
    }

    static set(key, value) {
        localStorage.setItem(key, value);
    }

    static remove(key) {
        localStorage.removeItem(key);
    }

    export() {
        let data = new Map();
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            data.set(key, localStorage.getItem(key));
        }
        return data;
    }

    encode() {
        const param = new URLSearchParams(this.export());

        return param.toString();
    }
}
