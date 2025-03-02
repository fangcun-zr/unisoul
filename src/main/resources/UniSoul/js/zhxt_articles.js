$(document).ready(function () {
    // 检查登录状态
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }

    let currentPage = 1;
    const pageSize = 10;
    let totalPages = 0;
    let currentCategory = '';

    // 加载文章分类
    function loadCategories() {
        article.getCategories()
            .then(response => {
                if (response.code === 1) {
                    const categoryList = $('.category-list');
                    categoryList.empty();

                    // 添加"全部"分类
                    categoryList.append(`
                        <a href="#" class="list-group-item list-group-item-action active" data-category="">
                            全部文章
                        </a>
                    `);

                    // 添加其他分类
                    response.data.forEach(category => {
                        categoryList.append(`
                            <a href="#" class="list-group-item list-group-item-action" 
                               data-category="${category.id}">
                                ${category.name}
                            </a>
                        `);
                    });
                }
            })
            .catch(error => {
                console.error('加载分类失败:', error);
            });
    }

    // 加载文章列表
    function loadArticles(page = 1) {
        article.getArticleList(page, pageSize, currentCategory)
            .then(response => {
                if (response.code === 1) {
                    const articleList = $('.article-list');
                    articleList.empty();

                    response.data.list.forEach(article => {
                        const articleHtml = `
                            <div class="article-item">
                                <h3 class="article-title">
                                    <a href="article-detail.html?id=${article.id}">
                                        ${article.title}
                                    </a>
                                </h3>
                                <div class="article-meta">
                                    <span>作者：${article.author}</span>
                                    <span class="mx-2">·</span>
                                    <span>发布时间：${article.createTime}</span>
                                    <span class="mx-2">·</span>
                                    <span>阅读：${article.viewCount}</span>
                                </div>
                                <div class="article-preview">${article.content}</div>
                            </div>
                        `;
                        articleList.append(articleHtml);
                    });

                    // 更新分页
                    totalPages = Math.ceil(response.data.total / pageSize);
                    updatePagination(page);
                }
            })
            .catch(error => {
                console.error('加载文章列表失败:', error);
            });
    }

    // 更新分页导航
    function updatePagination(currentPage) {
        const pagination = $('#pagination');
        pagination.empty();

        // 上一页
        pagination.append(`
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">上一页</a>
            </li>
        `);

        // 页码
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || // 第一页
                i === totalPages || // 最后一页
                (i >= currentPage - 2 && i <= currentPage + 2) // 当前页附近的页码
            ) {
                pagination.append(`
                    <li class="page-item ${i === currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a>
                    </li>
                `);
            } else if (
                i === currentPage - 3 || // 当前页前的省略号
                i === currentPage + 3 // 当前页后的省略号
            ) {
                pagination.append(`
                    <li class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>
                `);
            }
        }

        // 下一页
        pagination.append(`
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">下一页</a>
            </li>
        `);
    }

    // 分类点击事件
    $(document).on('click', '.category-list .list-group-item', function (e) {
        e.preventDefault();
        const $this = $(this);

        if ($this.hasClass('active')) return;

        $('.category-list .list-group-item').removeClass('active');
        $this.addClass('active');

        currentCategory = $this.data('category');
        currentPage = 1;
        loadArticles(1);
    });

    // 分页点击事件
    $(document).on('click', '.pagination .page-link', function (e) {
        e.preventDefault();
        const $this = $(this);
        const page = $this.data('page');

        if (page && page !== currentPage) {
            currentPage = page;
            loadArticles(page);
        }
    });

    // 初始化加载
    loadCategories();
    loadArticles();





});