$(document).ready(function () {
    // 检查登录状态和管理员权限
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }

    let currentPage = 1;
    const pageSize = 10;
    let hasMore = true;
    let currentType = 'pending';
    let currentArticleId = null;

    // 加载文章列表
    function loadArticles(page = 1, type = 'pending') {
        if (!hasMore && page > 1) return;

        const api = type === 'pending' ? review.getPendingList : review.getReviewHistory;

        api(page, pageSize)
            .then(response => {
                if (response.code === 200) {
                    const articleList = $('.article-list');
                    const articles = response.data.list || [];

                    // 判断是否还有更多数据
                    hasMore = articles.length === pageSize;
                    $('#loadMore').toggle(hasMore);

                    // 如果是第一页，清空列表
                    if (page === 1) {
                        articleList.empty();
                    }

                    // 添加文章项
                    articles.forEach(article => {
                        const articleHtml = `
                            <div class="article-item">
                                <div class="article-header">
                                    <h3 class="article-title">${article.title}</h3>
                                    <span class="article-status status-${article.status}">
                                        ${getStatusText(article.status)}
                                    </span>
                                </div>
                                <div class="article-meta">
                                    <span>作者：${article.author}</span>
                                    <span class="mx-2">·</span>
                                    <span>提交时间：${article.createTime}</span>
                                </div>
                                <div class="article-preview">${article.content}</div>
                                <div class="article-footer">
                                    <button class="btn btn-primary btn-review" 
                                            data-id="${article.id}"
                                            ${type === 'history' ? 'disabled' : ''}>
                                        查看详情
                                    </button>
                                    ${type === 'history' ? `
                                        <div class="review-info">
                                            <span>审核人：${article.reviewer}</span>
                                            <span class="mx-2">·</span>
                                            <span>审核时间：${article.reviewTime}</span>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                        articleList.append(articleHtml);
                    });
                }
            })
            .catch(error => {
                console.error('加载文章列表失败:', error);
            });
    }

    // 获取状态文本
    function getStatusText(status) {
        switch (status) {
            case 'pending': return '待审核';
            case 'approved': return '已通过';
            case 'rejected': return '已拒绝';
            default: return '未知状态';
        }
    }

    // 查看文章详情
    $(document).on('click', '.btn-review', function () {
        const articleId = $(this).data('id');
        currentArticleId = articleId;

        // 这里可以添加获取文章详情的API调用
        // 暂时使用列表中的数据
        const $article = $(this).closest('.article-item');
        const title = $article.find('.article-title').text();
        const content = $article.find('.article-preview').text();

        // 显示模态框
        const $modal = $('#reviewModal');
        $modal.find('.modal-title').text(title);
        $modal.find('.article-content').html(content);
        $modal.modal('show');
    });

    // 审核操作
    function reviewArticle(action) {
        const comment = $('#reviewComment').val().trim();

        if (!comment) {
            alert('请填写审核意见');
            return;
        }

        review.reviewArticle(currentArticleId, action, comment)
            .then(response => {
                if (response.code === 200) {
                    $('#reviewModal').modal('hide');
                    // 重新加载文章列表
                    currentPage = 1;
                    loadArticles(1, currentType);
                } else {
                    alert(response.message || '审核失败');
                }
            })
            .catch(error => {
                console.error('审核操作失败:', error);
                alert('审核失败，请重试');
            });
    }

    // 通过按钮点击事件
    $('#approveBtn').click(function () {
        reviewArticle('approve');
    });

    // 拒绝按钮点击事件
    $('#rejectBtn').click(function () {
        reviewArticle('reject');
    });

    // 切换审核状态
    $('.btn-group .btn').click(function () {
        const $btn = $(this);
        if ($btn.hasClass('active')) return;

        $('.btn-group .btn').removeClass('active');
        $btn.addClass('active');

        currentType = $btn.data('type');
        currentPage = 1;
        hasMore = true;
        loadArticles(1, currentType);
    });

    // 加载更多
    $('#loadMore').click(function () {
        currentPage++;
        loadArticles(currentPage, currentType);
    });

    // 模态框关闭时重置表单
    $('#reviewModal').on('hidden.bs.modal', function () {
        $('#reviewComment').val('');
        currentArticleId = null;
    });

    // 初始化加载
    loadArticles();
});