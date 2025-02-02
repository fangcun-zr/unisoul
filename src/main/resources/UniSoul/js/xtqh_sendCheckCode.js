$(document).ready(function() {
    $('#sendCodeButton').click(function() {
        const email = $('#email').val().trim();

        if (!email) {
            $('#email').addClass('is-invalid');
            $('#email').siblings('.invalid-feedback').text('邮箱地址不能为空').show();
            return;
        }

        // 发送验证码
        sendVerifyCode(email);
    });

    // 输入框事件处理
    $('#email').on('input', function() {
        $(this).removeClass('is-invalid').siblings('.invalid-feedback').hide();
    });
});