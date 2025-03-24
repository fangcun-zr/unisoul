$(document).ready(function() {
    // Global variables
    let commentPage = 1;
    const commentPageSize = 10;
    let totalCommentPages = 0;
    let currentReplyTo = null; // 当前回复的评论ID
    let commentsLoaded = false; // 跟踪评论是否已加载

    // 从URL获取文章ID并设置到隐藏字段
    const articleId = getArticleIdFromUrl();
    $('#article-id').val(articleId);
    console.log('从URL获取文章ID:', articleId);

    const followButton = $('#btn-follow');

    // 立即进行API请求测试
    testAPI();

    // 初始化加载
    loadArticleDetail();
    author_info();

    // 检查关注状态
    checkFollowStatus(articleId);

    // 确保在页面加载完成后加载评论，同时确保参数正确传递
    console.log('正在初始化加载评论，文章ID:', articleId);

    // 立即尝试加载评论
    loadComments(1, commentPageSize);

    // 500ms后再次尝试加载评论（如果第一次没成功）
    setTimeout(() => {
        if (!commentsLoaded) {
            console.log('第一次评论加载可能失败，正在重试...');
            loadComments(1, commentPageSize);
        }
    }, 500);

    // 1500ms后最后尝试加载（作为保险措施）
    setTimeout(() => {
        if (!commentsLoaded) {
            console.log('多次评论加载失败，最后尝试...');
            // 使用直接AJAX调用尝试加载评论
            directLoadComments();
        }
    }, 1500);

    // 事件绑定
    initEventListeners();

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
                    $('.article-author').text(data.author || '');

                    // 格式化日期显示 - 处理数组格式的日期
                    let formattedDate = '';
                    const dateData = data.create_time || data.createTime;
                    console.log('文章日期原始值:', dateData);

                    try {
                        if (Array.isArray(dateData) && dateData.length >= 6) {
                            // 数组格式：[年, 月, 日, 时, 分, 秒]
                            const [year, month, day, hour, minute, second] = dateData;
                            formattedDate = `${year}年${month}月${day}日 ${hour}:${minute.toString().padStart(2, '0')}`;
                        } else if (dateData) {
                            // 字符串格式或其他格式，使用Date对象
                            const date = new Date(dateData);
                            if (!isNaN(date.getTime())) {
                                formattedDate = date.toLocaleDateString();
                            } else {
                                formattedDate = '日期格式错误';
                                console.error('无效日期:', dateData);
                            }
                        } else {
                            formattedDate = '无日期信息';
                        }
                    } catch (e) {
                        console.error('日期解析错误:', e);
                        formattedDate = '日期格式错误';
                    }

                    $('.article-time').text(formattedDate);
                    $('.article-content').html(data.content);
                    //likeCount
                    $('.like-count').text(data.like_count || data.likeCount || 0);
                    //存储点赞数
                    localStorage.setItem('likeCount', data.like_count || data.likeCount || 0);
                    //收藏数
                    $('.favorite-count').text(data.favoriteCount || 0);
                    //存储收藏数
                    localStorage.setItem('favoriteCount', data.favoriteCount || 0);

                    //根据点赞情况渲染点赞按钮的样式
                    //发送请求获取点赞状态
                    article.getLikesStatus(articleId)
                        .then(response => {
                            if (response.code === 1) {
                                const data = response.data;
                                // 更新点赞状态
                                if (data === 1) {
                                    //已经点赞，将按钮渲染成红色
                                    $('.btn-like').addClass('active');
                                    //将已点赞的信息存储
                                    localStorage.setItem('liked', 'true');
                                } else {
                                    //未点赞，将按钮渲染成灰色
                                    $('.btn-like').removeClass('active');
                                    //将未点赞的信息存储
                                    localStorage.setItem('liked', 'false');
                                }
                            }
                        })
                        .catch(error => {
                            console.error('获取点赞状态失败:', error);
                        });

                    // 根据收藏状态渲染收藏按钮的样式
                    article.getFavoritesStatus(articleId)
                        .then(response => {
                            if (response.code === 1) {
                                const data = response.data;
                                // 更新收藏状态
                                if (data === 1) {
                                    //已经收藏，将按钮渲染成黄色
                                    $('.btn-favorite').addClass('active');
                                    //将已收藏的信息存储
                                    localStorage.setItem('favorited', 'true');
                                } else {
                                    //未收藏，将按钮渲染成灰色
                                    $('.btn-favorite').removeClass('active');
                                    //将未收藏的信息存储
                                    localStorage.setItem('favorited', 'false');
                                }
                            }
                        })
                        .catch(error => {
                            console.error('获取收藏状态失败:', error);
                        });
                }
            })
            .catch(error => {
                console.error('加载文章失败:', error);
                alert('加载文章失败，请重试');
            });
    }

    //加载作者信息
    function author_info() {
        if (!articleId) {
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
            });
    }

    // 显示通知消息
    function showToast(message, type = 'success') {
        // 移除现有的通知
        $('.toast').remove();

        // 创建新的通知元素
        const toast = $(`<div class="toast ${type}">${message}</div>`);
        $('body').append(toast);

        // 显示通知
        setTimeout(() => {
            toast.addClass('show');

            // 3秒后自动隐藏
            setTimeout(() => {
                toast.removeClass('show');
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, 3000);
        }, 10);
    }

    // 加载评论
    function loadComments(page = 1, pageSize = 10) {
        console.log(`加载评论, 文章ID: ${articleId}, 页码: ${page}, 每页数量: ${pageSize}`);

        if (!articleId) {
            console.error('文章ID不存在，无法加载评论');
            $('.comment-list').html('<div class="alert alert-danger">评论加载失败，文章ID不存在</div>');
            return;
        }

        // 显示加载状态
        $('.comment-list').html('<div class="text-center py-4"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">加载评论中... (文章ID: ' + articleId + ')</p></div>');

        // 直接输出请求参数以便调试
        const requestData = {
            articleId: articleId,
            page: page,
            pageSize: pageSize
        };
        console.log('评论请求参数:', requestData);

        zhxtArticlesAPI.getList(articleId, page, pageSize)
            .then(response => {
                console.log('评论API响应:', response);
                handleCommentsResponse(response, page, pageSize);
            })
            .catch(error => {
                console.error('加载评论异常:', error);
                $('.comment-list').html('<div class="alert alert-danger">评论加载失败，请稍后重试</div>');
            });
    }

    function handleCommentsResponse(response, page, pageSize) {
        commentsLoaded = true;
        const isSuccess = response.code === 1 || response.code === 200;

        if (isSuccess) {
            let comments = [];
            let total = 0;

            if (response.data) {
                // 提取评论列表和总数
                if (Array.isArray(response.data.comments)) {
                    comments = response.data.comments;
                    total = response.data.total || comments.length;
                } else if (Array.isArray(response.data.records)) {
                    comments = response.data.records;
                    total = response.data.total || comments.length;
                } else if (Array.isArray(response.data)) {
                    comments = response.data;
                    total = comments.length; // 若无总数则使用当前条数
                } else {
                    console.warn('未找到评论数据或格式异常:', response);
                }
            }

            if (comments.length === 0) {
                $('.comment-list').html('<div class="alert alert-light text-center">暂无评论，来发表第一条评论吧！</div>');
                updatePagination(1, 1); // 重置分页
                return;
            }

            // 生成评论HTML
            let commentHTML = comments.map((comment, index) => {
                // 安全地格式化日期
                let formattedDate = '';
                try {
                    // 尝试解析日期，提供多种可能的字段名
                    const dateData = comment.create_time || comment.createTime || '';
                    console.log('评论日期原始值:', dateData);

                    // 如果日期是数组格式
                    if (Array.isArray(dateData) && dateData.length >= 6) {
                        // 数组格式：[年, 月, 日, 时, 分, 秒]
                        const [year, month, day, hour, minute, second] = dateData;
                        formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    } else if (typeof dateData === 'string') {
                        // 如果是字符串格式，使用原有的解析逻辑
                        const date = new Date(dateData);
                        if (!isNaN(date.getTime())) {
                            formattedDate = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                        } else {
                            formattedDate = '日期格式错误';
                            console.error('无效日期:', dateData);
                        }
                    } else {
                        formattedDate = '无日期信息';
                    }
                } catch (e) {
                    console.error('日期解析错误:', e);
                    formattedDate = '日期解析错误';
                }

                // 获取评论用户信息
                const userName = comment.userName || comment.nickname || comment.name || '匿名用户';
                const userAvatar = comment.avatarUrl || comment.avatar || './images/default-avatar.png';

                return `
                <div class="comment-item ${index % 2 ? 'bg-light-gray' : 'bg-white'}" data-id="${comment.id}">
                    <div class="comment-header d-flex align-items-start">
                        <div class="avatar-sm me-3" style="width: 40px; height: 40px; flex-shrink: 0;">
                            <img src="${userAvatar}" alt="${userName}" class="rounded-circle img-fluid" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div class="comment-info flex-grow-1">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5 class="mb-1" style="font-size: 1rem;">${userName}</h5>
                                <small class="text-muted">${formattedDate}</small>
                            </div>
                            <p class="mb-2">${comment.content || ''}</p>
                        </div>
                    </div>
                </div>
            `;
            }).join('');

            $('.comment-list').html(commentHTML);
            updatePagination(page, Math.ceil(total / pageSize)); // 使用总数计算分页

        } else {
            console.error('加载评论失败:', response);
            $('.comment-list').html(`<div class="alert alert-danger">评论加载失败，请稍后重试 (错误码: ${response.code})</div>`);
        }
    }

    // 更新分页
    function updatePagination(currentPage, totalPages) {
        const pagination = $('.comment-pagination');

        // 如果总页数小于等于1，隐藏分页
        if (totalPages <= 1) {
            pagination.hide();
            return;
        }

        // 显示分页
        pagination.show();

        // 清空分页
        pagination.empty();

        // 上一页按钮
        const prevBtn = $(`<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" aria-label="Previous" data-page="${currentPage - 1}">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>`);
        pagination.append(prevBtn);

        // 页码按钮
        const maxVisiblePages = 5;
        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        for (let i = startPage; i <= endPage; i++) {
            const pageItem = $(`<li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>`);
            pagination.append(pageItem);
        }

        // 下一页按钮
        const nextBtn = $(`<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" aria-label="Next" data-page="${currentPage + 1}">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>`);
        pagination.append(nextBtn);

        // 绑定分页事件
        pagination.find('.page-link').on('click', function(e) {
            e.preventDefault();

            const page = $(this).data('page');
            if (page < 1 || page > totalPages || page === currentPage) {
                return;
            }

            loadComments(page);

            // 滚动到评论区顶部
            $('html, body').animate({
                scrollTop: $('.comment-section').offset().top - 100
            }, 300);
        });
    }

    // 绑定评论相关事件
    function bindCommentEvents() {
        // 评论点赞事件
        $('.comment-item .btn-like').on('click', function() {
            const commentId = $(this).data('id');
            likeComment(commentId, $(this));
        });

        // 评论回复事件
        $('.comment-item .btn-reply').on('click', function() {
            const commentId = $(this).data('id');
            const commentUser = $(this).closest('.comment-item').find('.user-name').text();
            showReplyForm(commentId, commentUser);
        });
    }

    // 点赞评论
    function likeComment(commentId, $button) {
        article.comments.like(commentId)
            .then(response => {
                if (response.code === 1) {
                    const currentLikes = parseInt($button.find('.like-count').text());
                    const isActive = $button.hasClass('active');

                    if (isActive) {
                        $button.removeClass('active');
                        $button.find('.like-count').text(Math.max(0, currentLikes - 1));
                    } else {
                        $button.addClass('active');
                        $button.find('.like-count').text(currentLikes + 1);
                    }
                }
            })
            .catch(error => {
                console.error('评论点赞失败:', error);
            });
    }

    // 显示回复表单
    function showReplyForm(commentId, username) {
        currentReplyTo = commentId;

        // 如果已经存在回复框，先移除
        $('.reply-form').remove();

        const replyFormHtml = `
            <div class="reply-form mt-2 mb-3 ms-4">
                <div class="d-flex">
                    <div class="reply-avatar me-2">
                        <img src="../image/default-avatar.png" class="avatar-xs rounded-circle" alt="我的头像">
                    </div>
                    <div class="flex-grow-1">
                        <div class="form-floating mb-2">
                            <textarea class="form-control" placeholder="回复 @${username}" style="height: 70px"></textarea>
                            <label><i class="far fa-comment me-1"></i>回复 @${username}</label>
                        </div>
                        <div class="d-flex justify-content-end">
                            <button class="btn btn-sm btn-secondary me-2 cancel-reply">取消</button>
                            <button class="btn btn-sm btn-primary submit-reply">提交回复</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $(`.comment-item[data-id="${commentId}"]`).append(replyFormHtml);

        // 绑定回复事件
        $('.submit-reply').on('click', function() {
            const content = $(this).closest('.reply-form').find('textarea').val().trim();
            if (content) {
                submitReply(currentReplyTo, content);
            } else {
                // 简单的表单验证
                $(this).closest('.reply-form').find('textarea').addClass('is-invalid');
                setTimeout(() => {
                    $(this).closest('.reply-form').find('textarea').removeClass('is-invalid');
                }, 2000);
            }
        });

        $('.cancel-reply').on('click', function() {
            $('.reply-form').remove();
            currentReplyTo = null;
        });

        // 自动聚焦到回复框
        $('.reply-form textarea').focus();
    }

    // 提交回复
    function submitReply(commentId, content) {
        console.log('提交回复:', commentId, content);

        article.comments.reply(commentId, content)
            .then(response => {
                console.log('回复响应:', response);

                if (response.code === 1 || response.code === 200) {
                    $('.reply-form').remove();
                    currentReplyTo = null;

                    // 重新加载评论
                    loadComments(commentPage);

                    // 成功提示
                    alert('回复成功！');
                } else {
                    console.error('回复评论失败:', response.msg || '未知错误');
                    alert('回复失败: ' + (response.msg || '请稍后重试'));
                }
            })
            .catch(error => {
                console.error('回复提交请求失败:', error);
                alert('回复提交失败，请稍后重试');
            });
    }

    // 文章点赞
    function handleLike() {
        //获取点赞状态
        var isLiked = localStorage.getItem('liked') === 'true';
        var likesCount = parseInt(localStorage.getItem('likeCount') || '0');

        //发送请求至后端
        article.like(articleId, likesCount, !isLiked)
            .then(response => {
                if (response.code === 1) {
                    const data = response.data;

                    // 更新界面显示
                    $('.like-count').text(data.likesCount);
                    localStorage.setItem('likeCount', data.likesCount);

                    if (data.isLike) {
                        $('.btn-like').addClass('active');
                        localStorage.setItem('liked', 'true');
                    } else {
                        $('.btn-like').removeClass('active');
                        localStorage.setItem('liked', 'false');
                    }
                }
            })
            .catch(error => {
                console.error('点赞操作失败:', error);
            });
    }

    // 文章收藏
    function handleCollect() {
        const id = $('#article-id').val();
        toggleFavorite(id);
    }

    // 关注作者
    function followAuthor(username) {
        const button = $('#btn-follow');
        const status = button.data('status');

        // 禁用按钮防止重复点击
        button.prop('disabled', true);

        if (!username) {
            console.error("用户名为空，请检查按钮的 data-username 属性");
            button.prop('disabled', false);
            return;
        }

        // 记录实际发送的参数以便调试
        console.log('关注作者，发送用户名:', username);

        // 调用API关注作者
        article.follow(username)
            .then(response => {
                if (response.code === 1) {
                    // 切换关注状态
                    if (status === 'unfollowed') {
                        button.data('status', 'followed');
                        button.html('<i class="fas fa-check"></i> 已关注');
                    } else {
                        button.data('status', 'unfollowed');
                        button.html('<i class="fas fa-plus"></i> 关注作者');
                    }
                } else {
                    alert('关注操作失败: ' + (response.message || '请稍后重试'));
                }
            })
            .catch(error => {
                console.error('关注操作失败:', error);
                alert('关注操作失败，请稍后重试');
            })
            .finally(() => {
                button.prop('disabled', false);
            });
    }

    // 获取文章摘要
    function getSummary(ratio) {
        ratio = ratio || 5; // 默认5%

        article.generateSummary(articleId, ratio)
            .then(response => {
                if (response.code === 1) {
                    const summaryText = response.data;

                    // 显示摘要内容
                    if ($('#article-summary').length === 0) {
                        $('.article-content').before('<div id="article-summary" class="summary-box mb-4"><h4>文章摘要</h4><div class="summary-content"></div></div>');
                    }

                    // 使用html()而不是text()以保留富文本格式
                    $('#article-summary .summary-content').html(summaryText);
                }
            })
            .catch(error => {
                console.error('获取摘要失败:', error);
                alert('获取摘要失败，请重试');
            });
    }

    // 检查关注状态
    function checkFollowStatus(articleId) {
        article.getAuthor_info(articleId)
            .then(response => {
                if (response.code === 1) {
                    const authorId = response.data.id;
                    console.log('获取到作者ID:', authorId);

                    article.checkFollowStatus(authorId)
                        .then(statusResponse => {
                            console.log('关注状态响应:', statusResponse);
                            if (statusResponse.code === 1) {
                                // 将响应数据转为字符串，然后检查是否为"1"
                                // 或者直接比较为1（数字类型）
                                const followData = statusResponse.data;
                                const isFollowing = followData === "1" || followData === 1;
                                console.log('关注状态:', isFollowing ? '已关注' : '未关注', '(原始值:', followData, ')');

                                if (isFollowing) {
                                    followButton.data('status', 'followed');
                                    followButton.html('<i class="fas fa-check"></i> 已关注');
                                } else {
                                    followButton.data('status', 'unfollowed');
                                    followButton.html('<i class="fas fa-plus"></i> 关注作者');
                                }
                            } else {
                                console.error('获取关注状态响应错误:', statusResponse);
                                // 如果状态获取失败，默认显示"关注作者"
                                followButton.data('status', 'unfollowed');
                                followButton.html('<i class="fas fa-plus"></i> 关注作者');
                            }
                        })
                        .catch(error => {
                            console.error('获取关注状态失败:', error);
                            // 如果状态获取出错，默认显示"关注作者"
                            followButton.data('status', 'unfollowed');
                            followButton.html('<i class="fas fa-plus"></i> 关注作者');
                        });
                } else {
                    console.error('获取作者信息响应错误:', response);
                }
            })
            .catch(error => {
                console.error('获取作者信息失败:', error);
            });
    }

    // 初始化所有事件监听
    function initEventListeners() {
        // 关注/取消关注按钮点击事件
        followButton.on('click', function() {
            const username = $(this).data('username');
            followAuthor(username);
        });

        // 点赞按钮点击事件
        $('.btn-like').on('click', function() {
            handleLike();
        });

        // 收藏按钮点击事件
        $('.btn-favorite').on('click', function() {
            const id = $('#article-id').val();
            toggleFavorite(id);
        });

        // 分享按钮点击事件
        $('.btn-share').on('click', function() {
            // 获取当前页面URL
            const currentUrl = window.location.href;

            // 创建临时输入框，用于复制
            const tempInput = document.createElement('input');
            tempInput.value = currentUrl;
            document.body.appendChild(tempInput);
            tempInput.select();

            try {
                // 执行复制命令
                document.execCommand('copy');

                // 显示复制成功的视觉反馈
                const $btn = $(this);
                $btn.addClass('copied ripple');

                // 显示通知
                showToast('链接已复制，可以分享给朋友了！', 'success');

                // 2秒后移除效果
                setTimeout(() => {
                    $btn.removeClass('copied');
                }, 2000);

                // 600毫秒后移除涟漪效果（与动画时长一致）
                setTimeout(() => {
                    $btn.removeClass('ripple');
                }, 600);

            } catch (err) {
                console.error('复制失败:', err);
                showToast('复制失败，请重试', 'danger');
            }

            // 移除临时输入框
            document.body.removeChild(tempInput);
        });

        // 生成摘要按钮点击事件
        $('#get-summary').on('click', function() {
            const ratio = $('#summary-ratio').val();
            getSummary(ratio);
        });

        // 发表评论
        $('#commentForm').submit(function(e) {
            e.preventDefault();
            const content = $('#commentContent').val().trim();

            if (!content) {
                showToast('评论内容不能为空', 'error');
                return;
            }

            // 调试信息
            console.log('提交评论:', articleId, content);

            const $submitBtn = $(this).find('button[type="submit"]');
            const originalText = $submitBtn.text();
            $submitBtn.prop('disabled', true).text('发表中...');

            article.comments.add(articleId, content)
                .then(response => {
                    console.log('评论响应:', response);

                    if (response.code === 1 || response.code === 200) {
                        $('#commentContent').val('');
                        loadComments(1);

                        // 使用更友好的提示
                        showToast('评论发表成功！', 'success');
                    } else {
                        showError('commentContent', response.message || response.msg || '评论发表失败');
                        console.error('评论发表失败:', response);
                    }
                })
                .catch(error => {
                    showError('commentContent', '评论发表失败，请稍后重试');
                    console.error('评论发表请求失败:', error);
                })
                .finally(() => {
                    $submitBtn.prop('disabled', false).text(originalText);
                });
        });

        // 评论输入框清除错误
        $('#commentContent').on('input', function() {
            clearError('commentContent');
        });

        // 加载更多评论
        $('#loadMore').on('click', function() {
            if (commentPage < totalCommentPages) {
                commentPage++;
                loadComments(commentPage);
            }
        });
    }

    // API测试函数
    function testAPI() {
        console.log('正在测试API连接...');

        // 测试数据
        const testData = {
            articleId: articleId,
            page: 1,
            pageSize: 10
        };

        // 测试评论API
        $.ajax({
            url: 'http://localhost:8080/zhxt/comments',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(testData),
            timeout: 3000,
            success: function(response) {
                console.log('API测试成功，评论API可用:', response);
            },
            error: function(xhr, status, error) {
                console.error('API测试失败，评论API不可用:', status, error);

                // 尝试备用端点
                $.ajax({
                    url: 'http://localhost:8080/article/comments',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(testData),
                    timeout: 3000,
                    success: function(response) {
                        console.log('备用API测试成功:', response);
                    },
                    error: function() {
                        console.error('备用API也不可用');
                    }
                });
            }
        });
    }

    // 直接加载评论的函数
    function directLoadComments() {
        console.log('使用直接方法加载评论');

        const requestData = {
            articleId: articleId,
            page: 1,
            pageSize: commentPageSize
        };

        $.ajax({
            url: 'http://localhost:8080/zhxt/comments',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function(response) {
                console.log('直接加载评论成功:', response);
                handleCommentsResponse(response, 1, commentPageSize);
            },
            error: function(xhr, status, error) {
                console.error('直接加载评论失败:', status, error);
                $('.comment-list').html(`
                    <div class="alert alert-warning">
                        <h5>评论加载失败</h5>
                        <p>可能的原因:</p>
                        <ul>
                            <li>服务器未启动</li>
                            <li>API地址错误</li>
                            <li>网络连接问题</li>
                        </ul>
                        <p>请检查控制台了解详细错误信息。</p>
                    </div>
                `);
            }
        });
    }

    /**
     * 切换文章收藏状态
     * @param {string} articleId - 文章ID
     */
    function toggleFavorite(articleId) {
        const $btn = $('.btn-favorite');
        const $count = $('.favorite-count');  // 直接选择元素，而不是通过find
        const isFavorited = $btn.hasClass('active');
        const currentCount = parseInt($count.text() || '0');

        // 防止重复点击
        if ($btn.data('processing')) {
            return;
        }

        // 标记正在处理
        $btn.data('processing', true);

        // 先在UI上立即反馈
        if (isFavorited) {
            // 取消收藏
            $btn.removeClass('active');
            $count.text(Math.max(0, currentCount - 1));
        } else {
            // 添加收藏
            $btn.addClass('active');
            $count.text(currentCount + 1);
        }

        // 发送请求到服务器
        article.collect(articleId)
            .then(response => {
                // 清除处理标记
                $btn.data('processing', false);

                console.log('收藏操作响应:', response);

                // 根据API文档，返回值是布尔类型
                // 转换各种可能的响应格式为布尔值
                let isCollected = false;

                if (typeof response === 'boolean') {
                    isCollected = response;
                } else if (response && typeof response === 'object') {
                    // 可能是 {code: 1, data: true/false} 格式
                    if (response.code === 1 && response.data !== undefined) {
                        isCollected = !!response.data;
                    } else if (response.code === 1) {
                        // 如果只有code=1，但没有data，假设成功
                        isCollected = !isFavorited;
                    }
                }

                console.log('最终收藏状态:', isCollected);

                // 强制将UI设置为与服务器返回状态一致
                if (isCollected) {
                    $btn.addClass('active');
                    if (!$btn.hasClass('active')) {
                        $count.text(currentCount + 1);
                    }
                } else {
                    $btn.removeClass('active');
                    if ($btn.hasClass('active')) {
                        $count.text(Math.max(0, currentCount - 1));
                    }
                }

                // 更新本地存储状态
                localStorage.setItem('favorited', isCollected ? 'true' : 'false');

                // 显示通知
                showToast(isFavorited ? '已取消收藏' : '收藏成功！', 'success');
            })
            .catch(error => {
                // 清除处理标记
                $btn.data('processing', false);

                console.error('收藏操作失败:', error);

                // 恢复原来状态
                if (isFavorited) {
                    $btn.addClass('active');
                    $count.text(currentCount);
                } else {
                    $btn.removeClass('active');
                    $count.text(Math.max(0, currentCount - 1));
                }

                // 错误处理
                if (error.status === 401) {
                    showToast('请先登录后再收藏', 'warning');
                } else if (error.responseJSON && error.responseJSON.message) {
                    showToast(error.responseJSON.message, 'error');
                } else {
                    showToast('网络错误，请稍后重试', 'error');
                }
            });
    }
});