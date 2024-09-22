class Auth {
    static getToken() {
        return localStorage.getItem('token');
    }

    static isAuthenticated() {
        return this.getToken() !== null;
    }

    static toLogin() {
        window.location.href = './pages/login/login.html';
    }

    static login() {
        localStorage.setItem('token', 'test');
    }

    static logout() {
        localStorage.removeItem('token');
        this.toLogin()
    }
}
