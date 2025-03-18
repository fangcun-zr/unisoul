$(document).ready(function() {
    // 文章管理相关变量
    let currentPage = 1;
    const pageSize = 10;
    let selectedCategoryId = 0; // 初始化为0，而不是空字符串
    let searchKeywords = '';
    let selectedStatus = null; // null表示全部状态

    // 初始加载文章列表
    loadArticlesList();

    // 搜索按钮点击事件
    $('#searchArticlesBtn').on('click', function() {
        selectedCategoryId = $('#articleCategoryFilter').val() || 0; // 当选择"全部分类"（空值）时，设置为0
        searchKeywords = $('#articleKeywords').val();
        currentPage = 1; // 重置为第一页
        loadArticlesList();
    });

    // 先移除可能已有的点击事件，防止重复绑定
    $('.status-btn').off('click');

    // 重新绑定状态过滤按钮点击事件 - 单独绑定每个按钮
    $('#allStatusBtn').on('click', function() {
        console.log("点击了全部按钮");
        $('.status-btn').removeClass('active');
        $(this).addClass('active');
        selectedStatus = null; // 全部
        currentPage = 1;
        loadArticlesList();
    });

    $('#approvedStatusBtn').on('click', function() {
        console.log("点击了已审核按钮");
        $('.status-btn').removeClass('active');
        $(this).addClass('active');
        selectedStatus = 1; // 已审核
        currentPage = 1;
        loadArticlesList();
    });

    $('#pendingStatusBtn').on('click', function() {
        console.log("点击了未审核按钮");
        $('.status-btn').removeClass('active');
        $(this).addClass('active');
        selectedStatus = 0; // 未审核
        currentPage = 1;
        loadArticlesList();
    });

    // 加载文章列表
    function loadArticlesList() {
        console.log("执行loadArticlesList函数，当前状态过滤值:", selectedStatus);

        const requestData = {
            page: currentPage,
            pageSize: pageSize
        };

        // 只有当选择了具体分类时（1，2，3，4），才添加category_id参数
        if (parseInt(selectedCategoryId) > 0) {
            requestData.category_id = parseInt(selectedCategoryId);
        }

        if (searchKeywords) {
            requestData.keyWords = searchKeywords;
        }

        // 添加状态过滤
        if (selectedStatus !== null) {
            requestData.status = selectedStatus;
            console.log("添加状态过滤，值为:", selectedStatus);
        }

        console.log("发送请求数据:", JSON.stringify(requestData));

        $.ajax({
            url: BASE_API_URL + '/zhxt/list',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function(response) {
                console.log("API响应:", response);
                if (response.code === 1 || response.code === 200) {
                    console.log("文章总数:", response.data.total);
                    console.log("文章记录数:", response.data.records ? response.data.records.length : 0);

                    // 更新文章计数和显示当前筛选条件
                    $('#articleCount').text(response.data.total || 0);
                    updateFilterStatusText();

                    // 更新文章列表和分页
                    renderArticlesList(response.data);
                    renderPagination(response.data.total);
                } else {
                    console.error("加载文章列表失败:", response.message);
                    $('#articleTable tbody').html('<tr><td colspan="7" class="text-center">加载失败，请重试</td></tr>');
                    $('#articleCount').text('0');
                }
            },
            error: function(xhr, status, error) {
                console.error("加载文章列表失败:", error);
                console.error("错误状态:", status);
                console.error("XHR对象:", xhr);
                $('#articleTable tbody').html('<tr><td colspan="7" class="text-center">加载失败，请重试</td></tr>');
                $('#articleCount').text('0');
            }
        });
    }

    // 更新筛选状态文本
    function updateFilterStatusText() {
        let statusText = '全部';
        if (selectedStatus === 1) {
            statusText = '已审核';
        } else if (selectedStatus === 0) {
            statusText = '未审核';
        }

        let categoryText = '全部分类';
        if (parseInt(selectedCategoryId) > 0) {
            categoryText = getCategoryName(selectedCategoryId);
        }

        let filterText = `${statusText}`;
        if (categoryText !== '全部分类') {
            filterText += ` / ${categoryText}`;
        }
        if (searchKeywords) {
            filterText += ` / 关键词: "${searchKeywords}"`;
        }

        $('.article-count-container').html(`
            当前筛选: <span class="filter-status">${filterText}</span> - 
            共 <span id="articleCount">${$('#articleCount').text()}</span> 篇文章
        `);
    }

    // 渲染文章列表
    function renderArticlesList(data) {
        const tbody = $('#articleTable tbody');
        tbody.empty();

        console.log("渲染文章列表，当前状态过滤:", selectedStatus);

        if (!data || !data.records || data.records.length === 0) {
            tbody.html('<tr><td colspan="7" class="text-center">暂无文章数据</td></tr>');
            return;
        }

        // 渲染文章列表
        data.records.forEach(function(article) {
            let statusClass = '';
            let statusText = '';

            // 设置状态样式和文本
            switch(article.status) {
                case 'published':
                case 'approved':
                case 1:
                    statusClass = 'status-published';
                    statusText = '已发布';
                    break;
                case 'pending':
                case 0:
                    statusClass = 'status-pending';
                    statusText = '待审核';
                    break;
                case 'rejected':
                case 2:
                    statusClass = 'status-banned';
                    statusText = '已拒绝';
                    break;
                default:
                    statusClass = 'status-pending';
                    statusText = '未知';
            }

            // 获取分类名称
            let categoryName = getCategoryName(article.category_id);

            // 格式化时间
            let createTime = article.create_time ? formatApiTime(article.create_time) : '-';

            // 根据当前选中的状态过滤添加高亮效果
            let rowHighlight = '';
            if (selectedStatus === 1 && (article.status === 1 || article.status === 'published' || article.status === 'approved')) {
                rowHighlight = 'class="highlighted-row"';
            } else if (selectedStatus === 0 && (article.status === 0 || article.status === 'pending')) {
                rowHighlight = 'class="highlighted-row"';
            }

            const row = `
                <tr data-id="${article.id || article.article_id}" ${rowHighlight}>
                    <td>${article.id || article.article_id}</td>
                    <td>${article.title}</td>
                    <td>${categoryName}</td>
                    <td>${article.author || '-'}</td>
                    <td>${createTime}</td>
                    <td><span class="status-label ${statusClass}">${statusText}</span></td>
                    <td class="action-btns">
                        <button class="action-btn action-btn-view view-article-btn" data-id="${article.id || article.article_id}">查看</button>
                        <button class="action-btn action-btn-edit review-article-btn" data-id="${article.id || article.article_id}">审核</button>
                        <button class="action-btn action-btn-delete delete-article-btn" data-id="${article.id || article.article_id}">删除</button>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });

        // 绑定操作按钮事件
        bindArticleActions();
    }

    // 帮助函数：格式化API返回的时间数组
    function formatApiTime(timeArray) {
        if (!timeArray || !Array.isArray(timeArray) || timeArray.length < 6) {
            return '-';
        }

        const [year, month, day, hour, minute, second] = timeArray;
        return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`;
    }

    // 获取分类名称
    function getCategoryName(categoryId) {
        const categories = {
            1: '学习',
            2: '就业',
            3: '心理',
            4: '其他'
        };

        return categories[categoryId] || '未分类';
    }

    // 绑定文章操作按钮事件
    function bindArticleActions() {
        // 查看文章
        $('.view-article-btn').off('click').on('click', function() {
            const articleId = $(this).data('id');
            viewArticleDetail(articleId);
        });

        // 审核文章
        $('.review-article-btn').off('click').on('click', function() {
            const articleId = $(this).data('id');
            showReviewArticleModal(articleId);
        });

        // 删除文章
        $('.delete-article-btn').off('click').on('click', function() {
            const articleId = $(this).data('id');
            confirmDeleteArticle(articleId);
        });
    }

    // 查看文章详情
    function viewArticleDetail(articleId) {
        $.ajax({
            url: BASE_API_URL + '/zhxt/detail',
            type: 'GET',
            data: { id: articleId },
            success: function(response) {
                if (response.code === 1 || response.code === 200) {
                    showArticleDetailModal(response.data);
                } else {
                    console.error("获取文章详情失败:", response.message);
                    alert("获取文章详情失败");
                }
            },
            error: function(xhr, status, error) {
                console.error("获取文章详情失败:", error);
                alert("获取文章详情失败，请重试");
            }
        });
    }

    // 显示文章详情模态框
    function showArticleDetailModal(article) {
        let statusText = '';
        switch(article.status) {
            case 'published':
            case 'approved':
            case 1:
                statusText = '已发布';
                break;
            case 'pending':
            case 0:
                statusText = '待审核';
                break;
            case 'rejected':
            case 2:
                statusText = '已拒绝';
                break;
            default:
                statusText = '未知';
        }

        const modalContent = `
            <div class="article-detail">
                <h2>${article.title}</h2>
                <div class="article-meta">
                    <span>作者: ${article.author || '未知'}</span>
                    <span>分类: ${getCategoryName(article.category_id)}</span>
                    <span>发布时间: ${article.create_time ? formatApiTime(article.create_time) : '-'}</span>
                    <span>状态: ${statusText}</span>
                </div>
                <div class="article-content">
                    ${article.content}
                </div>
                
                <h3 class="comments-title">评论列表</h3>
                <div class="comments-container" id="commentsContainer">
                    <div class="loading-spinner">加载评论中...</div>
                </div>
            </div>
        `;

        window.adminUtils.showModal('文章详情', modalContent);

        // 加载文章评论
        loadArticleComments(article.id || article.article_id);
    }

    // 加载文章评论
    function loadArticleComments(articleId) {
        const requestData = {
            articleId: parseInt(articleId),
            page: 1,
            pageSize: 50
        };

        $.ajax({
            url: BASE_API_URL + '/zhxt/comments',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function(response) {
                if (response.code === 200 || response.code === 1) {
                    renderComments(response.data.records || []);
                } else {
                    console.error("加载评论失败:", response.message);
                    $('#commentsContainer').html('<div class="error-message">加载评论失败</div>');
                }
            },
            error: function(xhr, status, error) {
                console.error("加载评论失败:", error);
                $('#commentsContainer').html('<div class="error-message">加载评论失败，请重试</div>');
            }
        });
    }

    // 渲染评论列表
    function renderComments(comments) {
        const container = $('#commentsContainer');
        container.empty();

        if (!comments || comments.length === 0) {
            container.html('<div class="no-comments">暂无评论</div>');
            return;
        }

        let commentsHtml = '<ul class="comments-list">';

        comments.forEach(function(comment) {
            // 处理评论时间，可能是数组或字符串格式
            let commentTime = '-';
            if (comment.createTime) {
                if (Array.isArray(comment.createTime)) {
                    commentTime = formatApiTime(comment.createTime);
                } else {
                    commentTime = window.formatDate(comment.createTime);
                }
            }

            commentsHtml += `
                <li class="comment-item" data-id="${comment.id}">
                    <div class="comment-meta">
                        <span class="comment-author">用户ID: ${comment.userId}</span>
                        <span class="comment-time">${commentTime}</span>
                    </div>
                    <div class="comment-content">${comment.content}</div>
                    <div class="comment-actions">
                        <button class="btn btn-danger btn-sm delete-comment-btn" data-id="${comment.id}">删除评论</button>
                    </div>
                </li>
            `;
        });

        commentsHtml += '</ul>';
        container.html(commentsHtml);

        // 绑定删除评论按钮事件
        $('.delete-comment-btn').on('click', function() {
            const commentId = $(this).data('id');
            confirmDeleteComment(commentId);
        });
    }

    // 确认删除评论
    function confirmDeleteComment(commentId) {
        window.confirmAction('确定要删除该评论吗？此操作不可撤销。', function() {
            deleteComment(commentId);
        });
    }

    // 删除评论
    function deleteComment(commentId) {
        $.ajax({
            url: BASE_API_URL + '/admin/deleteArticleComment',
            type: 'DELETE',
            data: { id: commentId },
            success: function(response) {
                alert('评论已删除');
                // 从DOM中移除该评论
                $(`.comment-item[data-id="${commentId}"]`).fadeOut(300, function() {
                    $(this).remove();

                    // 检查是否还有评论
                    if ($('.comment-item').length === 0) {
                        $('#commentsContainer').html('<div class="no-comments">暂无评论</div>');
                    }
                });
            },
            error: function(xhr, status, error) {
                console.error("删除评论失败:", error);
                alert("删除评论失败，请重试");
            }
        });
    }

    // 显示审核文章模态框
    function showReviewArticleModal(articleId) {
        const modalContent = `
            <form id="reviewArticleForm">
                <div class="form-group">
                    <label for="reviewStatus">审核状态:</label>
                    <select id="reviewStatus" name="status" required>
                        <option value="1">通过</option>
                        <option value="0">拒绝</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="reviewMessage">审核意见:</label>
                    <textarea id="reviewMessage" name="review_message" required></textarea>
                </div>
                <div class="form-group">
                    <input type="hidden" name="article_id" value="${articleId}">
                    <button type="submit" class="btn btn-primary">提交审核</button>
                </div>
            </form>
        `;

        window.adminUtils.showModal('审核文章', modalContent);

        // 绑定表单提交事件
        $('#reviewArticleForm').on('submit', function(e) {
            e.preventDefault();

            const formData = {
                article_id: parseInt(articleId),
                status: parseInt($('#reviewStatus').val()),
                review_message: $('#reviewMessage').val()
            };

            reviewArticle(formData);
        });
    }

    // 审核文章
    function reviewArticle(data) {
        $.ajax({
            url: BASE_API_URL + '/zhxt/review',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                window.adminUtils.closeModal();
                alert('文章审核已提交');
                loadArticlesList(); // 重新加载文章列表
            },
            error: function(xhr, status, error) {
                console.error("审核提交失败:", error);
                alert("审核提交失败，请重试");
            }
        });
    }

    // 确认删除文章
    function confirmDeleteArticle(articleId) {
        window.confirmAction('确定要删除该文章吗？此操作不可撤销。', function() {
            deleteArticle(articleId);
        });
    }

    // 删除文章
    function deleteArticle(articleId) {
        const id = parseInt(articleId);
        $.ajax({
            url: BASE_API_URL + '/zhxt/deleteArticle?articleId=' + id,
            type: 'DELETE',
            success: function(response) {
                alert('文章已删除');
                loadArticlesList(); // 重新加载文章列表
            },
            error: function(xhr, status, error) {
                console.error("删除文章失败:", error);
                alert("删除文章失败，请重试");
            }
        });
    }

    // 渲染分页控件
    function renderPagination(total) {
        const totalPages = Math.ceil(total / pageSize);
        const pagination = $('#articlePagination');
        pagination.empty();

        if (totalPages <= 1) {
            return;
        }

        // 添加上一页按钮
        if (currentPage > 1) {
            pagination.append(`<button data-page="${currentPage - 1}">&laquo; 上一页</button>`);
        }

        // 计算显示的页码范围
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        // 添加页码按钮
        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            pagination.append(`<button data-page="${i}" class="${activeClass}">${i}</button>`);
        }

        // 添加下一页按钮
        if (currentPage < totalPages) {
            pagination.append(`<button data-page="${currentPage + 1}">下一页 &raquo;</button>`);
        }

        // 绑定分页按钮点击事件
        pagination.find('button').on('click', function() {
            currentPage = parseInt($(this).data('page'));
            loadArticlesList();
        });
    }
}); 