// api/register.js

const API_BASE_URL = 'http://localhost:8080';

const auth = {
    // 发送邮箱验证码
    sendVerifyCode: function (email) {
        return $.ajax({
            url: `${API_BASE_URL}/xtqh/sendCheckCode`,
            type: 'GET',
            data: { email: email }
        });
    },

    // 用户注册
    register: function (userData) {
        return $.ajax({
            url: `${API_BASE_URL}/xtqh/register`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(userData)
        });
    }
};

$(document).ready(function() {
    // 确保事件绑定只发生一次
    $('#sendCode').off('click').on('click', function() {
        const email = $('#email').val().trim();

        if (!email) {
            alert('请输入有效的邮箱地址');
            return;
        }

        // 禁用按钮以防止重复点击
        const $sendCodeBtn = $(this);
        $sendCodeBtn.prop('disabled', true);

        auth.sendVerifyCode(email)
            .done(function(response) {
                console.log('验证码发送响应:', response); // 调试输出
                if (response && response.code === 1) {
                    alert('验证码发送成功:，请在邮箱查看');
                    // 启动倒计时逻辑
                } else {
                    alert('验证码发送失败: ' + (response ? response.msg : '未知错误'));
                }
            })
            .fail(function(jqXHR) {
                alert('验证码发送失败: ' + (jqXHR.responseJSON ? jqXHR.responseJSON.msg : '未知错误'));
            })
            .always(function() {
                // 请求完成后重新启用按钮
                $sendCodeBtn.prop('disabled', false);
            });
    });

    // 注册请求
    $('#registerForm').off('submit').on('submit', function(event) {
        event.preventDefault();

        const email = $('#email').val().trim();
        const verifyCode = $('#verifyCode').val().trim();
        const username = $('#username').val().trim();
        const password = $('#password').val().trim();
        const confirmPassword = $('#confirmPassword').val().trim();

        if (password !== confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }

        const userData = {
            email: email,
            verifyCode: verifyCode,
            username: username,
            password: password
        };

        // 禁用提交按钮以防止重复提交
        const $submitBtn = $(this).find('button[type="submit"]');
        $submitBtn.prop('disabled', true).text('注册中...');

        auth.register(userData)
            .done(function(response) {
                console.log('注册响应:', response); // 调试输出
                if (response && response.code === 1) {
                    alert('注册成功: ' + response.data);
                    window.location.href = 'login.html';
                } else {
                    alert('注册失败: ' + (response ? response.msg : '未知错误'));
                }
            })
            .fail(function(jqXHR) {
                alert('注册失败: ' + (jqXHR.responseJSON ? jqXHR.responseJSON.msg : '未知错误'));
            })
            .always(function() {
                // 请求完成后重新启用按钮
                $submitBtn.prop('disabled', false).text('注册');
            });
    });
});