// 用户认证相关的API请求
const API_BASE_URL = 'http://localhost:8080';

const auth = {
    // 登录请求
    login: function (username, password) {
        return $.ajax({
            url: `${API_BASE_URL}/xtqh/login`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                username: username,
                password: password
            })
        });
    },

    // 检查登录状态
    checkLoginStatus: function () {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    // 退出登录
    logout: function () {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
};