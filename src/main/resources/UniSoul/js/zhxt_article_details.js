$(document).ready(function() {
    // 检查登录状态
    // if (!localStorage.getItem('token')) {
    //     window.location.href = 'login.html';
    //     return;
    // }

    let commentPage = 1;
    const commentPageSize = 10;
    let totalCommentPages = 0;
    let currentReplyTo = null; // 当前回复的评论ID

    // 获取 URL 参数中的文章 ID
    function getArticleIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id'); // 假设 URL 格式为 ?id=123
    }

    // 显示错误信息
    function showError(field, message) {
        const $field = $(`#${field}`);
        $field.addClass('is-invalid')
            .siblings('.invalid-feedback')
            .text(message)
            .show();
    }

    // 清除错误信息
    function clearError(field) {
        const $field = $(`#${field}`);
        $field.removeClass('is-invalid')
            .siblings('.invalid-feedback')
            .hide();
    }

    // 加载文章详情
    function loadArticleDetail() {
        const articleId = getArticleIdFromUrl();
        if (!articleId) {
            alert('文章不存在');
            window.location.href = 'articles.html';
            return;
        }

        article.getArticleDetail(articleId)
            .then(response => {
                if (response.code === 1) {
                    const data = response.data;

                    // 更新文章内容
                    $('.article-title').text(data.title);
                    $('.article-author').text(data.author);
                    $('.article-time').text(new Date(data.createTime).toLocaleDateString());
                    $('.article-content').html(data.content);

                    // 更新交互按钮状态
                    if (data.liked) {
                        $('.btn-like').addClass('active');
                    }
                    if (data.favorited) {
                        $('.btn-favorite').addClass('active');
                    }

                    // 加载评论列表
                    loadComments(1);
                }
            })
            .catch(error => {
                console.error('加载文章失败:', error);
                alert('加载文章失败，请重试');
            });
    }

    //加载作者信息
    function author_info() {
        const articleId = getArticleIdFromUrl();
        if (!articleId) {
            alert('文章不存在');
            window.location.href = 'articles.html';
            return;
        }

        article.getAuthor_info(articleId)
            .then(response => {
                if (response.code === 1) {
                    const data = response.data;
                    // 更新作者信息内容
                    $('.author-name').text(data.name);
                    $('.author-bio').text(data.biography);
                    $('.author-avatar').attr('src', data.avatarUrl);
                    $('#btn-follow').data('username', data.username);
                }
            })
            .catch(error => {
                console.error('加载作者信息失败:', error);
                alert('加载作者信息失败，请重试');
            });
    }



    // 加载评论列表
    function loadComments(page = 1) {
        const articleId = getArticleIdFromUrl();

        article.comments.getList(articleId, page, commentPageSize)
            .then(response => {
                if (response.code === 200) {
                    const commentList = $('.comment-list');
                    if (page === 1) {
                        commentList.empty();
                    }

                    const comments = response.data.list || [];

                    if (comments.length === 0) {
                        commentList.html('<div class="text-center text-muted">暂无评论</div>');
                        return;
                    }

                    comments.forEach(comment => {
                        const commentHtml = `
                            <div class="comment-item" data-id="${comment.id}">
                                <div class="comment-header">
                                    <div class="user-info">
                                        <img src="${comment.avatar || '../image/default-avatar.png'}" 
                                             class="avatar-sm" alt="头像">
                                        <span class="user-name">${comment.username}</span>
                                    </div>
                                    <span class="comment-time">
                                        ${new Date(comment.createTime).toLocaleString()}
                                    </span>
                                </div>
                                <div class="comment-content">${comment.content}</div>
                                <div class="comment-actions">
                                    <button class="btn btn-like" title="点赞">
                                        <i class="far fa-heart"></i>
                                        <span class="like-count">${comment.likeCount || 0}</span>
                                    </button>
                                    <button class="btn btn-reply" title="回复">
                                        <i class="far fa-comment"></i> 回复
                                    </button>
                                </div>
                            </div>
                        `;
                        commentList.append(commentHtml);
                    });

                    // 更新分页信息
                    totalCommentPages = Math.ceil(response.data.total / commentPageSize);
                    updateCommentPagination(page);

                    // 加载点赞状态
                    const commentIds = comments.map(comment => comment.id);
                    loadCommentLikeStatus(commentIds);
                }
            })
            .catch(error => {
                console.error('加载评论失败:', error);
            });
    }

    // 更新评论分页
    function updateCommentPagination(currentPage) {
        const pagination = $('.comment-pagination');
        pagination.empty();

        if (totalCommentPages <= 1) {
            return;
        }

        let paginationHtml = `
            <button class="btn btn-outline-primary ${currentPage === 1 ? 'disabled' : ''}" 
                    data-page="${currentPage - 1}">上一页</button>
            <span class="mx-3">第 ${currentPage} 页 / 共 ${totalCommentPages} 页</span>
            <button class="btn btn-outline-primary ${currentPage === totalCommentPages ? 'disabled' : ''}" 
                    data-page="${currentPage + 1}">下一页</button>
        `;
        pagination.html(paginationHtml);
    }

    // 加载评论的点赞状态
    function loadCommentLikeStatus(commentIds) {
        if (!commentIds.length) return;

        Promise.all(commentIds.map(id => article.comments.getLikeStatus(id)))
            .then(responses => {
                responses.forEach((response, index) => {
                    if (response.code === 200 && response.data.liked) {
                        const commentId = commentIds[index];
                        const $btn = $(`.comment-item[data-id="${commentId}"] .btn-like`);
                        $btn.addClass('active')
                            .find('i')
                            .removeClass('far')
                            .addClass('fas');
                    }
                });
            })
            .catch(error => {
                console.error('加载点赞状态失败:', error);
            });
    }

    // 发表评论
    $('#commentForm').submit(function(e) {
        e.preventDefault();
        const content = $('#commentContent').val().trim();
        const articleId = getArticleIdFromUrl();

        if (!content) {
            showError('commentContent', '请输入评论内容');
            return;
        }

        const $submitBtn = $(this).find('button[type="submit"]');
        const originalText = $submitBtn.text();
        $submitBtn.prop('disabled', true).text('发表中...');

        article.comments.add(articleId, content)
            .then(response => {
                if (response.code === 200) {
                    $('#commentContent').val('');
                    loadComments(1);
                    alert('评论发表成功！');
                } else {
                    showError('commentContent', response.message);
                }
            })
            .catch(error => {
                showError('commentContent', '评论发表失败，请重试');
            })
            .finally(() => {
                $submitBtn.prop('disabled', false).text(originalText);
            });
    });

    // 点击回复按钮
    $(document).on('click', '.btn-reply', function() {
        const $comment = $(this).closest('.comment-item');
        const commentId = $comment.data('id');
        const commentContent = $comment.find('.comment-content').text();
        const userName = $comment.find('.user-name').text();

        // 设置模态框内容
        $('#replyModal .original-comment').html(`
            <div class="text-muted">回复 ${userName} 的评论：</div>
            <div class="mt-2">${commentContent}</div>
        `);

        currentReplyTo = commentId;
        $('#replyModal').modal('show');
    });

    // 提交回复
    $('#submitReply').click(function() {
        const content = $('#replyContent').val().trim();
        const articleId = getArticleIdFromUrl();

        if (!content) {
            showError('replyContent', '请输入回复内容');
            return;
        }

        const $btn = $(this);
        const originalText = $btn.text();
        $btn.prop('disabled', true).text('回复中...');

        article.comments.reply(articleId, currentReplyTo, content)
            .then(response => {
                if (response.code === 200) {
                    $('#replyModal').modal('hide');
                    loadComments(1);
                } else {
                    showError('replyContent', response.message);
                }
            })
            .catch(error => {
                showError('replyContent', '回复失败，请重试');
            })
            .finally(() => {
                $btn.prop('disabled', false).text(originalText);
            });
    });

    // 点赞评论
    $(document).on('click', '.btn-like', function() {
        const $btn = $(this);
        const commentId = $btn.closest('.comment-item').data('id');

        // 防止重复点击
        if ($btn.prop('disabled')) return;
        $btn.prop('disabled', true);

        article.comments.like(commentId)
            .then(response => {
                if (response.code === 200) {
                    const $icon = $btn.find('i');
                    const $count = $btn.find('.like-count');
                    const currentCount = parseInt($count.text());

                    // 更新点赞状态和数量
                    $btn.toggleClass('active');
                    $icon.toggleClass('far fas');

                    // 添加动画效果
                    $btn.addClass('animating');
                    setTimeout(() => $btn.removeClass('animating'), 300);

                    // 更新点赞数
                    $count.text($btn.hasClass('active') ? currentCount + 1 : currentCount - 1);
                }
            })
            .catch(error => {
                console.error('点赞失败:', error);
            })
            .finally(() => {
                $btn.prop('disabled', false);
            });
    });

    // 文章点赞
    $('.article-action .btn-like').click(function() {
        const $btn = $(this);
        const articleId = getArticleIdFromUrl();

        if ($btn.prop('disabled')) return;
        $btn.prop('disabled', true);

        const action = $btn.hasClass('active') ? 'unlike' : 'like';
        article.action[action](articleId)
            .then(response => {
                if (response.code === 200) {
                    $btn.toggleClass('active');

                    // 添加动画效果
                    $btn.addClass('animating');
                    setTimeout(() => $btn.removeClass('animating'), 300);
                }
            })
            .catch(error => {
                console.error('操作失败:', error);
            })
            .finally(() => {
                $btn.prop('disabled', false);
            });
    });

    // 文章收藏
    $('.article-action .btn-favorite').click(function() {
        const $btn = $(this);
        const articleId = getArticleIdFromUrl();

        if ($btn.prop('disabled')) return;
        $btn.prop('disabled', true);

        const action = $btn.hasClass('active') ? 'unfavorite' : 'favorite';
        article.action[action](articleId)
            .then(response => {
                if (response.code === 200) {
                    $btn.toggleClass('active');
                }
            })
            .catch(error => {
                console.error('操作失败:', error);
            })
            .finally(() => {
                $btn.prop('disabled', false);
            });
    });

    // 分页点击事件
    $(document).on('click', '.comment-pagination button:not(.disabled)', function() {
        const page = $(this).data('page');
        if (page) {
            commentPage = page;
            loadComments(page);
            // 滚动到评论区
            $('.comment-section')[0].scrollIntoView({ behavior: 'smooth' });
        }
    });

    // 评论框输入事件
    $('#commentContent').on('input', function() {
        clearError('commentContent');
    });

    // 回复框输入事件
    $('#replyContent').on('input', function() {
        clearError('replyContent');
    });

    // 模态框关闭时重置表单
    $('#replyModal').on('hidden.bs.modal', function() {
        $('#replyForm')[0].reset();
        $('#replyContent').removeClass('is-invalid');
        currentReplyTo = null;
    });


        // 绑定点击事件
        $('#btn-follow').click(function () {
            const button = $(this); // 获取当前按钮
            const username = button.data('username'); // 获取用户名
            // alert(username)
            const status = button.data('status'); // 获取当前状态
            // 禁用按钮防止重复点击
            button.prop('disabled', true);

            if (status === 'unfollowed') {
                // 调试：确保 username 不为空
                if (!username) {
                    alert("用户名为空，请检查按钮的 data-username 属性");
                    return;
                }

                xtqh_follow.followUser(username)
                    .then(response => {
                        if (response.code === 1) {
                            // 更新按钮状态为已关注
                            button.data('status', 'followed');
                            button.html('<i class="fas fa-check"></i> 取消关注'); // 更新按钮内容
                            console.log('关注成功:', response.message);
                        } else {
                            alert('关注失败: ' + response.message);
                        }
                    })
                    .catch(error => {
                        console.error('网络请求失败:', error);
                        alert('网络请求失败，请稍后再试');
                    });
            } else if (status === 'followed') {
                // 当前状态为已关注，执行取消关注操作
                xtqh_follow.unfollowUser(username)
                    .then(response => {
                        if (response.code === 1) {
                            // 更新按钮状态为未关注
                            button.data('status', 'unfollowed');
                            button.html('<i class="fas fa-plus"></i> 关注作者'); // 更新按钮内容
                            console.log('取消关注成功:', response.message);
                        } else {
                            alert('取消关注失败: ' + response.message);
                        }
                    })
                    .catch(error => {
                        console.error('网络请求失败:', error);
                        alert('网络请求失败，请稍后再试');
                    })
                    .finally(() => {
                        // 重新启用按钮
                        button.prop('disabled', false);
                    });
            }
        });

    author_info();
    // 初始化加载
    loadArticleDetail();
});