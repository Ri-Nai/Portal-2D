// 检查密码强度
function checkPasswordStrength(password) {
    // 密码长度至少为6
    if (password.length == 0) {
        document.getElementById('strength').textContent = "";
        barDisplay("");
        return;
    }
    if (password.length < 6) {
        document.getElementById('strength').textContent = "无效";
        barDisplay("无效");
        return;
    }

    // 检查是否包含数字和字母
    const hasDigit = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);

    if (!hasDigit || !hasLetter) {
        document.getElementById("strength").textContent = "无效";
        ("无效");
    }

    // 密码至少为弱强度
    let strength = "弱";

    // 检查长度是否大于10
    if (password.length > 10) {
        strength = "中"; // 至少为中等
    }

    // 检查是否有大写和小写字母
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasBothCase = hasLower && hasUpper;

    // 检查是否包含特殊字符
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);

    // 如果同时满足三个条件，则密码强度为强
    if (password.length > 10 && hasBothCase && hasSpecialChar) {
        strength = "强";
    }
    // 如果满足其中一个或两个条件，则密码强度为中
    else if (password.length > 10 || hasBothCase || hasSpecialChar) {
        strength = "中";
    }

    document.getElementById("strength").textContent = strength;
    barDisplay(strength);
}


function barDisplay(strength) {
    let KeyMap = {
        "强" : 2,
        "中" : 1,
        "弱" : 0,
        "无效" : -1,
        "" : -1
    }
    colors = ["white", "white", "white"];
    for (let i = 0; i < 3; ++i)
    {
        let bar = document.getElementById("bar" + i);
        if (strength == "无效" || strength == "")
            bar.style.display = "none";
        else
            bar.style.display = "flex";
        if (i <= KeyMap[strength])
            bar.style.backgroundColor = colors[KeyMap[strength]];
        else
            bar.style.backgroundColor = "#3388BB";

    }
}


//注册账号
function signup() {
    const username = document.getElementById("text-signup").value;
    const password = document.getElementById("password-signup").value;
    const passwordCheck = document.getElementById("password-signup-check").value;
    const strength = document.getElementById("strength");

    if (Store.get(username)) {
        showAlertWithCountdown("用户名已存在，请选择其他用户名。", 1);
        return ;
    }
    if (username.length == 0) {
        showAlertWithCountdown("请输入用户名", 1);
        return ;
    }
    if (strength.textContent != "强" && strength.textContent != "中") {
        showAlertWithCountdown("请提高密码强度", 1);
        return ;
    }

    if (password != passwordCheck) {
        showAlertWithCountdown("两次密码输入不相等", 1);
        return ;
    }
    Store.set(username, password);
    showAlertWithCountdown("注册成功！", 1);

    toLogin(username, password);
}

const toLogin = (usernameVal, passwordVal) => {
    const username = document.getElementById("text");
    const password = document.getElementById("password");

    username.value = usernameVal;
    password.value = passwordVal;

    toLoginPage();
}

// 登录账号
function login() {
    const username = document.getElementById("text").value;
    const password = document.getElementById("password").value;
    const storedPassword = Store.get(username);

    if (storedPassword === null) {
        showAlertWithCountdown("用户名不存在。", 1);
    } else if (storedPassword === password) {
        showAlertWithCountdown("登录成功！", 1);
        Store.set("token", username);

        // 跳转到主页
        window.location.href = `../../index.html?${window.$store.encode()}`;
    } else {
        showAlertWithCountdown("密码错误。", 1);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const signupLink = document.getElementById("signupLink");
    const loginLink = document.getElementById("loginLink");

    window.$store = new Store();

    // 初始显示登录表单
    loginForm.style.display = "block";
    signupForm.style.display = "none";

    // 处理登录和注册表单的切换
    signupLink.addEventListener("click", toSignupPage);

    loginLink.addEventListener("click", toLoginPage);
});

const toSignupPage = (e) => {
    if (e)
        e.preventDefault();
    loginForm.style.display = "none";
    signupForm.style.display = "block";
}

const toLoginPage = (e) => {
    if (e)
        e.preventDefault();
    loginForm.style.display = "block";
    signupForm.style.display = "none";
}

//模拟alert
function showAlertWithCountdown(message, seconds) {
    const alertElements = document.querySelectorAll(".custom-alert");
    console.debug(alertElements);
    alertElements.forEach((alertElement) => {
        const messageElement = alertElement.querySelector(".message");

        messageElement.textContent = message;

        // 显示模态框
        alertElement.classList.remove("hidden");

        // 开始倒计时
        setTimeout(() => {
            hideAlert();
        }, seconds * 1000);
    });
}

function hideAlert() {
    const alertElements = document.querySelectorAll(".custom-alert");
    alertElements.forEach((alertElement) => {
        alertElement.classList.add("hiding");
        setTimeout(() => {
            alertElement.classList.add("hidden");
            alertElement.classList.remove("hiding");
        }, 233);
    });
}
