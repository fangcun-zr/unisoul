$(document).ready(function () {
    // 如果已经登录，直接跳转到首页
    if (localStorage.getItem('token')) {
        window.location.href = 'dashboard.html';
        return;
    }

    // 表单验证
    function validateForm() {
        const username = $('#username').val().trim();
        const password = $('#password').val().trim();

        if (!username) {
            showError('username', '请输入用户名');
            return false;
        }
        if (!password) {
            showError('password', '请输入密码');
            return false;
        }
        return true;
    }

    // 显示错误信息
    function showError(field, message) {
        const $field = $(`#${field}`);
        $field.addClass('is-invalid')
            .siblings('.invalid-feedback')
            .text(message)
            .show();
    }

    // 清除错误信息
    function clearError(field) {
        const $field = $(`#${field}`);
        $field.removeClass('is-invalid')
            .siblings('.invalid-feedback')
            .hide();
    }

    // 输入框事件处理
    $('.form-control').on('input', function () {
        clearError(this.id);
    });

    // 处理登录表单提交
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const username = $('#username').val().trim();
        const password = $('#password').val().trim();

        // 显示加载状态
        const $submitBtn = $(this).find('button[type="submit"]');
        const originalText = $submitBtn.text();
        $submitBtn.prop('disabled', true).text('登录中...');

        // 发送登录请求
        auth.login(username, password)
            .then(response => {
                if (response.msg === "success") {
                    localStorage.setItem('token', response.token);
                    window.location.href = 'dashboard.html';
                } else {
                    showError('username', response.msg);
                }
            })
            .catch(error => {
                showError('username', error.message || '登录失败，请稍后重试');
            })
            .finally(() => {
                $submitBtn.prop('disabled', false).text(originalText);
            });
    });
});