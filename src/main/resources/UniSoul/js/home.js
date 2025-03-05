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
        loadUserStats();
    }

    // 加载用户统计信息
    function loadUserStats() {
        //发送请求获取用户统计信息
        article.getMyData()
            .then(response => {
                if (response.code === 1 && response.data) {
                    const userStats = response.data;
                    $('#articleCount').text(userStats.articlesCount);
                    $('#followersCount').text(userStats.fansCount);
                    $('#followingCount').text(userStats.followsCount);
                }
            }
            );
    }
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
                <span><i class="far fa-folder"></i> 分类: ${getCategoryNameById(article.category_id)}</span>
                <span class="ms-3"><i class="far fa-tag"></i> ${getTags(article.tags)}</span>
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


                    updatePagination(res0ponse.data.total, page, pageSize);
                } else {
                    console.error('后端返回的数据无效或请求失败');
                }
            })
            .catch(error => {
                console.error('加载文章列表失败:', error);
            });
    }
    // 格式化标签
    function getTags(tagsString) {
        try {
            // 将 JSON 字符串解析为数组
            const tagsArray = JSON.parse(tagsString);

            // 检查是否是一个有效的数组
            if (!Array.isArray(tagsArray)) {
                return ''; // 如果不是数组，返回空字符串
            }

            // 使用数组的 map 方法生成带 # 的标签字符串
            const formattedTags = tagsArray.map(tag => `#${tag}`).join(' ');

            // 返回格式化后的标签字符串
            return formattedTags;
        } catch (error) {
            // 如果解析失败，返回空字符串或错误提示
            console.error('Tags 数据格式错误:', error);
            return '';
        }
    }
    //格式化日期
    function formatDate(dateArray) {
        if (Array.isArray(dateArray) && dateArray.length >= 3) {
            const [year, month, day] = dateArray;
            // 确保月份和日为两位数
            const formattedMonth = month.toString().padStart(2, '0');
            const formattedDay = day.toString().padStart(2, '0');
            return `${year}-${formattedMonth}-${formattedDay}`;
        }
        return ''; // 如果输入不符合要求，返回空字符串或其他默认值
    }

    //处理分类id
    function getCategoryNameById(categoryId) {
        // 定义类别 ID 和名称的映射关系
        const categoryMap = {
            1: "心理",
            2: "学习",
            3: "生活",
            4: "就业",
            // 可以继续添加更多类别
        };

        // 根据 categoryId 返回对应的名称，如果不存在则返回默认值
        return categoryMap[categoryId] || "未知类别";
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