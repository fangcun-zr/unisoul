$(document).ready(function () {
    // 检查登录状态
    if (localStorage.getItem('token')) {
        // 获取返回地址,如果没有则跳转到首页
        const returnUrl = sessionStorage.getItem('returnUrl') || 'dashboard.html';
        window.location.href = returnUrl;
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
        const remember = $('#remember').prop('checked'); // 获取记住我选项

        // 显示加载状态
        const $submitBtn = $(this).find('button[type="submit"]');
        const originalText = $submitBtn.html();
        $submitBtn.prop('disabled', true)
            .html('<i class="fas fa-spinner fa-spin"></i> 登录中...');

        // 发送登录请求
        auth.login(username, password)
            .then(response => {
                if (response.msg === "success") {
                    // 保存token
                    localStorage.setItem('token', response.token);

                    // 如果选择了记住我,保存用户名
                    if (remember) {
                        localStorage.setItem('username', username);
                    }

                    // 跳转到返回地址或首页
                    const returnUrl = sessionStorage.getItem('returnUrl') || 'dashboard.html';
                    window.location.href = returnUrl;
                } else {
                    showError('username', response.msg);
                }
            })
            .catch(error => {
                showError('username', error.message || '登录失败，请稍后重试');
            })
            .finally(() => {
                $submitBtn.prop('disabled', false).html(originalText);
            });
    });

    // 密码显示切换
    $('.password-toggle').on('click', function () {
        const $password = $('#password');
        const $icon = $(this).find('i');

        if ($password.attr('type') === 'password') {
            $password.attr('type', 'text');
            $icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            $password.attr('type', 'password');
            $icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

    // 如果存在保存的用户名,自动填充
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
        $('#username').val(savedUsername);
        $('#remember').prop('checked', true);
    }
});