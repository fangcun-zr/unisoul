// 用户认证相关的API请求
const API_BASE_URL = 'http://localhost:8080';

const auth = {
    // 发送邮箱验证码
    sendVerifyCode: function (email) {
        return $.ajax({
            url: `${API_BASE_URL}/auth/sendEmailCode`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email: email })
        });
    },

    // 注册请求
    register: function (userData) {
        return $.ajax({
            url: `${API_BASE_URL}/auth/register`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(userData)
        });
    }
};