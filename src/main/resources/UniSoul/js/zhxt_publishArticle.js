$(document).ready(function() {
    const formData = new FormData();
    // 初始化富文本编辑器
    const quill = new Quill('#editor', {
        theme: 'snow',
        placeholder: '开始写作你的文章...',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                ['link', 'image'],
                [{ 'align': [] }],
                ['clean']
            ]
        }
    });

    // 文章标题字数统计
    $('#articleTitle').on('input', function() {
        const titleLength = $(this).val().length;
        $('.title-counter').text(`${titleLength}/100`);
    });

    // 绑定文件选择事件
    document.getElementById('avatarUpload').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        // 验证文件类型和大小
        if (!file.type.startsWith('image/')) {
            alert('请选择图片文件');
            this.value = ''; // 清空文件选择框
            return;
        }
        if (file.size > 20 * 1024 * 1024) { // 最大限制为 20MB
            alert('图片大小不能超过20MB');
            this.value = ''; // 清空文件选择框
            return;
        }

        // 使用 FileReader 预览图片
        const reader = new FileReader();
        reader.onload = function (event) {
            const previewImage = document.getElementById('avatarPreview');
            previewImage.src = event.target.result; // 更新图片预览
        };
        reader.readAsDataURL(file);

        // 将图片添加到 formData
        formData.append('file', file);
    });

    // 标签管理
    $('.tag-input').on('keypress', function(e) {
        if (e.which === 13) {
            e.preventDefault();
            const tag = $(this).val().trim();
            if (tag && $('.tag').length < 5) {
                addTag(tag);
                $(this).val('');
            } else if ($('.tag').length >= 5) {
                alert('最多添加5个标签');
            }
        }
    });

    $('.tag-suggestion').on('click', function() {
        const tag = $(this).text();
        if ($('.tag').length < 5) {
            addTag(tag);
        } else {
            alert('最多添加5个标签');
        }
    });

    function addTag(text) {
        if (!$('.tag-list').find(`.tag:contains("${text}")`).length) {
            $('.tag-list').append(`
                <span class="tag">
                    ${text}
                    <i class="fas fa-times remove-tag"></i>
                </span>
            `);
        }
    }

    $(document).on('click', '.remove-tag', function() {
        $(this).parent().remove();
    });

    // 分类选择
    $('.category-item').on('click', function() {
        $('.category-item').removeClass('active');
        $(this).addClass('active');
    });

    // 自动保存
    let autoSaveTimer;
    function autoSave() {
        const data = getFormData();
        localStorage.setItem('article_draft', JSON.stringify(data));
        $('.save-status').html('<i class="fas fa-check-circle"></i> 已自动保存');
    }

    $('#articleTitle, #editor').on('input', function() {
        clearTimeout(autoSaveTimer);
        $('.save-status').html('<i class="fas fa-sync-alt fa-spin"></i> 保存中...');
        autoSaveTimer = setTimeout(autoSave, 1000);
    });

    // 加载草稿
    function loadDraft() {
        const draft = localStorage.getItem('article_draft');
        if (draft) {
            const data = JSON.parse(draft);
            $('#articleTitle').val(data.title);
            quill.root.innerHTML = data.content;
            if (data.tags) {
                data.tags.forEach(tag => addTag(tag));
            }
            if (data.category) {
                $(`.category-item[data-category="${data.category}"]`).click();
            }
            $('#allowComment').prop('checked', data.allowComment);
            $('#isOriginal').prop('checked', data.isOriginal);
            $('.title-counter').text(`${data.title.length}/100`);
        }
    }

    // 获取表单数据
    function getFormData() {
        const tags = [];
        $('.tag').each(function() {
            tags.push($(this).text().trim());
        });

        formData.append('tags', JSON.stringify(tags));
        formData.append('category_id', $('.category-item.active').data('category'));
        formData.append('allowComment', $('#allowComment').prop('checked'));
        formData.append('isOriginal', $('#isOriginal').prop('checked'));
        formData.append('content', quill.root.innerHTML);
        formData.append('title', $('#articleTitle').val().trim());
        return formData;
    }

    // 表单验证
    function validateForm() {
        const data = getFormData();

        if (!data.title) {
            alert('请输入文章标题');
            return false;
        }
        if (!data.content || data.content === '<p><br></p>') {
            alert('请输入文章内容');
            return false;
        }
        if (data.tags.length === 0) {
            alert('请至少添加一个标签');
            return false;
        }
        return true;
    }

    // 发布文章
    $('#publishBtn').on('click', function() {
        if (validateForm()) {
            updatePublishPreview();
            $('#publishModal').modal('show');
        }
    });

    function updatePublishPreview() {
        const data = getFormData();
        $('.preview-title').text(data.title);
        $('.preview-meta .category').text(data.category_id);
        $('.preview-meta .tags').text(data.tags.join(', '));
    }

    $('#confirmPublish').on('click', function() {
        const formData = new FormData();
        const data = getFormData();

        // 添加基本信息
        formData.append('title', data.title);
        formData.append('content', data.content);
        formData.append('category_id', data.category_id);
        formData.append('tags', JSON.stringify(data.tags));
        formData.append('allowComment', data.allowComment);
        formData.append('isOriginal', data.isOriginal);

        // 添加封面图片
        const coverImage = $('#coverImage')[0].files[0];
        if (coverImage) {
            formData.append('coverImage', coverImage);
        }

        // 发送请求
        $.ajax({
            url: `${API_BASE_URL}/zhxt/publish`,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.code === 1) {
                    alert('文章发布成功！');
                    localStorage.removeItem('article_draft');
                    window.location.href = 'home.html';
                } else {
                    alert('发布失败：' + response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                alert('发布失败，请稍后重试');
            },
            complete: function() {
                $('#publishModal').modal('hide');
            }
        });
    });

    // 预览功能
    $('#previewBtn').on('click', function() {
        if (validateForm()) {
            const data = getFormData();
            // TODO: 实现预览功能
            alert('预览功能开发中');
        }
    });

    // 页面加载时恢复草稿
    loadDraft();
});