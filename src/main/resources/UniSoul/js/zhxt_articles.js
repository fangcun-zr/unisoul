$(document).ready(function () {
    let currentPage = 1;
    const pageSize = 10;
    let totalPages = 0;
    let currentCategory = null;
    let currentKeywords = '';

    // 加载文章分类
    function loadCategories() {
        // 静态分类列表示例
        const categories = [
            { id: null, name: '全部文章', count: 0 },
            { id: 1, name: '心理健康', count: 12 },
            { id: 2, name: '学业指导', count: 8 },
            { id: 3, name: '职业规划', count: 5 },
            { id: 4, name: '人际关系', count: 7 }
        ];

        const categoryBody = $('.category-body');
        categoryBody.empty();

        // 添加分类
        categories.forEach(category => {
            const isActive = category.id === currentCategory;
            categoryBody.append(`
                <div class="category-item ${isActive ? 'active' : ''}" data-id="${category.id || ''}">
                    <i class="fas fa-${getCategoryIcon(category.name)}"></i>
                    <span>${category.name}</span>
                    <span class="count">${category.count}</span>
                </div>
            `);
        });

        // 绑定分类点击事件
        $('.category-item').on('click', function() {
            $('.category-item').removeClass('active');
            $(this).addClass('active');

            const categoryId = $(this).data('id') || null;
            currentCategory = categoryId;
            currentPage = 1;
            loadArticles();
        });
    }

    // 获取分类图标
    function getCategoryIcon(categoryName) {
        const iconMap = {
            '全部文章': 'list',
            '心理健康': 'heart',
            '学业指导': 'book',
            '职业规划': 'briefcase',
            '人际关系': 'users'
        };
        return iconMap[categoryName] || 'tag';
    }

    // 加载文章列表
    function loadArticles() {
        // 显示加载状态
        $('.article-list').html('<div class="text-center p-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-3">加载中...</p></div>');

        article.getArticleList(currentPage, pageSize, currentCategory, currentKeywords)
            .then(response => {
                if (response.code === 1) {
                    const data = response.data;
                    const articles = data.records || [];
                    const total = data.total || 0;

                    // 更新统计数据
                    $('#totalCount').text(total);

                    // 更新文章列表
                    renderArticles(articles);

                    // 更新分页
                    totalPages = Math.ceil(total / pageSize);
                    renderPagination();
                } else {
                    $('.article-list').html('<div class="alert alert-danger">加载文章失败</div>');
                }
            })
            .catch(error => {
                console.error('加载文章列表失败:', error);
                $('.article-list').html('<div class="alert alert-danger">服务器错误，请稍后重试</div>');
            });
    }

    // 渲染文章列表
    function renderArticles(articles) {
        const articleList = $('.article-list');
        articleList.empty();

        if (articles.length === 0) {
            articleList.html('<div class="text-center p-5"><i class="fas fa-search fa-3x text-muted mb-3"></i><p>没有找到相关文章</p></div>');
            return;
        }

        articles.forEach(article => {
            // 处理日期
            let formattedDate = '';
            if (Array.isArray(article.create_time) && article.create_time.length >= 3) {
                const [year, month, day] = article.create_time;
                formattedDate = `${year}-${month}-${day}`;
            }

            // 处理文章预览内容
            let previewContent = '';
            const content = article.content || '';
            if (content.length > 150) {
                // 移除HTML标签并截取预览文本
                previewContent = content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
            } else {
                previewContent = content.replace(/<[^>]*>/g, '');
            }

            // 处理标签
            let tags = [];
            try {
                if (typeof article.tags === 'string') {
                    tags = JSON.parse(article.tags);
                    if (!Array.isArray(tags)) {
                        tags = [article.tags];
                    }
                }
            } catch (e) {
                if (article.tags) {
                    tags = [article.tags];
                }
            }

            const tagsHtml = tags.length > 0
                ? tags.map(tag => `<span class="tag">${tag}</span>`).join('')
                : '<span class="tag text-muted">无标签</span>';

            articleList.append(`
                <div class="article-item">
                    <div class="article-header">
                        <h3 class="article-title">
                            <a href="zhxt_article_details.html?id=${article.id}">${article.title}</a>
                        </h3>
                        <div class="article-meta">
                            <span><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
                            <span><i class="far fa-eye"></i> 阅读(${article.viewCount || 0})</span>
                            <span><i class="far fa-thumbs-up"></i> 点赞(${article.likeCount || 0})</span>
                            <span><i class="far fa-comment"></i> 评论(${article.commentCount || 0})</span>
                        </div>
                    </div>
                    <div class="article-preview">${previewContent}</div>
                    <div class="article-footer">
                        <div class="article-tags">
                            ${tagsHtml}
                        </div>
                        <a href="zhxt_article_details.html?id=${article.id}" class="btn btn-sm btn-primary">
                            阅读全文 <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            `);
        });
    }

    // 渲染分页
    function renderPagination() {
        const loadMore = $('.load-more');
        loadMore.empty();

        if (totalPages <= 1) {
            // 只有一页或没有数据，不显示分页
            return;
        }

        if (currentPage < totalPages) {
            // 显示加载更多按钮
            loadMore.html(`
                <button class="btn btn-outline-primary" id="loadMore">
                    <i class="fas fa-sync-alt"></i> 加载更多
                </button>
            `);

            // 绑定加载更多点击事件
            $('#loadMore').on('click', function() {
                currentPage++;
                loadArticles();
            });
        } else {
            // 已经是最后一页
            loadMore.html('<p class="text-muted text-center">没有更多文章了</p>');
        }
    }

    // 初始化搜索功能
    function initSearch() {
        const searchInput = $('.search-box input');

        // 搜索输入事件
        searchInput.on('keypress', function(e) {
            if (e.which === 13) { // 回车键
                currentKeywords = $(this).val().trim();
                currentPage = 1;
                loadArticles();
            }
        });

        // 搜索图标点击事件
        $('.search-box i').on('click', function() {
            currentKeywords = searchInput.val().trim();
            currentPage = 1;
            loadArticles();
        });

        // 排序筛选事件
        $('.btn-filter').on('click', function() {
            const filter = $(this).data('filter');
            $('.btn-filter').removeClass('active');
            $(this).addClass('active');

            // 根据筛选条件处理
            // 这里只是示例，实际筛选需要后端支持
            if (filter === 'latest') {
                // 最新发布
            } else if (filter === 'popular') {
                // 最受欢迎
            }

            currentPage = 1;
            loadArticles();
        });
    }

    // 获取统计数据
    function getStatistics() {
        // 这里应该是一个API调用来获取统计数据
        // 现在我们使用模拟数据
        const stats = {
            totalArticles: 0,
            totalViews: 0,
            totalLikes: 0,
            totalComments: 0
        };

        // 获取文章列表时更新统计数据
        article.getArticleList(1, 10)
            .then(response => {
                if (response.code === 1) {
                    const data = response.data;
                    const articles = data.records || [];

                    // 更新总文章数
                    stats.totalArticles = data.total || 0;

                    // 计算总览阅量、点赞数和评论数
                    articles.forEach(article => {
                        stats.totalViews += article.viewCount || 0;
                        stats.totalLikes += article.likeCount || 0;
                        stats.totalComments += article.commentCount || 0;
                    });

                    // 更新UI
                    $('#totalCount').text(stats.totalArticles);
                    $('#viewCount').text(stats.totalViews);
                    $('#likeCount').text(stats.totalLikes);
                    $('#commentCount').text(stats.totalComments);
                }
            })
            .catch(error => {
                console.error('获取统计数据失败:', error);
            });
    }

    // 初始化
    function init() {
        loadCategories();
        initSearch();
        loadArticles();
        getStatistics(); // 添加获取统计数据
    }

    // 启动应用
    init();
});