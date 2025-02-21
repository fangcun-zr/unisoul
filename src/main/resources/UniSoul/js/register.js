$(document).ready(function() {
    let countdown = 60;
    const $sendCodeBtn = $('#sendCode');
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

    // 开始倒计时
    function startCountdown() {
        countdown = 60;
        $sendCodeBtn.prop('disabled', true);

        timer = setInterval(() => {
            countdown--;
            $sendCodeBtn.text(`${countdown}秒后重试`);

            if (countdown <= 0) {
                clearInterval(timer);
                $sendCodeBtn.prop('disabled', false).text('发送验证码');
            }
        }, 1000);
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

        if (!verifyCode || verifyCode.length !== 6) {
            showError('verifyCode', '请输入6位验证码');
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

    // // 发送验证码
    // $sendCodeBtn.off('click').on('click', function() {
    //     const email = $('#email').val().trim();
    //     if (!isValidEmail(email)) {
    //         showError('email', '请输入有效的邮箱地址');
    //         return;
    //     }
    //
    //     auth.sendVerifyCode(email)
    //         .done(function(response) {
    //             if (response.code === 1) {
    //                 startCountdown();
    //
    //             } else {
    //                 showError('email', response.message);
    //             }
    //         })
    //         .fail(function(jqXHR) {
    //             showError('email', '发送验证码失败，请稍后重试');
    //         });
    // });

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

        const userData = {
            email: $('#email').val().trim(),
            verifyCode: $('#verifyCode').val().trim(),
            username: $('#username').val().trim(),
            password: $('#password').val().trim()
        };

        // 显示加载状态
        const $submitBtn = $(this).find('button[type="submit"]');
        const originalText = $submitBtn.text();
        $submitBtn.prop('disabled', true).text('注册中...');

        auth.register(userData)
            .done(function(response) {
                if (response.code === 200) {
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