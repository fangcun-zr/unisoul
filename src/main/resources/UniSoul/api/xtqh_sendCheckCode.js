const API_BASE_URL = 'http://localhost:8080';

function sendVerifyCode(email) {
    return $.ajax({
        url: `${API_BASE_URL}/xtqh/sendCheckCode`,
        type: 'GET',
        contentType: 'application/json',
        data: JSON.stringify({ email: email }),
        success: function(response) {
            alert("验证码发送成功: " + response.message);
        },
        error: function(error) {
            alert("验证码发送失败: " + error.responseText);
        }
    });
}