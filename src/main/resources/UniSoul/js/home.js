$(document).ready(function() {
    // 检查登录状态
    // if (!localStorage.getItem('token')) {
    //     window.location.href = 'login.html';
    //     return;
    // }

    // 检查localStorage中是否有用户信息
    const userDetails = localStorage.getItem('userDetails');

    if (userDetails) {
        // 解析用户信息
        const user = JSON.parse(userDetails);
        // 将用户信息渲染到页面上
        $('#currentUsername').text(user.name);
        $('#userAvatar').attr('src', user.avatarUrl);
        $('#sidebarUsername').text(user.name);
        $('#userSchool').text(user.school || '未设置学校');
        $('.avatar-lg ').attr('src', user.avatarUrl);
        // ...渲染其他用户信息
    }
    // 加载用户信息
    function loadUserInfo() {
        xtqh_information.getInformation()
            .then(response => {
                if (response.code === 1) {
                    const data = response.data;
                    $('#currentUsername').text(data.username);
                    $('#sidebarUsername').text(data.username);
                    $('#userSchool').text(data.school || '未设置学校');

                    // 如果有头像则显示
                    if (data.avatar) {
                        $('.avatar-sm, .avatar-lg').attr('src', data.avatar);
                    }
                }
            })
            .catch(error => {
                console.error('加载用户信息失败:', error);
            });
    }

    // 加载用户统计信息
    function loadUserStats() {
        // 获取文章数量
        article.getList(1, 1)
            .then(response => {
                if (response.code === 200) {
                    $('#articleCount').text(response.total || 0);
                }
            });

        // 获取粉丝数量
        xtqh_information.getFollowers()
            .then(response => {
                if (response.code === 200) {
                    $('#followersCount').text(response.total || 0);
                }
            });

        // 获取关注数量
        xtqh_information.getFollowing()
            .then(response => {
                if (response.code === 200) {
                    $('#followingCount').text(response.total || 0);
                }
            });
    }

    // 加载文章列表
    function loadArticles() {
        article.getList(1, 5)
            .then(response => {
                if (response.code === 200 && response.data) {
                    const articleList = $('#articleList');
                    articleList.empty();

                    response.data.forEach(article => {
                        const articleHtml = `
                            <div class="article-item">
                                <h5 class="title">
                                    <a href="#" class="text-decoration-none">${article.title}</a>
                                </h5>
                                <p class="text-muted mb-2">${article.summary}</p>
                                <div class="meta">
                                    <span><i class="far fa-user"></i> ${article.author}</span>
                                    <span class="ms-3"><i class="far fa-clock"></i> ${article.createTime}</span>
                                    <span class="ms-3"><i class="far fa-eye"></i> ${article.views || 0}</span>
                                    <span class="ms-3"><i class="far fa-comment"></i> ${article.comments || 0}</span>
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

    // 加载热门话题
    function loadHotTopics() {
        // 这里可以添加获取热门话题的API调用
        const topics = [
            { title: '如何缓解考试焦虑', count: 1234 },
            { title: '大学生心理健康', count: 998 },
            { title: '亲子关系处理', count: 876 },
            { title: '职场压力管理', count: 654 },
            { title: '情感困扰解决', count: 432 }
        ];

        const topicList = $('.topic-list');
        topics.forEach((topic, index) => {
            const topicHtml = `
                <div class="topic-item">
                    <div class="topic-rank">${index + 1}</div>
                    <div class="topic-info">
                        <div class="topic-title">${topic.title}</div>
                        <small class="text-muted">${topic.count} 讨论</small>
                    </div>
                </div>
            `;
            topicList.append(topicHtml);
        });
    }

    // 退出登录
    $('#logoutBtn').click(function() {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });




    // 初始化加载
    loadUserInfo();
    loadUserStats();
    loadArticles();
    loadHotTopics();
});