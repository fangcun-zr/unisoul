$(document).ready(function () {
    // 初始化页面
    initPage();
    // 绑定事件
    bindEvents();
});

let currentPage = 1;
const PAGE_SIZE = 10;

// 初始化页面
function initPage() {
    // 加载统计数据
    loadStats();
    // 加载默认话题列表
    loadTopics();
    // 加载标签
    loadTags();
}

// 加载统计数据
function loadStats() {
    Promise.all([
        TopicsAPI.getAllLikeCounts(),
        TopicsAPI.getAllRepliesCounts(),
        TopicsAPI.getAllTopicCounts()
    ]).then(([likesRes, repliesRes, topicsRes]) => {
        $('.stats-number[data-type="likes"]').text(likesRes.data);
        $('.stats-number[data-type="answers"]').text(repliesRes.data);
        $('.stats-number[data-type="questions"]').text(topicsRes.data);
    }).catch(error => {
        console.error('Failed to load stats:', error);
        showError('加载统计数据失败');
    });
}

// 加载话题列表
function loadTopics(page = 1) {
    showLoading();
    TopicsAPI.getTopics(page, PAGE_SIZE)
        .then(response => {
            if (response.code === 1) {
                renderTopics(response.data.records);
                updatePagination(response.data.total);
            } else {
                throw new Error(response.msg || '加载失败');
            }
        })
        .catch(error => {
            console.error('Failed to load topics:', error);
            showError('加载话题失败');
        })
        .always(() => {
            hideLoading();
        });
}

// 渲染话题列表
function renderTopics(data) {
    const $topicsList = $('.topics-list');
    $topicsList.empty();

    data.forEach(topic => {
        const displayName = topic.anonymous ? '匿名用户' : topic.username;
        // 使用后端返回的 like 字段确定点赞状态
        const isLiked = topic.like === true;
        // 使用后端返回的 likes 字段作为点赞数
        const likesCount = topic.likes || 0;
        // 使用后端返回的 avatarUrl 作为用户头像
        const avatarUrl = topic.avatarUrl || '../image/anonymousPicture.png';
        // 使用后端返回的 views 字段作为浏览量
        const viewsCount = topic.views || 0;

        const topicHtml = `
            <div class="topic-item" data-id="${topic.id}">
                <div class="topic-header">
                    <div class="user-info">
                        <img src="${avatarUrl}" alt="用户头像" class="user-avatar">
                        <div class="user-meta">
                            <div class="user-name">${displayName}</div>
                            <div class="post-time">${formatTime(topic.createTime)}</div>
                        </div>
                    </div>
                </div>
                <div class="topic-content">
                    <h3 class="topic-title">${topic.title}</h3>
                    <p class="topic-text">${topic.content}</p>
                </div>
                <div class="topic-footer">
                    <div class="topic-tags">
                        ${(topic.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="topic-actions">
                        <button class="action-btn like-btn ${isLiked ? 'liked' : ''}" data-id="${topic.id}" data-liked="${isLiked}">
                            <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
                            <span>${likesCount}</span>
                        </button>
                        <button class="action-btn reply-btn" data-id="${topic.id}">
                            <i class="fas fa-comment"></i>
                            <span>${topic.repliesCount || 0}</span>
                        </button>
                        <span class="view-count">
                            <i class="fas fa-eye"></i> ${viewsCount}
                        </span>
                    </div>
                </div>
            </div>
        `;
        $topicsList.append(topicHtml);
    });

    // 确保点赞按钮的样式正确应用
    $('.like-btn').each(function () {
        const $btn = $(this);
        const isLiked = $btn.data('liked') === true;
        if (isLiked) {
            $btn.addClass('liked');
            $btn.find('.fa-heart').addClass('fas').removeClass('far');
        } else {
            $btn.removeClass('liked');
            $btn.find('.fa-heart').addClass('far').removeClass('fas');
        }
    });
}

// 绑定事件
function bindEvents() {
    // 标签切换
    $('#topicTabs').on('click', '.nav-link', function (e) {
        e.preventDefault();
        const $this = $(this);
        $('#topicTabs .nav-link').removeClass('active');
        $this.addClass('active');
        currentPage = 1;
        loadTopics();
    });

    // 我要提问按钮
    $('#askQuestionBtn').on('click', function () {
        showAskQuestionModal();
    });

    // 我的回答按钮
    $('#myAnswersBtn').on('click', function () {
        showMyReplies();
    });

    // 点赞操作
    $(document).on('click', '.like-btn', function () {
        const $btn = $(this);
        const topicId = $btn.data('id');
        const isLiked = $btn.data('liked') === true;
        const currentLikes = parseInt($btn.find('span').text());

        console.log('点击点赞按钮:', {
            topicId: topicId,
            currentLikes: currentLikes,
            isLiked: isLiked
        });

        // 调用API
        TopicsAPI.like(topicId, currentLikes, isLiked)
            .done(function (response) {
                console.log('点赞响应:', response);
                if (response.code === 1) {
                    // 更新按钮状态
                    const newLikeState = response.data.like;
                    const newLikeCount = response.data.likesCount;

                    // 更新按钮的点赞状态和数量
                    $btn.data('liked', newLikeState);
                    $btn.toggleClass('liked', newLikeState);
                    $btn.find('span').text(newLikeCount);

                    // 更新按钮图标
                    const $icon = $btn.find('.fa-heart');
                    if (newLikeState) {
                        $icon.addClass('fas').removeClass('far');
                    } else {
                        $icon.addClass('far').removeClass('fas');
                    }

                    // 只更新统计面板中的点赞总数
                    TopicsAPI.getAllLikeCounts()
                        .then(likesRes => {
                            $('.stats-number[data-type="likes"]').text(likesRes.data);
                        })
                        .catch(error => {
                            console.error('Failed to update likes count:', error);
                        });
                } else {
                    showError(response.msg || '操作失败');
                }
            })
            .fail(function (error) {
                console.error('点赞请求失败:', error);
                showError('网络错误，请重试');
            });
    });

    // 评论按钮
    $(document).on('click', '.reply-btn', function () {
        const topicId = $(this).data('id');
        showReplyModal(topicId);
    });

    // 搜索框
    $('.search-box input').on('keypress', function (e) {
        if (e.which === 13) {
            const keyword = $(this).val().trim();
            if (keyword) {
                searchTopics(keyword);
            }
        }
    });

    // 标签点击
    $(document).on('click', '.tag', function () {
        const tag = $(this).text();
        searchByTag(tag);
    });

    // 话题点击事件
    $(document).on('click', '.topic-content', function () {
        const topicId = $(this).closest('.topic-item').data('id');
        // 使用相对路径跳转到话题详情页面
        window.location.href = `../html/topic.html?id=${topicId}`;
    });

    // 绑定搜索相关事件
    bindSearchEvents();
}

// 显示提问模态框
function showAskQuestionModal() {
    ELEMENT.MessageBox({
        title: '发起提问',
        dangerouslyUseHTMLString: true,
        message: `
            <div class="el-form ask-question-form">
                <div class="el-form-item">
                    <label class="el-form-item__label">标题</label>
                    <div class="el-form-item__content">
                        <input type="text" class="el-input__inner" placeholder="请输入标题（简短、明确的描述）">
                    </div>
                </div>
                <div class="el-form-item">
                    <label class="el-form-item__label">内容</label>
                    <div class="el-form-item__content">
                        <textarea class="el-textarea__inner" 
                                placeholder="请详细描述您的问题...&#10;• 问题的具体表现是什么？&#10;• 您期望得到什么样的帮助？" 
                                style="min-height: 200px;"></textarea>
                    </div>
                </div>
                <div class="el-form-item">
                    <label class="el-form-item__label">标签</label>
                    <div class="el-form-item__content">
                        <input type="text" class="el-input__inner" placeholder="请输入标签，用逗号分隔（如：情感,生活,学习）">
                        <div class="form-tip">添加合适的标签可以让更多人看到您的问题</div>
                    </div>
                </div>
                <div class="el-form-item" style="margin-bottom: 0;">
                    <div class="el-form-item__content">
                        <label class="el-checkbox">
                            <span class="el-checkbox__input">
                                <input type="checkbox" class="el-checkbox__original" 
                                       onchange="this.parentNode.classList.toggle('is-checked', this.checked); this.closest('.el-checkbox').classList.toggle('is-checked', this.checked);">
                                <span class="el-checkbox__inner"></span>
                            </span>
                            <span class="el-checkbox__label">匿名发布</span>
                        </label>
                        <div class="form-tip">选择匿名发布后，其他用户将不会看到您的用户名</div>
                    </div>
                </div>
            </div>
        `,
        customClass: 'ask-question-dialog',
        showCancelButton: true,
        confirmButtonText: '发布',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
                const dialog = instance.$el;
                const title = dialog.querySelector('input[type="text"]').value.trim();
                const content = dialog.querySelector('textarea').value.trim();
                const tags = dialog.querySelectorAll('input[type="text"]')[1].value.trim();
                const anonymous = dialog.querySelector('input[type="checkbox"]').checked;

                if (!title) {
                    ELEMENT.Message.warning('请输入标题');
                    return;
                }
                if (!content) {
                    ELEMENT.Message.warning('请输入内容');
                    return;
                }

                const topicData = {
                    title: title,
                    content: content,
                    tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
                    anonymous: anonymous ? 1 : 0
                };

                createNewTopic(topicData);
                done();
            } else {
                done();
            }
        }
    });
}

// 创建新话题
function createNewTopic(topicData) {
    console.log('发送新话题数据:', topicData);

    // 调用API创建话题
    TopicsAPI.createTopic(topicData)
        .done(function (response) {
            console.log('创建话题响应:', response);
            if (response.code === 1) {
                ELEMENT.Message.success('发布成功');
                loadTopics(); // 重新加载话题列表
            } else {
                showError(response.msg || '发布失败');
            }
        })
        .fail(function (error) {
            console.error('创建话题失败:', error);
            showError('网络错误，请重试');
        });
}

// 显示评论模态框
function showReplyModal(topicId) {
    ELEMENT.MessageBox.prompt('请输入您的评论', '发表评论', {
        confirmButtonText: '发送',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '写下您的评论...'
    }).then(({ value }) => {
        if (value) {
            replyTopic(topicId, value);
        }
    }).catch(() => { });
}

// 评论话题
function replyTopic(topicId, content) {
    TopicsAPI.replyTopic(topicId, content, false)
        .then(response => {
            if (response.code === 1) {
                ELEMENT.Message.success('评论成功');
                loadTopics();
            } else {
                throw new Error(response.msg || '评论失败');
            }
        })
        .catch(error => {
            console.error('Reply failed:', error);
            showError(error.message || '评论失败');
        });
}

// 显示我的评论
function showMyReplies() {
    showLoading();
    TopicsAPI.getMyReplies()
        .then(response => {
            if (response.code === 1) {
                renderMyReplies(response.data);
            } else {
                throw new Error(response.msg || '加载失败');
            }
        })
        .catch(error => {
            console.error('Failed to load my replies:', error);
            showError('加载评论失败');
        })
        .always(() => {
            hideLoading();
        });
}

// 渲染我的评论
function renderMyReplies(replies) {
    const $repliesList = $('.topics-list');
    $repliesList.empty();

    if (!replies || replies.length === 0) {
        $repliesList.append('<div class="no-data">暂无评论</div>');
        return;
    }

    replies.forEach(reply => {
        const replyHtml = `
            <div class="topic-item" data-reply-id="${reply.id}">
                <div class="topic-header">
                    <div class="user-info">
                        <div class="user-meta">
                            <div class="user-name">${reply.anonymous ? '匿名用户' : reply.username}</div>
                            <div class="post-time">${formatTime(reply.createTime)}</div>
                        </div>
                    </div>
                </div>
                <div class="topic-content">
                    <p class="topic-text">${reply.content}</p>
                </div>
                <div class="topic-footer">
                    <div class="topic-actions">
                        <button class="action-btn delete-btn" data-id="${reply.id}">
                            <i class="fas fa-trash"></i>
                            <span>删除</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        $repliesList.append(replyHtml);
    });

    // 绑定删除按钮事件
    $('.delete-btn').on('click', function () {
        const replyId = $(this).data('id');
        deleteReply(replyId);
    });
}

// 删除评论
function deleteReply(replyId) {
    ELEMENT.MessageBox.confirm('确定要删除这条评论吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        showLoading();
        $.ajax({
            url: `${API_BASE_URL}/topic/deleteReplies`,
            method: 'POST',
            data: { id: replyId },
            contentType: 'application/x-www-form-urlencoded'
        })
            .done(function (response) {
                if (response.code === 1) {
                    ELEMENT.Message.success('删除成功');
                    // 重新加载评论列表
                    showMyReplies();
                } else {
                    throw new Error(response.msg || '删除失败');
                }
            })
            .fail(function (error) {
                console.error('Delete reply failed:', error);
                showError('删除失败，请重试');
            })
            .always(function () {
                hideLoading();
            });
    }).catch(() => {
        // 用户取消删除操作
    });
}

// 搜索话题
function searchTopics(keyword) {
    TopicsAPI.searchKeyWord(keyword)
        .then(response => {
            if (response.code === 1) {
                renderTopics(response.data);
            } else {
                throw new Error(response.msg || '搜索失败');
            }
        })
        .catch(error => {
            console.error('Search failed:', error);
            showError('搜索失败');
        });
}

// 按标签搜索
function searchByTag(tag) {
    TopicsAPI.getTopicsByTags([tag])
        .then(response => {
            if (response.code === 1) {
                renderTopics(response.data);
            } else {
                throw new Error(response.msg || '搜索失败');
            }
        })
        .catch(error => {
            console.error('Tag search failed:', error);
            showError('搜索失败');
        });
}

// 加载标签
function loadTags() {
    TopicsAPI.getAllTags()
        .then(response => {
            if (response.code === 1) {
                renderTagsList(response.data);
            } else {
                throw new Error(response.msg || '加载失败');
            }
        })
        .catch(error => {
            console.error('Failed to load tags:', error);
            showError('加载标签失败');
        });
}

// 渲染标签列表
function renderTagsList(tags) {
    const $tagsList = $('.tags-list');
    $tagsList.empty();

    if (!tags || tags.length === 0) {
        $tagsList.append('<div class="no-tags">暂无标签</div>');
        return;
    }

    // 添加标签标题
    $tagsList.append('<div class="tags-title">热门标签</div>');

    // 创建标签容器
    const $tagsContainer = $('<div class="tags-container"></div>');

    // 添加所有标签
    tags.forEach(tag => {
        const tagHtml = `
            <div class="tag-item" data-tag="${tag}">
                <i class="fas fa-tag"></i>
                <span>${tag}</span>
            </div>
        `;
        $tagsContainer.append(tagHtml);
    });

    // 将标签容器添加到列表中
    $tagsList.append($tagsContainer);

    // 绑定标签点击事件
    $('.tag-item').on('click', function () {
        const $this = $(this);
        const tag = $this.data('tag');

        // 如果当前标签已经选中，则取消选中并加载所有话题
        if ($this.hasClass('active')) {
            $('.tag-item').removeClass('active');
            loadTopics(); // 重新加载所有话题
            return;
        }

        // 高亮选中的标签
        $('.tag-item').removeClass('active');
        $this.addClass('active');

        // 调用API获取该标签的话题
        $.ajax({
            url: `${API_BASE_URL}/topic/getTopicsByTags`,
            method: 'GET',
            data: { tagsName: tag },  // 直接传递标签名称字符串
            contentType: 'application/x-www-form-urlencoded'
        })
            .then(response => {
                if (response.code === 1) {
                    renderTopics(response.data);
                } else {
                    throw new Error(response.msg || '获取话题失败');
                }
            })
            .catch(error => {
                console.error('Failed to get topics by tag:', error);
                showError('获取话题失败');
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

// 显示加载中
function showLoading() {
    $('.topics-list').append('<div class="loading-spinner">加载中...</div>');
}

// 隐藏加载中
function hideLoading() {
    $('.loading-spinner').remove();
}

// 格式化时间
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) {
        return '刚刚';
    } else if (diff < 3600000) {
        return `${Math.floor(diff / 60000)}分钟前`;
    } else if (diff < 86400000) {
        return `${Math.floor(diff / 3600000)}小时前`;
    } else {
        return date.toLocaleDateString();
    }
}

// 更新分页
function updatePagination(total) {
    const totalPages = Math.ceil(total / PAGE_SIZE);
    const $pagination = $('.pagination');
    $pagination.empty();

    // 上一页按钮
    $pagination.append(`
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">上一页</a>
        </li>
    `);

    // 页码按钮
    for (let i = 1; i <= totalPages; i++) {
        $pagination.append(`
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `);
    }

    // 下一页按钮
    $pagination.append(`
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">下一页</a>
        </li>
    `);

    // 绑定分页点击事件
    $pagination.on('click', '.page-link', function (e) {
        e.preventDefault();
        const page = $(this).data('page');
        if (page && page !== currentPage) {
            currentPage = page;
            loadTopics(page);
        }
    });
}

// 绑定搜索相关事件
function bindSearchEvents() {
    const $searchInput = $('#searchInput');
    const $searchBtn = $('#searchBtn');
    const $searchResults = $('.search-results');
    const $searchResultsList = $('.search-results-list');

    // 搜索按钮点击事件
    $searchBtn.on('click', function () {
        const keyword = $searchInput.val().trim();
        if (!keyword) {
            ELEMENT.Message.warning('请输入搜索关键词');
            return;
        }
        performSearch(keyword);
    });

    // 回车键触发搜索
    $searchInput.on('keypress', function (e) {
        if (e.which === 13) {
            const keyword = $searchInput.val().trim();
            if (keyword) {
                performSearch(keyword);
            }
        }
    });

    // 执行搜索
    function performSearch(keyword) {
        // 显示加载状态
        $searchBtn.prop('disabled', true);
        $searchBtn.html('<i class="fas fa-spinner fa-spin"></i> 搜索中...');

        // 调用搜索API
        $.ajax({
            url: `${API_BASE_URL}/topic/searchKeyWord`,
            method: 'GET',
            data: { keyWord: keyword }
        })
            .done(function (response) {
                if (response.code === 1) {
                    renderSearchResults(response.data);
                } else {
                    showError(response.msg || '搜索失败');
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.error('搜索请求失败:', {
                    status: textStatus,
                    error: errorThrown,
                    keyword: keyword
                });
                showError('搜索失败，请重试');
            })
            .always(function () {
                // 恢复按钮状态
                $searchBtn.prop('disabled', false);
                $searchBtn.html('<i class="fas fa-search"></i> 搜索');
            });
    }

    // 渲染搜索结果
    function renderSearchResults(results) {
        $searchResultsList.empty();

        if (!results || results.length === 0) {
            $searchResultsList.html('<div class="no-results">未找到相关话题</div>');
            $searchResults.show();
            return;
        }

        results.forEach(topic => {
            const isLiked = topic.like === true;  // 使用后端返回的点赞状态
            const resultHtml = `
                <div class="search-result-item" data-id="${topic.id}">
                    <div class="title">${topic.title}</div>
                    <div class="meta">
                        <span class="author">${topic.anonymous ? '匿名用户' : topic.username}</span>
                        <button class="action-btn like-btn ${isLiked ? 'liked' : ''}" data-id="${topic.id}" data-liked="${isLiked}">
                            <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
                            <span>${topic.likes || 0}</span>
                        </button>
                    </div>
                </div>
            `;
            $searchResultsList.append(resultHtml);
        });

        // 显示搜索结果区域
        $searchResults.show();

        // 绑定搜索结果点击事件
        $('.search-result-item').on('click', function (e) {
            // 如果点击的是点赞按钮，不要跳转
            if ($(e.target).closest('.like-btn').length) {
                return;
            }
            const topicId = $(this).data('id');
            window.location.href = `topic.html?id=${topicId}`;
        });

        // 绑定点赞按钮事件
        $('.like-btn').on('click', function (e) {
            e.stopPropagation();  // 阻止事件冒泡
            const $btn = $(this);
            const topicId = $btn.data('id');
            const isLiked = $btn.data('liked') === true;
            const currentLikes = parseInt($btn.find('span').text());

            // 调用点赞API
            TopicsAPI.like(topicId, currentLikes, isLiked)
                .done(function (response) {
                    if (response.code === 1) {
                        // 更新按钮状态
                        const newLikeState = response.data.like;
                        const newLikeCount = response.data.likesCount;

                        // 更新按钮的点赞状态和数量
                        $btn.data('liked', newLikeState);
                        $btn.toggleClass('liked', newLikeState);
                        $btn.find('span').text(newLikeCount);

                        // 更新按钮图标
                        const $icon = $btn.find('.fa-heart');
                        if (newLikeState) {
                            $icon.addClass('fas').removeClass('far');
                        } else {
                            $icon.addClass('far').removeClass('fas');
                        }

                        // 更新统计面板中的点赞总数
                        TopicsAPI.getAllLikeCounts()
                            .then(likesRes => {
                                $('.stats-number[data-type="likes"]').text(likesRes.data);
                            })
                            .catch(error => {
                                console.error('Failed to update likes count:', error);
                            });
                    } else {
                        showError(response.msg || '操作失败');
                    }
                })
                .fail(function (error) {
                    console.error('点赞请求失败:', error);
                    showError('网络错误，请重试');
                });
        });
    }
}