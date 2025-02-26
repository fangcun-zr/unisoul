// const API_BASE_URL = 'http://localhost:8080';

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

    // // 加载用户统计信息
    // function loadUserStats() {
    //     // 获取文章数量
    //     article.getArticleList(1, 5)
    //         .then(response => {
    //             if (response.code === 1) {
    //                 $('#articleCount').text(response.total || 0);
    //             }
    //         });
    //
    //     // 获取粉丝数量
    //     xtqh_information.getFollowers()
    //         .then(response => {
    //             if (response.code === 1) {
    //                 $('#followersCount').text(response.total || 0);
    //             }
    //         });
    //
    //     // 获取关注数量
    //     xtqh_information.getFollowing()
    //         .then(response => {
    //             if (response.code === 1) {
    //                 $('#followingCount').text(response.total || 0);
    //             }
    //         });
    // }
// 加载文章列表
    function loadArticles(page = 1, pageSize = 5, category_id = '') {
        article.getArticleList(page, pageSize, category_id)
            .then(response => {
                if (response.code === 1 && response.data) {
                    const articleList = $('#articleList');
                    articleList.empty();

                    response.data.records.forEach(article => {
                        const articleHtml = `
        <div class="article-item">
            <h5 class="title">
                <a href="zhxt_article_details.html?id=${encodeURIComponent(article.id)}" class="text-decoration-none">${article.title || '无标题'}</a>
            </h5>
            <img src="${article.cover_image}" alt="${article.title}" class="cover-image">
            <p class="text-muted mb-2">${article.content.substring(0, 100)}...</p>  <!-- 只显示前100个字符 -->
            <div class="meta">
                <span><i class="far fa-folder"></i> 分类: ${article.category_id}</span>
                <span class="ms-3"><i class="far fa-tag"></i> 标签: ${article.tags}</span>
                <span class="ms-3"><i class="far fa-eye"></i> 浏览次数: ${article.viewCount || 0}</span>
                <span class="ms-3"><i class="far fa-thumbs-up"></i> 点赞数: ${article.likeCount || 0}</span>
                <span class="ms-3"><i class="far fa-comment"></i> 评论数: ${article.commentCount || 0}</span>
                <span class="ms-3"><i class="far fa-clock"></i> 发布时间: ${formatDate(article.create_time)}</span>
                <span class="ms-3"><i class="far fa-clock"></i> 更新时间: ${formatDate(article.update_time)}</span>
            </div>
        </div>
    `;
                        articleList.append(articleHtml);
                    });


                    updatePagination(response.data.total, page, pageSize);
                } else {
                    console.error('后端返回的数据无效或请求失败');
                }
            })
            .catch(error => {
                console.error('加载文章列表失败:', error);
            });
    }

// 格式化日期
    function formatDate(dateStr) {
        if (!dateStr) return '未知时间';
        return new Date(dateStr).toLocaleString();
    }

// 更新分页信息
    function updatePagination(total, currentPage, pageSize) {
        const paginationElement = $('#paginationInfo');
        if (paginationElement.length > 0) {
            const totalPages = Math.ceil(total / pageSize);
            paginationElement.text(`第 ${currentPage} 页 / 共 ${totalPages} 页 (${total} 条记录)`);
        }
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
    // loadUserStats();
    loadArticles();
    loadHotTopics();
});