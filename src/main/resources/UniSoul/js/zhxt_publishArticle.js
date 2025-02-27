$(document).ready(function() {
    // 初始化富文本编辑器
    const quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline'],
                ['link', 'image'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['clean']
            ]
        }
    });

    // 文章标题字数统计
    $('#articleTitle').on('input', function() {
        const titleLength = $(this).val().length;
        $('.title-counter').text(`${titleLength}/100`);
    });

    // 封面上传预览
    $('#coverUpload').on('click', function() {
        $('#coverImage').click();
    });

    $('#coverImage').on('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('.upload-preview img').attr('src', e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });

    // 标签添加
    $('input[placeholder="输入标签后按回车添加"]').on('keypress', function(e) {
        if (e.which === 13) {
            const tag = $(this).val();
            if (tag) {
                $('.tag-list').append(`<span class="tag">${tag} <i class="fas fa-times remove-tag"></i></span>`);
                $(this).val('');
            }
        }
    });

    // 移除标签
    $(document).on('click', '.remove-tag', function() {
        $(this).parent().remove();
    });

    // 发布文章
    $('#publishArticle').on('click', function() {
        $('#publishModal').modal('show');
    });

    $('#confirmPublish').on('click', function() {
        // 这里可以添加发布文章的逻辑
        const title = $('#articleTitle').val();
        const content = quill.root.innerHTML;
        const cover = $('#coverImage')[0].files[0];
        articleData = {
            title: title,
            content: content,
            file: cover,
        }

        if (title && content) {
            // 这里可以添加 AJAX 请求发布文章

            article.publish(articleData)
                .then(response => {
                    if (response.code === 1) {
                        alert('文章发布成功！');
                        // 这里可以添加重定向到文章列表页面的逻辑
                    }
                })

            $('#publishModal').modal('hide');
        } else {
            alert('请填写标题和内容。');
        }
    });

    // 预览文章
    $('#previewArticle').on('click', function() {
        const title = $('#articleTitle').val();
        const content = quill.root.innerHTML;

        if (title && content) {
            // 这里可以添加预览文章的逻辑
            alert('预览功能尚未实现！');
        } else {
            alert('请填写标题和内容以进行预览。');
        }
    });
});
