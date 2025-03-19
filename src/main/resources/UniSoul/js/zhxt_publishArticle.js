// 动态布局调整函数
function adjustLayout() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // 根据屏幕尺寸动态调整组件高度
    if (windowWidth >= 992) { // 桌面设备
        $('.avatar-wrapper, #avatarWrapper').css('height', '250px');
    } else if (windowWidth >= 768) { // 平板设备
        $('.avatar-wrapper, #avatarWrapper').css('height', '200px');
    } else if (windowWidth >= 576) { // 大手机
        $('.avatar-wrapper, #avatarWrapper').css('height', '180px');
    } else { // 小手机
        $('.avatar-wrapper, #avatarWrapper').css('height', '150px');
    }

    // 如果窗口高度较小，减小编辑器区域高度
    if (windowHeight < 700) {
        $('.avatar-wrapper, #avatarWrapper').css('height', '150px');
        $('.ql-editor').css('min-height', '300px');
    } else {
        $('.ql-editor').css('min-height', '500px');
    }

    // 确保上传区域可见
    ensureAvatarWrapperVisible();
}

// 在全局范围定义函数，确保即使脚本被其他操作打断也能执行
function ensureAvatarWrapperVisible() {
    console.log("强制显示上传区域");
    $('.avatar-wrapper, #avatarWrapper').css({
        'display': 'block',
        'visibility': 'visible',
        'opacity': '1'
    }).show();

    $('#avatarPreview').css({
        'display': 'block',
        'visibility': 'visible'
    }).show();
}

// 执行多次，确保在不同时机都能显示
ensureAvatarWrapperVisible();

// 在DOMContentLoaded事件上确保显示
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM加载完成，确保上传区域显示");
    ensureAvatarWrapperVisible();
    adjustLayout(); // 初始调整布局

    // 创建一个MutationObserver监视DOM变化
    const observer = new MutationObserver(function() {
        ensureAvatarWrapperVisible();
    });

    // 开始观察body元素及其子元素的变化
    observer.observe(document.body, { childList: true, subtree: true });
});

// 监听窗口大小变化，确保在调整窗口大小时元素也能正确显示
window.addEventListener('resize', function() {
    ensureAvatarWrapperVisible();
    adjustLayout(); // 窗口大小变化时调整布局
});

$(document).ready(function() {
    // 立即强制显示
    ensureAvatarWrapperVisible();

    // 在短暂延迟后再次确保显示（防止其他脚本后续隐藏）
    setTimeout(ensureAvatarWrapperVisible, 100);
    setTimeout(ensureAvatarWrapperVisible, 500);
    setTimeout(ensureAvatarWrapperVisible, 1000);

    // 图片加载错误处理
    $('#avatarPreview').on('error', function() {
        console.log("图片加载错误，使用默认样式");
        $(this).attr('src', 'https://via.placeholder.com/600x300/4299e1/ffffff?text=点击上传文章封面');
        ensureAvatarWrapperVisible();
    });

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

    // 添加点击封面区域触发文件选择框的事件
    $('#avatarWrapper').on('click', function(e) {
        // 如果点击的是label或input本身，不需要额外触发
        if (e.target.id === 'avatarUpload' || $(e.target).closest('label[for="avatarUpload"]').length) {
            return;
        }
        $('#avatarUpload').click();
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

    // 获取表单数据
    function getFormData() {
        const tags = [];
        $('.tag').each(function() {
            tags.push($(this).text().trim());
        });
        console.log(quill); // 检查 quill 是否是一个有效的 Quill 实例
        console.log(quill.root); // 检查 quill.root 是否存在
        console.log(quill.root.innerHTML); // 检查 quill.root.innerHTML 的值而不是innerText


        formData.append('title', $('#articleTitle').val().trim());
        formData.append('tags', JSON.stringify(tags));
        formData.append('category_id', $('.category-item.active').data('category_id'));
        formData.append('allowComment', $('#allowComment').prop('checked'));
        formData.append('isOriginal', $('#isOriginal').prop('checked'));
        // 使用innerHTML而不是innerText来保留富文本格式
        formData.append('content', quill.root.innerHTML);

        return formData;
    }

    // 表单验证
    function validateForm() {
        if (!formData.get('title')) {
            alert('请输入文章标题');
            return false;
        }
        if (! formData.get('content')) {
            alert('请输入文章内容');
            return false;
        }
        if (formData.get('tags').length === 0) {
            alert('请至少添加一个标签');
            return false;
        }
        return true;
    }

    // 发布文章
    $('#publishBtn').on('click', function() {
        getFormData();
        if (validateForm()) {
            updatePublishPreview();
            $('#publishModal').modal('show');
        }
    });

    function updatePublishPreview() {

        $('.preview-title').text(formData.get('title'));
        $('.preview-meta .category').text(formData.get('category_id'));
        $('.preview-meta .date').text(new Date().toLocaleDateString());
        $('.preview-content').html(formData.get('content'));
        $('.preview-meta .tags').text(formData.get('tags'));
    }

    $('#confirmPublish').on('click', function() {
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        alert(JSON.stringify(formData));
        console.log(formData);
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
    // loadDraft();
});