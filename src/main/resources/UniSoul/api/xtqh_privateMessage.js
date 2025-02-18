const API_BASE_URL = 'http://localhost:8080';

function sendPrivateMessage(senderName) {
    return $.ajax({
        url: `${API_BASE_URL}/xtqh/privateMessage`,
        type: 'GET',
        contentType: 'application/json',
        data: JSON.stringify({ senderName: senderName }),
        success: function(response) {
            alert("私信发送成功: " + response.message);
        },
        error: function(error) {
            alert("私信发送失败: " + error.responseText);
        }
    });
}