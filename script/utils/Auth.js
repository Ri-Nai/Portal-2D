class Auth {
    static getToken() {
        return Store.get('token');
    }

    static isAuthenticated() {
        return this.getToken() !== null;
    }

    static toLogin() {
        window.location.href = './pages/login/login.html';
    }

    static login() {
        Store.set('token', 'test');
    }

    static logout() {
        Store.remove('token');
        this.toLogin()
    }
}
