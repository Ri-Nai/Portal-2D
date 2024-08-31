class Auth {
    static isAuthenticated() {
        return localStorage.getItem('token') !== null;
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
