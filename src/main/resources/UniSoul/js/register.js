$(document).ready(function() {
    let timer = null;

    // 邮箱验证
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

    // 表单验证
    function validateForm() {
        const email = $('#email').val().trim();
        const verifyCode = $('#verifyCode').val().trim();
        const username = $('#username').val().trim();
        const password = $('#password').val().trim();
        const confirmPassword = $('#confirmPassword').val().trim();

        if (!isValidEmail(email)) {
            showError('email', '请输入有效的邮箱地址');
            return false;
        }

        if (!verifyCode || verifyCode.length !== 4) {
            showError('verifyCode', '请输入4位验证码');
            return false;
        }

        if (!username || username.length < 3 || username.length > 20) {
            showError('username', '用户名长度应为3-20个字符');
            return false;
        }

        if (!password || password.length < 6) {
            showError('password', '密码长度至少6个字符');
            return false;
        }

        if (password !== confirmPassword) {
            showError('confirmPassword', '两次输入的密码不一致');
            return false;
        }

        return true;
    }

    // 输入框事件处理
    $('.form-control').on('input', function() {
        clearError(this.id);
    });

    // 密码一致性检查
    $('#confirmPassword').on('input', function() {
        const password = $('#password').val();
        const confirmPassword = $(this).val();

        if (password && confirmPassword && password !== confirmPassword) {
            showError('confirmPassword', '两次输入的密码不一致');
        }
    });

    // 处理注册表单提交
    $('#registerForm').off('submit').on('submit', function(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        //验证码检查
        const verifyCode = $('#verifyCode').val().trim();
        if (verifyCode !== localStorage.getItem('verifyCode')) { // 检查验证码是否正确
            showError('verifyCode', '验证码错误');
            return;
        }

        const userData = {
            email: $('#email').val().trim(),
            username: $('#username').val().trim(),
            password: $('#password').val().trim()
        };

        // 显示加载状态
        const $submitBtn = $(this).find('button[type="submit"]');
        const originalText = $submitBtn.text();
        $submitBtn.prop('disabled', true).text('注册中...');

        auth.register(userData)
            .done(function(response) {
                if (response.code === 1) {
                    alert('注册成功！');
                    window.location.href = 'login.html';
                } else {
                    showError('username', response.message);
                }
            })
            .fail(function(jqXHR) {
                showError('username', '注册失败，请稍后重试');
            })
            .always(function() {
                $submitBtn.prop('disabled', false).text(originalText);
            });
    });

    // 页面卸载时清除定时器
    $(window).on('unload', function() {
        if (timer) {
            clearInterval(timer);
        }
    });
});