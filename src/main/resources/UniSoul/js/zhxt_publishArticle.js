$(document).ready(function() {
    $('#publishArticleForm').on('submit', function(e) {
        e.preventDefault();

        const articleData = {
            employ_content: $('#employ_content').val().trim(),
            employ_title: $('#employ_title').val().trim(),
            employ_tags: $('#employ_tags').val().trim() || "技术,教程" // 默认标签
        };

        // 表单验证
        if (!articleData.employ_title) {
            $('#employ_title').addClass('is-invalid');
            $('#employ_title').siblings('.invalid-feedback').text('文章标题不能为空').show();
            return;
        }

        if (!articleData.employ_content) {
            $('#employ_content').addClass('is-invalid');
            $('#employ_content').siblings('.invalid-feedback').text('文章内容不能为空').show();
            return;
        }

        // 发布文章
        publishArticle(articleData);
    });

    // 输入框事件处理
    $('#employ_title, #employ_content').on('input', function() {
        $(this).removeClass('is-invalid').siblings('.invalid-feedback').hide();
    });
});