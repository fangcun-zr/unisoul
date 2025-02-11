const API_BASE_URL = 'http://localhost:8080';

function publishArticle(articleData) {
    return $.ajax({
        url: `${API_BASE_URL}/zxwl/add`, // 根据新接口文档更新URL
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(articleData),
        success: function(response) {
            alert("文章发布成功: " + response.message);
            // 可以选择重定向到文章列表或其他页面
            window.location.href = 'home.html';
        },
        error: function(error) {
            alert("文章发布失败: " + error.responseText);
        }
    });
}