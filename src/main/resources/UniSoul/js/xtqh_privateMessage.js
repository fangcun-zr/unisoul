$(document).ready(function() {
    $('#privateMessageForm').on('submit', function(e) {
        e.preventDefault();

        const senderName = $('#senderName').val().trim();

        if (!senderName) {
            $('#senderName').addClass('is-invalid');
            $('#senderName').siblings('.invalid-feedback').text('发信人昵称不能为空').show();
            return;
        }

        sendPrivateMessage(senderName);
    });

    // 输入框事件处理
    $('#senderName').on('input', function() {
        $(this).removeClass('is-invalid').siblings('.invalid-feedback').hide();
    });
});