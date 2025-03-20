$(document).ready(function() {
    // 初始化选项卡
    initTabs();

    // 加载个人信息
    loadUserInformation();

    // 绑定头像上传事件
    initAvatarUpload();

    // 绑定表单提交事件
    $('#profileForm').on('submit', function(e) {
        e.preventDefault();
        updateUserInformation();
    });

    // 监听选项卡切换事件
    $('.nav-link').on('click', function() {
        const tabId = $(this).attr('data-bs-target');
        handleTabChange(tabId);
    });

    // 绑定编辑按钮事件
    $('#editProfileBtn').on('click', function() {
        toggleProfileEdit(true);
    });

    // 绑定取消编辑按钮事件
    $('#cancelEditBtn').on('click', function() {
        toggleProfileEdit(false);
    });
});

// 初始化选项卡
function initTabs() {
    // 默认加载个人信息选项卡
    $('#profile-tab').tab('show');
}

// 加载用户信息
function loadUserInformation() {
    showLoading();

    $.ajax({
        url: API.getInformation(),
        type: 'GET',
        success: function(res) {
            if (res.code === 1 && res.data) {
                // 渲染用户信息到页面
                const user = res.data;

                // 渲染基本信息
                $('#displayUsername').text(user.name || '未设置昵称');
                $('#displaySchool').text(user.school || '未设置学校');
                $('#detailUsername').text(user.username || '-');
                $('#detailNickname').text(user.name || '-');
                $('#detailGender').text(user.gender === '0' ? '男' : '女');
                $('#detailAge').text(user.age || '-');
                $('#detailSchool').text(user.school || '-');
                $('#detailBiography').text(user.biography || '-');

                // 渲染头像
                if (user.avatarUrl) {
                    $('#avatarPreview').attr('src', user.avatarUrl);
                }

                // 设置表单值
                $('#name').val(user.name || '');
                $('#gender').val(user.gender === '0' ? 'male' : 'female');
                $('#age').val(user.age || '');
                $('#school').val(user.school || '');
                $('#biography').val(user.biography || '');

                // 加载统计数据 - 这部分可能需要从其他接口获取
                // 暂时保持不变，后续可以根据需要调整
                $.ajax({
                    url: API.getMyData(),
                    type: 'GET',
                    success: function(statsRes) {
                        if (statsRes.code === 1 && statsRes.data) {
                            const stats = statsRes.data;
                            $('#articleCount').text(stats.articlesCount || 0);
                            $('#followingCount').text(stats.followsCount || 0);
                            $('#followersCount').text(stats.fansCount || 0);
                        }
                    }
                });
            } else {
                // 如果接口返回错误，加载模拟数据以显示界面
                loadMockUserData();
                showError(res.msg || '获取用户信息失败，显示模拟数据');
            }
            hideLoading();
        },
        error: function() {
            // 如果接口调用失败，加载模拟数据以显示界面
            loadMockUserData();
            showError('网络错误，请稍后重试，显示模拟数据');
            hideLoading();
        }
    });
}

// 加载模拟用户数据（当接口调用失败时使用）
function loadMockUserData() {
    // 模拟基本数据
    $('#displayUsername').text('演示用户');
    $('#displaySchool').text('示例学校');
    $('#detailUsername').text('demo_account');
    $('#detailNickname').text('演示用户');
    $('#detailGender').text('男');
    $('#detailAge').text('25');
    $('#detailSchool').text('示例学校');
    $('#detailBiography').text('这是一个演示用户账号，用于界面展示');

    // 默认头像已存在，无需设置

    // 设置表单值
    $('#name').val('演示用户');
    $('#gender').val('male');  // 对应gender值为'0'
    $('#age').val('25');
    $('#school').val('示例学校');
    $('#biography').val('这是一个演示用户账号，用于界面展示');

    // 设置统计数据
    $('#articleCount').text('12');
    $('#followingCount').text('45');
    $('#followersCount').text('32');
}

// 初始化头像上传
function initAvatarUpload() {
    $('#avatarUpload').on('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        // 验证文件类型和大小
        if (!file.type.startsWith('image/')) {
            showError('请选择图片文件');
            return;
        }
        if (file.size > 20 * 1024 * 1024) {
            showError('图片大小不能超过20MB');
            return;
        }

        // 显示预览
        const reader = new FileReader();
        reader.onload = function(e) {
            $('#avatarPreview').attr('src', e.target.result);
        };
        reader.readAsDataURL(file);

        // 上传头像
        uploadAvatar(file);
    });
}

// 上传头像
function uploadAvatar(file) {
    showLoading();

    const formData = new FormData();
    formData.append('avatar', file);

    $.ajax({
        url: API.uploadAvatar(),
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(res) {
            if (res.code === 1) {
                showError('头像上传成功');
            } else {
                showError(res.msg || '头像上传失败');
            }
            hideLoading();
        },
        error: function() {
            showError('网络错误，请稍后重试');
            hideLoading();
        }
    });
}

// 更新用户信息
function updateUserInformation() {
    showLoading();

    const userData = {
        name: $('#name').val().trim(),
        gender: $('#gender').val() === 'male' ? '0' : '1',
        age: $('#age').val().trim(),
        school: $('#school').val().trim(),
        biography: $('#biography').val().trim()
    };

    $.ajax({
        url: API.updateInformation(),
        type: 'POST',
        data: JSON.stringify(userData),
        contentType: 'application/json',
        success: function(res) {
            if (res.code === 1) {
                showSuccess('个人信息更新成功');
                updateUserDisplay(userData);
                toggleProfileEdit(false);
            } else {
                showError(res.msg || '个人信息更新失败');
            }
            hideLoading();
        },
        error: function() {
            showError('网络错误，请稍后重试');
            hideLoading();
        }
    });
}

// 处理选项卡切换
function handleTabChange(tabId) {
    showLoading();

    // 根据选项卡ID加载不同内容
    switch(tabId) {
        case '#profile':
            // 个人信息选项卡内容已在页面加载时加载
            hideLoading();
            break;
        case '#articles':
            loadUserArticles();
            break;
        case '#favorites':
            loadFavoriteArticles();
            break;
        case '#columns':
            loadUserColumns();
            break;
        case '#social':
            loadSocialRelationships();
            break;
        case '#assessment':
            loadAssessmentHistory();
            break;
        default:
            hideLoading();
            break;
    }
}

// 加载用户文章
function loadUserArticles() {
    $.ajax({
        url: API.getMyArticles(),
        type: 'GET',
        success: function(res) {
            if (res.code === 1) {
                renderArticleList(res.data, $('#articleList'));
            } else {
                showError(res.msg || '获取文章列表失败');
            }
            hideLoading();
        },
        error: function() {
            showError('网络错误，请稍后重试');
            hideLoading();
        }
    });
}

// 渲染文章列表
function renderArticleList(articles, container, isFavorite = false) {
    container.empty();

    if (!articles || articles.length === 0) {
        container.html(`
            <div class="empty-placeholder">
                <i class="fas fa-file-alt"></i>
                <p>暂无文章</p>
            </div>
        `);
        return;
    }

    articles.forEach(article => {
        const item = `
            <div class="article-item">
                <div class="article-cover">
                    <img src="${article.coverImage || '../image/default-cover.jpg'}" alt="${article.title}">
                </div>
                <div class="article-content">
                    <h5 class="article-title">${article.title}</h5>
                    <p class="article-summary">${article.summary || '暂无摘要'}</p>
                    <div class="article-meta">
                        <div class="article-stats">
                            <span class="article-stat"><i class="fas fa-eye"></i> ${article.viewCount || 0}</span>
                            <span class="article-stat"><i class="fas fa-heart"></i> ${article.likeCount || 0}</span>
                            <span class="article-stat"><i class="fas fa-comment"></i> ${article.commentCount || 0}</span>
                        </div>
                        <div class="article-time">
                            <i class="fas fa-clock"></i> ${formatArticleDate(article.createTime)}
                        </div>
                    </div>
                    <div class="article-actions">
                        <button class="btn btn-sm btn-outline-primary view-article-btn" data-id="${article.id}">
                            <i class="fas fa-eye"></i> 查看
                        </button>
                        ${!isFavorite ? `
                            <button class="btn btn-sm btn-outline-primary edit-article-btn" data-id="${article.id}">
                                <i class="fas fa-edit"></i> 编辑
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-article-btn" data-id="${article.id}">
                                <i class="fas fa-trash"></i> 删除
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        container.append(item);
    });

    // 绑定文章操作事件
    bindArticleEvents();
}

// 格式化文章日期（处理数组格式的日期）
function formatArticleDate(dateArray) {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
        return '未知时间';
    }

    const year = dateArray[0];
    const month = String(dateArray[1]).padStart(2, '0');
    const day = String(dateArray[2]).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

// 绑定文章操作事件
function bindArticleEvents() {
    // 查看文章
    $('.view-article-btn').on('click', function() {
        const articleId = $(this).data('id');
        window.location.href = `zhxt_article_details.html?id=${articleId}`;
    });

    // 编辑文章
    $('.edit-article-btn').on('click', function() {
        const articleId = $(this).data('id');
        window.location.href = `article_edit.html?id=${articleId}`;
    });

    // 删除文章
    $('.delete-article-btn').on('click', function() {
        const articleId = $(this).data('id');
        const confirmDelete = confirm('确定要删除这篇文章吗？删除后无法恢复。');

        if (confirmDelete) {
            deleteArticle(articleId);
        }
    });
}

// 删除文章
function deleteArticle(articleId) {
    showLoading();

    // 使用zhxt_articles.js中的delete函数
    article.delete(articleId)
        .then(function(res) {
            if (res.code === 1) {
                showError('文章删除成功');
                loadUserArticles(); // 重新加载文章列表
            } else {
                showError(res.msg || '文章删除失败');
            }
        })
        .catch(function() {
            showError('网络错误，请稍后重试');
        })
        .always(function() {
            hideLoading();
        });
}

// 加载收藏文章
function loadFavoriteArticles() {
    $.ajax({
        url: API.getCollectArticles(),
        type: 'GET',
        success: function(res) {
            if (res.code === 1) {
                renderArticleList(res.data, $('#favoritesList'), true);
            } else {
                // 如果接口返回错误，显示提示信息
                $('#favoritesList').html(`
                    <div class="empty-placeholder">
                        <i class="fas fa-heart"></i>
                        <p>获取收藏失败，请稍后重试</p>
                    </div>
                `);
                showError(res.msg || '获取收藏列表失败');
            }
            hideLoading();
        },
        error: function() {
            // 如果接口调用失败，显示提示信息
            $('#favoritesList').html(`
                <div class="empty-placeholder">
                    <i class="fas fa-heart"></i>
                    <p>网络错误，请稍后重试</p>
                </div>
            `);
            showError('网络错误，请稍后重试');
            hideLoading();
        }
    });
}

// 加载用户专栏
function loadUserColumns() {
    $.ajax({
        url: API.getMyColumns(),
        type: 'GET',
        success: function(res) {
            if (res.code === 1) {
                renderColumnsList(res.data);
            } else {
                showError(res.msg || '获取专栏列表失败');
            }
            hideLoading();
        },
        error: function() {
            showError('网络错误，请稍后重试');
            hideLoading();
        }
    });
}

// 加载社交关系
function loadSocialRelationships() {
    // 并行请求粉丝和关注数据
    Promise.all([
        // 获取粉丝列表
        new Promise((resolve, reject) => {
            $.ajax({
                url: API.getFansList(),
                type: 'GET',
                success: function(res) {
                    if (res.code === 1) {
                        resolve(res.data);
                    } else {
                        reject(res.msg || '获取粉丝列表失败');
                    }
                },
                error: function(err) {
                    reject('网络错误，请稍后重试');
                }
            });
        }),

        // 获取关注列表
        new Promise((resolve, reject) => {
            $.ajax({
                url: API.getFollowList(),
                type: 'GET',
                success: function(res) {
                    if (res.code === 1) {
                        resolve(res.data);
                    } else {
                        reject(res.msg || '获取关注列表失败');
                    }
                },
                error: function(err) {
                    reject('网络错误，请稍后重试');
                }
            });
        })
    ])
        .then(([fans, following]) => {
            renderUserList(fans, $('#followersList'), 'fan');
            renderUserList(following, $('#followingList'), 'following');
            hideLoading();
        })
        .catch(error => {
            showError(error);
            hideLoading();
        });
}

// 加载测评历史
function loadAssessmentHistory() {
    $.ajax({
        url: API.getAssessmentHistory(),
        type: 'GET',
        success: function(res) {
            if (res.code === 1 && res.data) {
                // 确保数据存在并且格式正确
                renderAssessmentHistory(res.data);
            } else {
                // 显示空状态
                $('#assessmentList').html(`
                    <div class="empty-placeholder">
                        <i class="fas fa-clipboard-check"></i>
                        <p>获取测评历史失败，请稍后重试</p>
                    </div>
                `);
                showError(res.msg || '获取测评历史失败');
            }
            hideLoading();
        },
        error: function(xhr, status, error) {
            console.error("测评历史加载错误:", error);
            // 显示空状态并提供错误信息
            $('#assessmentList').html(`
                <div class="empty-placeholder">
                    <i class="fas fa-clipboard-check"></i>
                    <p>网络错误，请稍后重试</p>
                </div>
            `);
            showError('网络错误，请稍后重试');
            hideLoading();

            // 加载模拟数据以便于调试
            loadMockAssessmentData();
        }
    });
}

// 加载模拟测评数据（用于调试和展示）
function loadMockAssessmentData() {
    console.log("加载模拟测评数据");
    const mockData = [
        {
            id: 1,
            name: "抑郁症筛查测试",
            result: ["您的测评结果表明，您可能存在轻度抑郁倾向", "建议您关注自己的情绪变化"],
            time: "2025-03-15"
        },
        {
            id: 2,
            name: "人格特质评估",
            result: ["您是一个外向型的人", "喜欢与人交往，充满活力"],
            time: "2025-03-10"
        },
        {
            id: 3,
            name: "学习习惯分析",
            result: ["您的学习效率较高", "但需要提高专注力"],
            time: "2025-03-05"
        }
    ];

    renderAssessmentHistory(mockData);
}

// 渲染用户列表
function renderUserList(users, container, type) {
    container.empty();

    if (!users || users.length === 0) {
        container.html(`
            <div class="empty-placeholder">
                <i class="fas fa-user-friends"></i>
                <p>暂无${type === 'fan' ? '粉丝' : '关注'}</p>
            </div>
        `);
        return;
    }

    users.forEach(user => {
        const item = `
            <div class="user-item" data-id="${user.id}">
                <div class="user-avatar">
                    <img src="${user.avatarUrl || '../image/default-avatar.png'}" alt="${user.name}">
                </div>
                <div class="user-info">
                    <h5 class="user-name">${user.name || '用户' + user.id}</h5>
                    <p class="user-bio">${user.biography || '这个人很懒，什么都没留下...'}</p>
                    <div class="user-meta">
                        <span class="user-school">
                            <i class="fas fa-university"></i> ${user.school || '未设置学校'}
                        </span>
                        <span class="user-age">
                            <i class="fas fa-birthday-cake"></i> ${user.age || '未知年龄'}
                        </span>
                    </div>
                </div>
                <div class="user-action">
                    ${type === 'fan' ?
            (user.isFollowing ?
                `<button class="btn btn-sm btn-primary unfollow-btn" data-id="${user.id}">已关注</button>` :
                `<button class="btn btn-sm btn-outline-primary follow-btn" data-id="${user.id}">关注</button>`) :
            `<button class="btn btn-sm btn-outline-danger unfollow-btn" data-id="${user.id}">取消关注</button>`
        }
                </div>
            </div>
        `;
        container.append(item);
    });

    // 绑定关注/取消关注事件
    bindFollowEvents();
}

// 渲染专栏列表
function renderColumnsList(columns) {
    const container = $('#columnsList');
    container.empty();

    if (!columns || columns.length === 0) {
        container.html(`
            <div class="empty-placeholder">
                <i class="fas fa-columns"></i>
                <p>暂无专栏</p>
            </div>
        `);
        return;
    }

    columns.forEach(column => {
        const item = `
            <div class="column-item" data-id="${column.id}">
                <div class="column-header" style="background-image: url('${column.coverUrl || '../image/default-cover.jpg'}')">
                    <div class="column-overlay"></div>
                    <h4 class="column-title">${column.title}</h4>
                </div>
                <div class="column-body">
                    <p class="column-description">${column.description || '暂无描述'}</p>
                    <div class="column-stats">
                        <div class="column-stat">
                            <i class="fas fa-file-alt"></i> ${column.articleCount || 0} 篇文章
                        </div>
                        <div class="column-stat">
                            <i class="fas fa-users"></i> ${column.subscribers || 0} 位订阅者
                        </div>
                        <div class="column-stat">
                            <i class="fas fa-star"></i> ${column.rating ? column.rating.toFixed(1) : '暂无评分'}
                        </div>
                    </div>
                    <div class="column-meta">
                        <span class="column-date">
                            <i class="fas fa-calendar-alt"></i> ${formatDate(column.createdAt)}
                        </span>
                        <span class="column-category">
                            <i class="fas fa-tag"></i> ${getCategoryName(column.categoryId)}
                        </span>
                    </div>
                    <div class="column-actions">
                        <button class="btn btn-sm btn-outline-primary view-column-btn">
                            <i class="fas fa-eye"></i> 查看
                        </button>
                        <button class="btn btn-sm btn-outline-primary edit-column-btn">
                            <i class="fas fa-edit"></i> 编辑
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.append(item);
    });

    // 绑定专栏操作事件
    bindColumnEvents();
}

// 获取分类名称
function getCategoryName(categoryId) {
    const categories = {
        1: '心理健康',
        2: '学习成长',
        3: '情感生活',
        4: '其他'
    };
    return categories[categoryId] || '未分类';
}

// 渲染测评历史
function renderAssessmentHistory(assessments) {
    const container = $('#assessmentList');
    container.empty();

    console.log("测评数据:", assessments); // 调试输出

    if (!assessments || assessments.length === 0) {
        container.html(`
            <div class="empty-placeholder">
                <i class="fas fa-clipboard-check"></i>
                <p>暂无测评记录</p>
            </div>
        `);
        return;
    }

    assessments.forEach(assessment => {
        // 检查assessment是否为有效对象
        if (!assessment) return;

        // 提取数据，适配实际API返回的结构
        const id = assessment.sessionUuid || '';

        // 从conclusion中提取一个简短的标题
        let title = '心理测评结果';
        if (assessment.content && assessment.content.conclusion) {
            // 从结论中取前40个字符作为标题
            const conclusion = assessment.content.conclusion;
            title = conclusion.startsWith('###') ?
                conclusion.split('\n')[0].replace('###', '').trim() :
                conclusion.substring(0, 40) + (conclusion.length > 40 ? '...' : '');
        }

        // 格式化日期数组
        let formattedDate = '未知时间';
        if (assessment.createdAt && Array.isArray(assessment.createdAt) && assessment.createdAt.length >= 3) {
            const [year, month, day] = assessment.createdAt;
            formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }

        // 构建结果内容 - 包括结论和建议
        let resultContent = '<p>暂无结果</p>';
        if (assessment.content) {
            resultContent = '';

            // 添加结论
            if (assessment.content.conclusion) {
                resultContent += `<div class="assessment-conclusion">
                    <h6>结论:</h6>
                    <p>${assessment.content.conclusion.replace(/###[^#]+\n/g, '')}</p>
                </div>`;
            }

            // 添加建议
            if (assessment.content.suggestions) {
                resultContent += `<div class="assessment-suggestions">
                    <h6>建议:</h6>
                    <p>${assessment.content.suggestions.replace(/###[^#]+\n/g, '')}</p>
                </div>`;
            }
        }

        const item = `
            <div class="assessment-item" data-id="${id}">
                <div class="assessment-header">
                    <div class="assessment-title">${title}</div>
                    <div class="assessment-date">
                        <i class="fas fa-calendar-alt"></i> ${formattedDate}
                    </div>
                </div>
                <div class="assessment-body">
                    <div class="assessment-result">
                        ${resultContent}
                    </div>
                    <div class="assessment-actions">
                        <button class="btn btn-sm btn-outline-primary view-assessment-btn" data-id="${id}">
                            <i class="fas fa-eye"></i> 查看详情
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.append(item);
    });

    // 绑定查看详情事件
    $('.view-assessment-btn').on('click', function() {
        const assessmentId = $(this).data('id');
        window.location.href = `assessment_result.html?id=${assessmentId}`;
    });
}

// 绑定专栏操作事件
function bindColumnEvents() {
    // 查看专栏
    $('.view-column-btn').on('click', function() {
        const columnId = $(this).closest('.column-item').data('id');
        window.location.href = `column_detail.html?id=${columnId}`;
    });

    // 编辑专栏
    $('.edit-column-btn').on('click', function() {
        const columnId = $(this).closest('.column-item').data('id');
        window.location.href = `edit_column.html?id=${columnId}`;
    });
}

// 绑定关注/取消关注事件
function bindFollowEvents() {
    // 关注用户
    $('.follow-btn').on('click', function() {
        const userId = $(this).data('id');
        followUser(userId, $(this));
    });

    // 取消关注用户
    $('.unfollow-btn').on('click', function() {
        const userId = $(this).data('id');
        unfollowUser(userId, $(this));
    });

    // 查看用户主页
    $('.user-info').on('click', function() {
        const userId = $(this).closest('.user-item').data('id');
        window.location.href = `user_profile.html?id=${userId}`;
    });
}

// 关注用户
function followUser(userId, button) {
    showLoading();

    $.ajax({
        url: API.followUser(userId),
        type: 'POST',
        success: function(res) {
            if (res.code === 1) {
                button.removeClass('btn-outline-primary follow-btn')
                    .addClass('btn-primary unfollow-btn')
                    .text('已关注')
                    .off('click')
                    .on('click', function() {
                        unfollowUser(userId, $(this));
                    });

                // 更新统计数据
                const followingCount = parseInt($('#followingCount').text()) + 1;
                $('#followingCount').text(followingCount);
            } else {
                showError(res.msg || '关注失败');
            }
            hideLoading();
        },
        error: function() {
            showError('网络错误，请稍后重试');
            hideLoading();
        }
    });
}

// 取消关注用户
function unfollowUser(userId, button) {
    showLoading();

    $.ajax({
        url: API.unfollowUser(userId),
        type: 'POST',
        success: function(res) {
            if (res.code === 1) {
                // 如果在关注列表中，则移除该用户
                if (button.closest('.user-list').attr('id') === 'followingList') {
                    button.closest('.user-item').fadeOut(300, function() {
                        $(this).remove();

                        // 如果列表为空，显示空状态
                        if ($('#followingList .user-item').length === 0) {
                            $('#followingList').html(`
                                <div class="empty-placeholder">
                                    <i class="fas fa-user-friends"></i>
                                    <p>暂无关注</p>
                                </div>
                            `);
                        }
                    });
                } else {
                    // 如果在粉丝列表中，则更改按钮状态
                    button.removeClass('btn-primary unfollow-btn')
                        .addClass('btn-outline-primary follow-btn')
                        .text('关注')
                        .off('click')
                        .on('click', function() {
                            followUser(userId, $(this));
                        });
                }

                // 更新统计数据
                const followingCount = parseInt($('#followingCount').text()) - 1;
                $('#followingCount').text(followingCount > 0 ? followingCount : 0);
            } else {
                showError(res.msg || '取消关注失败');
            }
            hideLoading();
        },
        error: function() {
            showError('网络错误，请稍后重试');
            hideLoading();
        }
    });
}

// 格式化日期
function formatDate(dateString) {
    if (!dateString) return '未知时间';

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

// 显示加载状态
function showLoading() {
    $('.loading-overlay').addClass('active');
}

// 隐藏加载状态
function hideLoading() {
    $('.loading-overlay').removeClass('active');
}

// 显示错误信息
function showError(message) {
    alert(message);
}

// 显示成功信息
function showSuccess(message) {
    alert(message);
}

// 显示警告信息
function showWarning(message) {
    alert(message);
}

// 切换个人资料编辑模式
function toggleProfileEdit(isEditMode) {
    if (isEditMode) {
        // 切换到编辑模式
        $('#profileInfoDisplay').hide();
        $('#profileInfoEdit').show().addClass('active');
        $('#editProfileBtn').hide();

        // 填充表单数据
        const user = {
            name: $('#displayUsername').text(),
            gender: $('#detailGender').text() === '男' ? 'male' : 'female',
            age: $('#detailAge').text(),
            school: $('#detailSchool').text(),
            biography: $('#detailBiography').text()
        };

        $('#name').val(user.name);
        $('#gender').val(user.gender);
        $('#age').val(user.age);
        $('#school').val(user.school);
        $('#biography').val(user.biography);
    } else {
        // 切换回显示模式
        $('#profileInfoEdit').removeClass('active').hide();
        $('#profileInfoDisplay').show();
        $('#editProfileBtn').show();
    }
}

// 更新用户信息显示
function updateUserDisplay(userData) {
    $('#displayUsername').text(userData.name || '未设置昵称');
    $('#displaySchool').text(userData.school || '未设置学校');
    $('#detailNickname').text(userData.name || '-');
    $('#detailGender').text(userData.gender === '0' ? '男' : '女');
    $('#detailAge').text(userData.age || '-');
    $('#detailSchool').text(userData.school || '-');
    $('#detailBiography').text(userData.biography || '-');
    // 注意：不更新用户名(账号)，因为它不可编辑
}

// 绑定编辑按钮事件
$('#editProfileBtn').on('click', function() {
    toggleProfileEdit(true);
});

// 绑定取消编辑按钮事件
$('#cancelEditBtn').on('click', function() {
    toggleProfileEdit(false);
});

// 绑定表单提交事件
$('#profileForm').on('submit', function(e) {
    e.preventDefault();

    const formData = {
        name: $('#name').val().trim(),
        gender: $('#gender').val() === 'male' ? '0' : '1',
        age: $('#age').val().trim(),
        school: $('#school').val().trim(),
        biography: $('#biography').val().trim()
    };

    // 验证表单数据
    if (!formData.name) {
        showError('昵称不能为空');
        return;
    }

    // 显示加载状态
    showLoading();

    // 发送更新请求
    $.ajax({
        url: API.updateInformation(),
        type: 'POST',
        data: JSON.stringify(formData),
        contentType: 'application/json',
        success: function(res) {
            if (res.code === 1) {
                showSuccess('个人信息更新成功');
                updateUserDisplay(formData);
                toggleProfileEdit(false);
            } else {
                showError(res.msg || '个人信息更新失败');
            }
            hideLoading();
        },
        error: function() {
            showError('网络错误，请稍后重试');
            hideLoading();
        }
    });
});