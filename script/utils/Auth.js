class Auth {
    static isAuthenticated() {
        return localStorage.getItem('token') !== null;
    }

    static toLogin() {
        window.location.href = './login.html';
    }

    static login() {
        localStorage.setItem('token', 'test');
    }
}
