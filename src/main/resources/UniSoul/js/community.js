import articleAPI from '../api/article.js';
import userAPI from '../api/user.js';
import publishArticle from '../api/zhxt_publishArticle.js';

// 全局变量
let editor = null;
let selectedTags = new Set();

// 页面加载完成后执行
$(document).ready(function() {
    initializeComponents();
    loadInitialData();
    bindEvents();
});

// 初始化组件
function initializeComponents() {
    // 初始化富文本编辑器
    editor = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['clean'],
                ['link', 'image', 'video']
            ]
        },
        placeholder: '开始创作你的文章...'
    });

    // 初始化文章分类下拉框
    loadCategories();

    // 初始化推荐标签
    loadSuggestedTags();
}

// 加载初始数据
function loadInitialData() {
    loadArticles();
    loadUserInfo();
    loadNotifications();
}

// 绑定事件
function bindEvents() {
    // 创建文章按钮点击事件
    $('#createPostBtn').click(() => {
        $('#createPostModal').modal('show');
    });

    // 发布文章
    $('#publishArticle').click(handlePublishArticle);

    // 保存草稿
    $('#saveDraft').click(handleSaveDraft);

    // 预览文章
    $('#previewArticle').click(handlePreviewArticle);

    // 文章封面上传
    $('#coverImage').change(handleCoverImageUpload);

    // 标签输入
    $('#tagInput').keydown(handleTagInput);

    // 文章交互事件
    $(document).on('click', '.like-btn', handleLikeArticle);
    $(document).on('click', '.collect-btn', handleCollectArticle);
    $(document).on('click', '.comment-btn', handleCommentArticle);
    $(document).on('click', '.share-btn', handleShareArticle);

    // 关注用户
    $(document).on('click', '.follow-btn', handleFollowUser);

    // 加载更多文章
    $('.btn-load-more').click(loadMoreArticles);

    // 通知中心
    $('.mark-all-read').click(markAllNotificationsRead);
}

// 处理文章发布
async function handlePublishArticle() {
    try {
        const articleData = collectArticleData();

        // 显示加载状态
        showLoading('#publishArticle');

        await publishArticle.publish(articleData);

        // 发布成功
        showSuccess('文章发布成功！');
        $('#createPostModal').modal('hide');

        // 重新加载文章列表
        loadArticles();
    } catch (error) {
        showError('发布失败：' + error.message);
    } finally {
        hideLoading('#publishArticle');
    }
}

// 收集文章数据
function collectArticleData() {
    return {
        title: $('#postTitle').val().trim(),
        content: editor.root.innerHTML,
        file: $('#coverImage')[0].files[0],
        category: $('#articleCategory').val(),
        tags: Array.from(selectedTags),
        allowComment: $('#allowComment').is(':checked'),
        isOriginal: $('#isOriginal').is(':checked')
    };
}

// 加载文章列表
async function loadArticles(page = 1) {
    try {
        const response = await articleAPI.getArticles({ page });
        renderArticles(response.data);
    } catch (error) {
        showError('加载文章失败');
    }
}

// 渲染文章列表
function renderArticles(articles) {
    const articleList = $('.article-list');

    articles.forEach(article => {
        const articleElement = createArticleElement(article);
        articleList.append(articleElement);
    });
}

// 创建文章元素
function createArticleElement(article) {
    return `
        <div class="article-card" data-id="${article.id}">
            <div class="article-header">
                <div class="author-info">
                    <img src="${article.author.avatar}" alt="${article.author.name}" class="author-avatar">
                    <div class="author-meta">
                        <h6 class="author-name">${article.author.name}</h6>
                        <span class="post-meta">
                            <i class="far fa-clock"></i> ${formatTime(article.createTime)}
                            <span class="dot">·</span>
                            <i class="fas fa-tag"></i> ${article.category}
                        </span>
                    </div>
                </div>
                <button class="btn btn-outline-primary btn-sm follow-btn" data-user-id="${article.author.id}">
                    ${article.author.isFollowed ? '已关注' : '关注'}
                </button>
            </div>
            <div class="article-content">
                <h2 class="article-title">${article.title}</h2>
                <p class="article-excerpt">${article.excerpt}</p>
                ${article.cover ? `<div class="article-cover"><img src="${article.cover}" alt="文章封面"></div>` : ''}
            </div>
            <div class="article-footer">
                <div class="article-tags">
                    ${article.tags.map(tag => `<span class="tag"><i class="fas fa-tag"></i> ${tag}</span>`).join('')}
                </div>
                <div class="article-actions">
                    <button class="action-btn like-btn ${article.isLiked ? 'active' : ''}" data-id="${article.id}">
                        <i class="far fa-heart"></i>
                        <span>${article.likeCount}</span>
                    </button>
                    <button class="action-btn comment-btn" data-id="${article.id}">
                        <i class="far fa-comment"></i>
                        <span>${article.commentCount}</span>
                    </button>
                    <button class="action-btn collect-btn ${article.isCollected ? 'active' : ''}" data-id="${article.id}">
                        <i class="far fa-bookmark"></i>
                        <span>${article.collectCount}</span>
                    </button>
                    <button class="action-btn share-btn" data-id="${article.id}">
                        <i class="far fa-share-square"></i>
                        <span>分享</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// 工具函数
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) { // 小于1分钟
        return '刚刚';
    } else if (diff < 3600000) { // 小于1小时
        return `${Math.floor(diff / 60000)}分钟前`;
    } else if (diff < 86400000) { // 小于24小时
        return `${Math.floor(diff / 3600000)}小时前`;
    } else if (diff < 604800000) { // 小于7天
        return `${Math.floor(diff / 86400000)}天前`;
    } else {
        return date.toLocaleDateString();
    }
}

// 显示提示信息
function showSuccess(message) {
    ELEMENT.Message.success(message);
}

function showError(message) {
    ELEMENT.Message.error(message);
}

function showLoading(selector) {
    $(selector).prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> 处理中...');
}

function hideLoading(selector) {
    $(selector).prop('disabled', false).html($(selector).data('original-text'));
}

// 导出模块
export default {
    initializeComponents,
    loadInitialData,
    bindEvents
};
// 继续前面的代码...

// 处理文章交互
async function handleLikeArticle(e) {
    e.preventDefault();
    const $btn = $(this);
    const articleId = $btn.data('id');

    try {
        await articleAPI.likeArticle(articleId);

        // 更新UI
        const $count = $btn.find('span');
        const currentCount = parseInt($count.text());
        if ($btn.hasClass('active')) {
            $btn.removeClass('active');
            $count.text(currentCount - 1);
        } else {
            $btn.addClass('active');
            $count.text(currentCount + 1);
        }
        $btn.find('i').toggleClass('far fas');
    } catch (error) {
        showError('操作失败，请稍后重试');
    }
}

// 处理收藏文章
async function handleCollectArticle(e) {
    e.preventDefault();
    const $btn = $(this);
    const articleId = $btn.data('id');

    try {
        await articleAPI.collectArticle(articleId);

        // 更新UI
        const $count = $btn.find('span');
        const currentCount = parseInt($count.text());
        if ($btn.hasClass('active')) {
            $btn.removeClass('active');
            $count.text(currentCount - 1);
        } else {
            $btn.addClass('active');
            $count.text(currentCount + 1);
        }
        $btn.find('i').toggleClass('far fas');
    } catch (error) {
        showError('操作失败，请稍后重试');
    }
}

// 处理评论文章
function handleCommentArticle(e) {
    e.preventDefault();
    const articleId = $(this).data('id');

    // 创建评论模态框
    showCommentModal(articleId);
}

// 显示评论模态框
function showCommentModal(articleId) {
    const modalHtml = `
        <div class="modal fade" id="commentModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">发表评论</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <textarea class="form-control" id="commentContent" rows="4" 
                                placeholder="写下你的评论..."></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" id="submitComment">发表评论</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 添加到页面并显示
    $('body').append(modalHtml);
    const modal = new bootstrap.Modal('#commentModal');
    modal.show();

    // 绑定提交评论事件
    $('#submitComment').click(async () => {
        const content = $('#commentContent').val().trim();
        if (!content) {
            showError('请输入评论内容');
            return;
        }

        try {
            await articleAPI.addComment(articleId, content);
            showSuccess('评论发表成功');
            modal.hide();
            // 重新加载评论列表
            loadComments(articleId);
        } catch (error) {
            showError('评论发表失败，请稍后重试');
        }
    });

    // 模态框关闭时移除
    $('#commentModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
}

// 处理分享文章
function handleShareArticle(e) {
    e.preventDefault();
    const articleId = $(this).data('id');

    // 创建分享模态框
    showShareModal(articleId);
}

// 显示分享模态框
function showShareModal(articleId) {
    const modalHtml = `
        <div class="modal fade" id="shareModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">分享文章</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="share-options">
                            <button class="btn btn-outline-primary share-btn" data-type="weixin">
                                <i class="fab fa-weixin"></i> 微信
                            </button>
                            <button class="btn btn-outline-primary share-btn" data-type="weibo">
                                <i class="fab fa-weibo"></i> 微博
                            </button>
                            <button class="btn btn-outline-primary share-btn" data-type="qq">
                                <i class="fab fa-qq"></i> QQ
                            </button>
                        </div>
                        <div class="mt-3">
                            <label class="form-label">文章链接</label>
                            <div class="input-group">
                                <input type="text" class="form-control" id="shareLink" 
                                       value="${window.location.origin}/article/${articleId}" readonly>
                                <button class="btn btn-outline-secondary" id="copyLink">
                                    复制链接
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 添加到页面并显示
    $('body').append(modalHtml);
    const modal = new bootstrap.Modal('#shareModal');
    modal.show();

    // 绑定复制链接事件
    $('#copyLink').click(() => {
        const linkInput = document.getElementById('shareLink');
        linkInput.select();
        document.execCommand('copy');
        showSuccess('链接已复制到剪贴板');
    });

    // 绑定社交分享事件
    $('.share-btn').click(function() {
        const type = $(this).data('type');
        const url = encodeURIComponent(window.location.origin + '/article/' + articleId);
        const title = encodeURIComponent($(`[data-id="${articleId}"]`).find('.article-title').text());

        let shareUrl = '';
        switch(type) {
            case 'weixin':
                // 显示二维码
                showQRCode(url);
                break;
            case 'weibo':
                shareUrl = `http://service.weibo.com/share/share.php?url=${url}&title=${title}`;
                break;
            case 'qq':
                shareUrl = `http://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${title}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=500');
        }
    });

    // 模态框关闭时移除
    $('#shareModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
}

// 显示二维码
function showQRCode(url) {
    const qrcode = new QRCode(document.createElement("div"), {
        text: url,
        width: 128,
        height: 128
    });

    const modalHtml = `
        <div class="modal fade" id="qrcodeModal" tabindex="-1">
            <div class="modal-dialog modal-sm">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">微信扫码分享</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        ${qrcode.createImgTag()}
                        <p class="mt-2">请使用微信扫描二维码</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('body').append(modalHtml);
    const modal = new bootstrap.Modal('#qrcodeModal');
    modal.show();

    $('#qrcodeModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
}

// 处理关注用户
async function handleFollowUser(e) {
    e.preventDefault();
    const $btn = $(this);
    const userId = $btn.data('user-id');

    try {
        if ($btn.hasClass('active')) {
            await userAPI.unfollowUser(userId);
            $btn.removeClass('active').text('关注');
        } else {
            await userAPI.followUser(userId);
            $btn.addClass('active').text('已关注');
        }
    } catch (error) {
        showError('操作失败，请稍后重试');
    }
}

// 加载更多文章
let currentPage = 1;
async function loadMoreArticles() {
    const $btn = $('.btn-load-more');
    try {
        $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> 加载中...');
        currentPage++;
        const response = await articleAPI.getArticles({ page: currentPage });

        if (response.data.length === 0) {
            $btn.text('没有更多文章了').prop('disabled', true);
            return;
        }

        renderArticles(response.data);
    } catch (error) {
        showError('加载失败，请稍后重试');
        currentPage--; // 恢复页码
    } finally {
        $btn.prop('disabled', false).html('<i class="fas fa-sync-alt"></i> 加载更多');
    }
}

// 标记所有通知为已读
async function markAllNotificationsRead() {
    try {
        await userAPI.markAllNotificationsRead();
        $('.notification-item.unread').removeClass('unread');
        $('.notification-badge').hide();
        showSuccess('已将所有通知标记为已读');
    } catch (error) {
        showError('操作失败，请稍后重试');
    }
}

// 导出所有功能
export {
    handleLikeArticle,
    handleCollectArticle,
    handleCommentArticle,
    handleShareArticle,
    handleFollowUser,
    loadMoreArticles,
    markAllNotificationsRead
};