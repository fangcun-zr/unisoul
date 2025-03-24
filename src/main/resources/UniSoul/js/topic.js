$(document).ready(function () {
    // 获取话题ID
    const urlParams = new URLSearchParams(window.location.search);
    const topicId = urlParams.get('id');

    if (!topicId) {
        showError('未找到话题');
        return;
    }

    // 加载话题详情
    loadTopicDetail(topicId);
    // 绑定事件
    bindEvents(topicId);
});

// 加载话题详情
function loadTopicDetail(topicId) {
    // 先加载话题信息
    TopicsAPI.getTopicInformation(topicId)
        .done(function (response) {
            if (response.code === 1) {
                const topic = response.data;
                console.log('话题详情数据:', topic); // 添加调试日志
                renderTopicDetail(topic);
                // 加载评论列表
                loadReplies(topicId);
            } else {
                showError(response.msg || '加载失败');
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.error('加载话题详情失败:', {
                status: textStatus,
                error: errorThrown
            });
            showError('加载话题详情失败');
        });
}

// 加载评论列表
function loadReplies(topicId, offset = 0) {
    TopicsAPI.getReplies(topicId, offset)
        .done(function (response) {
            if (response.code === 1) {
                if (Array.isArray(response.data)) {
                    renderReplies(response.data);
                } else {
                    console.error('评论数据格式错误:', response.data);
                    showError('评论数据格式错误');
                }
            } else {
                console.error('加载评论失败:', response);
                showError(response.msg || '加载评论失败');
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.error('加载评论失败:', {
                status: jqXHR.status,
                statusText: jqXHR.statusText,
                responseText: jqXHR.responseText,
                textStatus: textStatus,
                error: errorThrown
            });

            let errorMessage = '加载评论失败';
            if (jqXHR.status === 500) {
                errorMessage = '服务器内部错误，请稍后重试';
            } else if (jqXHR.status === 404) {
                errorMessage = '未找到评论数据';
            }

            showError(errorMessage);

            // 如果评论加载失败，显示空的评论列表
            renderReplies([]);
        });
}

// 渲染话题详情
function renderTopicDetail(topic) {
    // 设置页面标题
    document.title = `${topic.title} - 心旅坊`;

    // 渲染用户信息
    const avatarUrl = topic.anonymous ? '../image/anonymousPicture.png' : topic.avatarUrl;
    const username = topic.anonymous ? '匿名用户' : topic.username;
    $('.user-avatar').attr('src', avatarUrl).attr('alt', username);
    $('.user-name').text(username);
    $('.post-time').text(formatTime(topic.createTime));

    // 渲染话题内容
    $('.topic-title').text(topic.title);
    $('.topic-text').text(topic.content);

    // 更新浏览量
    const viewCount = topic.views || 0;
    $('.topic-header .views span').text(viewCount);
    $('.topic-footer .view-count').html(`<i class="fas fa-eye"></i> ${viewCount}`);

    // 渲染标签
    const $tags = $('.topic-tags');
    $tags.empty();
    (topic.tags || []).forEach(tag => {
        $tags.append(`<span class="tag">${tag}</span>`);
    });

    // 渲染点赞和评论数
    const $likeBtn = $('.topic-actions .like-btn');
    $likeBtn.data('id', topic.id);

    // 从API响应中获取点赞状态和数量
    const isLiked = topic.like || false;
    const likesCount = topic.likes || 0;  // 使用likes而不是likesCount

    // 更新点赞按钮状态
    $likeBtn.data('liked', isLiked);
    $likeBtn.toggleClass('liked', isLiked);
    $likeBtn.find('i').removeClass('fas far').addClass(isLiked ? 'fas' : 'far');
    $likeBtn.find('span').text(likesCount);

    // 更新评论数
    $('.reply-btn span').text((topic.replies || []).length);
}

// 渲染评论列表
function renderReplies(replies) {
    const $repliesList = $('.replies-list');
    if (replies.length === 0) {
        $repliesList.html('<div class="no-replies">暂无评论</div>');
        $('.replies-count').text('0');
        return;
    }

    $repliesList.empty();
    $('.replies-count').text(replies.length);

    replies.forEach(reply => {
        const isLiked = reply.like || false;
        const isCurrentUser = reply.isSelf || false;
        const avatarUrl = reply.avatarUrl || '../image/anonymousPicture.png';
        const replyHtml = `
            <div class="reply-item" data-id="${reply.id}">
                <div class="reply-header">
                    <div class="user-info">
                        <img src="${avatarUrl}" alt="用户头像" class="user-avatar">
                        <div class="user-meta">
                            <span class="reply-author">${reply.anonymous ? '匿名用户' : reply.username}</span>
                            <span class="reply-time">${formatTime(reply.createTime)}</span>
                        </div>
                    </div>
                </div>
                <div class="reply-content">${reply.content}</div>
                <div class="reply-footer">
                    <div class="reply-actions">
                        <button class="action-btn like-btn ${isLiked ? 'liked' : ''}" data-id="${reply.id}" data-type="reply" data-liked="${isLiked}">
                            <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
                            <span>${reply.likeCount || 0}</span>
                        </button>
                        ${isCurrentUser ? `
                            <button class="action-btn delete-btn" data-id="${reply.id}">
                                <i class="fas fa-trash-alt"></i>
                                <span>删除</span>
                            </button>
                        ` : ''}
                    </div>
                    <span class="reply-datetime">${formatTime(reply.createTime)}</span>
                </div>
            </div>
        `;
        $repliesList.append(replyHtml);
    });
}

// 提交评论
function submitReply(topicId, content, anonymous) {
    // 构造评论数据
    const replyData = {
        topicId: parseInt(topicId), // 确保topicId是整数
        content: content.trim(),
        anonymous: anonymous
    };

    // 验证数据
    if (!replyData.content) {
        ELEMENT.Message.warning('请输入评论内容');
        return Promise.reject('评论内容为空');
    }

    if (!replyData.topicId || isNaN(replyData.topicId)) {
        console.error('无效的话题ID:', topicId);
        showError('无效的话题ID');
        return Promise.reject('无效的话题ID');
    }

    return TopicsAPI.replyTopic(replyData)
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.error('评论提交失败:', {
                status: jqXHR.status,
                statusText: jqXHR.statusText,
                responseText: jqXHR.responseText,
                textStatus: textStatus,
                error: errorThrown,
                requestData: replyData
            });
            throw new Error('评论提交失败');
        });
}

// 绑定事件
function bindEvents(topicId) {
    // 点赞事件
    $(document).on('click', '.like-btn', function () {
        const $btn = $(this);
        const id = $btn.data('id');
        const type = $btn.data('type') || 'topic';
        const isLiked = $btn.data('liked') === true;
        const currentLikeCount = parseInt($btn.find('span').text()) || 0;

        // 立即更新UI，给用户即时反馈
        const newLikeState = !isLiked;
        const newLikeCount = newLikeState ? currentLikeCount + 1 : currentLikeCount - 1;
        updateLikeButtonUI($btn, newLikeState, newLikeCount);

        // 根据类型选择不同的点赞接口
        const likePromise = type === 'reply'
            ? $.ajax({
                url: `${API_BASE_URL}/topic/likeReplies`,
                method: 'GET',
                data: {
                    repliesId: id,
                    isLike: isLiked,  // 直接传递当前的点赞状态
                    likeCount: currentLikeCount,
                    topicId: topicId
                }
            })
            : $.ajax({
                url: `${API_BASE_URL}/topic/likes`,
                method: 'GET',
                data: {
                    topicId: id,
                    isLike: isLiked,  // 直接传递当前的点赞状态
                    likeCount: currentLikeCount
                }
            });

        likePromise
            .done(function (response) {
                if (response.code === 1) {
                    // 使用后端返回的状态更新UI
                    const serverLikeState = response.data.like;
                    const serverLikeCount = response.data.likesCount;
                    updateLikeButtonUI($btn, serverLikeState, serverLikeCount);
                    ELEMENT.Message.success(serverLikeState ? '点赞成功' : '已取消点赞');
                } else {
                    // 如果失败，恢复到原始状态
                    updateLikeButtonUI($btn, isLiked, currentLikeCount);
                    showError(response.msg || '操作失败');
                }
            })
            .fail(function (error) {
                // 如果请求失败，恢复到原始状态
                updateLikeButtonUI($btn, isLiked, currentLikeCount);
                console.error('点赞请求失败:', error);
                showError('网络错误，请重试');
            });
    });

    // 更新点赞按钮UI
    function updateLikeButtonUI($btn, isLiked, likeCount) {
        $btn.data('liked', isLiked);
        $btn.toggleClass('liked', isLiked);
        $btn.find('span').text(likeCount);

        // 更新按钮图标
        const $icon = $btn.find('.fa-heart');
        if (isLiked) {
            $icon.addClass('fas').removeClass('far');
        } else {
            $icon.addClass('far').removeClass('fas');
        }
    }

    // 分享按钮点击事件
    $(document).on('click', '.share-btn', function () {
        // 获取当前页面的完整URL
        const currentUrl = window.location.href;

        // 使用 Clipboard API 复制链接到剪贴板
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                // 显示成功提示
                ELEMENT.Message({
                    message: '链接已复制到剪贴板',
                    type: 'success',
                    duration: 2000
                });
            })
            .catch(err => {
                // 如果 Clipboard API 不可用，使用传统方法
                const textarea = document.createElement('textarea');
                textarea.value = currentUrl;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    ELEMENT.Message({
                        message: '链接已复制到剪贴板',
                        type: 'success',
                        duration: 2000
                    });
                } catch (err) {
                    ELEMENT.Message({
                        message: '复制失败，请手动复制',
                        type: 'error',
                        duration: 2000
                    });
                }
                document.body.removeChild(textarea);
            });
    });

    // 提交评论
    $('.submit-reply').on('click', function () {
        const $submitBtn = $(this);
        const content = $('.reply-form textarea').val().trim();
        const anonymous = $('#anonymousCheckbox').prop('checked');

        // 禁用提交按钮，防止重复提交
        $submitBtn.prop('disabled', true);
        $submitBtn.html('<i class="fas fa-spinner fa-spin"></i> 发送中...');

        submitReply(topicId, content, anonymous)
            .done(function (response) {
                if (response.code === 1) {
                    // 清空输入框
                    $('.reply-form textarea').val('');
                    $('#anonymousCheckbox').prop('checked', false);

                    // 显示成功消息并刷新评论列表
                    ELEMENT.Message({
                        type: 'success',
                        message: '评论发布成功',
                        duration: 1000,
                        onClose: function () {
                            loadReplies(topicId);
                        }
                    });
                } else {
                    showError(response.msg || '评论失败');
                }
            })
            .fail(function (error) {
                showError('评论失败，请重试');
            })
            .always(function () {
                // 恢复提交按钮状态
                $submitBtn.prop('disabled', false);
                $submitBtn.html('<i class="fas fa-paper-plane"></i> 发表评论');
            });
    });

    // 标签点击
    $(document).on('click', '.tag', function () {
        const tag = $(this).text();
        window.location.href = `../html/topics.html?tag=${encodeURIComponent(tag)}`;
    });

    // 加载更多评论
    $(document).on('click', '.load-more-btn', function () {
        const $btn = $(this);
        if ($btn.hasClass('loading')) return;

        $btn.addClass('loading').html('<i class="fas fa-spinner fa-spin"></i> 加载中...');

        // 获取当前评论数量
        const currentCount = $('.replies-list .reply-item').length;

        // 调用API获取更多评论
        TopicsAPI.getReplies(topicId, currentCount)
            .done(function (response) {
                if (response.code === 1 && response.data.length > 0) {
                    // 渲染新评论
                    response.data.forEach(reply => {
                        const isLiked = reply.like || false;
                        const isCurrentUser = reply.username === currentUser.username;
                        const replyHtml = `
                            <div class="reply-item" data-id="${reply.id}">
                                <div class="reply-header">
                                    <span class="reply-author">${reply.anonymous ? '匿名用户' : reply.username}</span>
                                    <span class="reply-time">${formatTime(reply.createTime)}</span>
                                </div>
                                <div class="reply-content">${reply.content}</div>
                                <div class="reply-footer">
                                    <div class="reply-actions">
                                        <button class="action-btn like-btn ${isLiked ? 'liked' : ''}" data-id="${reply.id}" data-type="reply" data-liked="${isLiked}">
                                            <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
                                            <span>${reply.likeCount || 0}</span>
                                        </button>
                                        ${isCurrentUser ? `
                                            <button class="action-btn delete-btn" data-id="${reply.id}">
                                                <i class="fas fa-trash-alt"></i>
                                                <span>删除</span>
                                            </button>
                                        ` : ''}
                                    </div>
                                    <span class="reply-datetime">${reply.createTime}</span>
                                </div>
                            </div>
                        `;
                        $('.replies-list').append(replyHtml);
                    });

                    // 更新评论总数
                    const newCount = $('.replies-list .reply-item').length;
                    $('.replies-count').text(newCount);

                    // 如果没有更多评论，移除加载更多按钮
                    if (response.data.length < 10) {
                        $btn.remove();
                    }
                } else {
                    // 没有更多评论
                    $btn.remove();
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.error('加载更多评论失败:', {
                    status: textStatus,
                    error: errorThrown
                });
                showError('加载更多评论失败');
            })
            .always(function () {
                $btn.removeClass('loading').html('<i class="fas fa-chevron-down"></i> 加载更多评论');
            });
    });

    // 删除评论事件
    $(document).on('click', '.delete-btn', function () {
        const $btn = $(this);
        const replyId = $btn.data('id');

        // 创建遮罩层和确认对话框
        const $overlay = $('<div class="dialog-overlay"></div>');
        const $dialog = $(`
            <div class="delete-confirm-dialog">
                <h3>确认删除</h3>
                <p>确定要删除这条评论吗？此操作不可恢复。</p>
                <div class="dialog-buttons">
                    <button class="cancel-btn">取消</button>
                    <button class="confirm-btn">确认删除</button>
                </div>
            </div>
        `);

        // 添加到页面
        $('body').append($overlay).append($dialog);

        // 绑定取消按钮事件
        $dialog.find('.cancel-btn').on('click', function () {
            $overlay.remove();
            $dialog.remove();
        });

        // 绑定确认按钮事件
        $dialog.find('.confirm-btn').on('click', function () {
            // 调用删除API
            $.ajax({
                url: `${API_BASE_URL}/topic/deleteReplies`,
                method: 'GET',
                data: { repliesId: replyId }
            })
                .done(function (response) {
                    if (response.code === 1) {
                        // 删除成功，移除评论元素
                        $(`.reply-item[data-id="${replyId}"]`).fadeOut(300, function () {
                            $(this).remove();
                            // 更新评论数量
                            const newCount = $('.replies-list .reply-item').length;
                            $('.replies-count').text(newCount);
                        });

                        ELEMENT.Message.success('评论已删除');
                    } else {
                        showError(response.msg || '删除失败');
                    }
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    console.error('删除评论失败:', {
                        status: textStatus,
                        error: errorThrown,
                        replyId: replyId
                    });
                    showError('网络错误，请重试');
                })
                .always(function () {
                    // 移除对话框和遮罩
                    $overlay.remove();
                    $dialog.remove();
                });
        });
    });
}

// 显示错误信息
function showError(message) {
    ELEMENT.Message.error({
        message: message,
        duration: 3000
    });
}

// 格式化时间
function formatTime(timestamp) {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
    const year = 12 * month;

    if (diff < minute) {
        return '刚刚';
    } else if (diff < hour) {
        return `${Math.floor(diff / minute)}分钟前`;
    } else if (diff < day) {
        return `${Math.floor(diff / hour)}小时前`;
    } else if (diff < month) {
        return `${Math.floor(diff / day)}天前`;
    } else if (diff < year) {
        return `${Math.floor(diff / month)}个月前`;
    } else {
        return `${Math.floor(diff / year)}年前`;
    }
}