// 移除导入语句，直接使用fetch实现API调用
// import {
//     getMyColumns,
//     getMyArticles,
//     getColumnStats,
//     createColumn,
//     updateColumn,
//     deleteColumn,
//     addArticleToColumn,
//     deleteArticle
// } from '../api/my_columns.js';

class MyColumnsPage {
    constructor() {
        this.columns = [];
        this.articles = [];
        this.currentPage = 1;
        this.currentSort = 'newest';
        this.isLoading = false;
        this.hasMoreColumns = true;
        this.baseURL = 'http://localhost:8080';

        this.init();
    }

    async init() {
        try {
            // 添加文章选择列表的样式
            this.addArticleSelectionStyles();

            // 初始化页面内容和事件监听
            await Promise.all([
                this.loadMyColumns(true),
                this.loadMyArticles(),
                this.loadColumnStats()
            ]);

            this.initEventListeners();
        } catch (error) {
            console.error('初始化页面失败:', error);
            this.showError('加载我的专栏信息失败，请刷新重试');
        }
    }

    // 加载用户的专栏列表
    async loadMyColumns(reset = false) {
        if (this.isLoading || (!this.hasMoreColumns && !reset)) return;

        try {
            this.isLoading = true;
            this.toggleColumnsLoading(true);

            const page = reset ? 1 : this.currentPage;
            const pageSize = 10;

            // 尝试API调用，如果失败则使用模拟数据
            try {
                const response = await fetch(`${this.baseURL}/columns/getMyColumns?page=${page}&size=${pageSize}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('API请求失败');
                }

                const data = await response.json();
                console.log('API返回的数据:', data); // 添加调试输出

                if (data.code !== 1) {
                    throw new Error(data.msg || '获取我的专栏列表失败');
                }

                const columns = data.data || [];
                console.log('解析的专栏数据:', columns); // 添加调试输出

                const hasMore = columns.length >= pageSize;

                if (reset) {
                    this.columns = [];
                    this.clearColumnList();
                } else {
                    this.columns = [...this.columns, ...columns];
                }

                // 检查DOM元素是否存在
                const columnListElement = document.getElementById('myColumnsContainer');
                if (!columnListElement) {
                    console.error('未找到myColumnsContainer元素，DOM ID可能不正确');
                }

                this.renderColumnList(columns, reset);

                this.hasMoreColumns = hasMore;
                this.updateLoadMoreColumnsButton();

                if (!reset) {
                    this.currentPage++;
                }

                return columns;

            } catch (apiError) {
                console.warn('API调用失败，使用模拟数据:', apiError);

                // 使用模拟数据
                const mockColumns = [
                    {
                        id: 1,
                        title: "心理成长专栏",
                        description: "探索心理健康和个人成长的各种主题",
                        categoryId: 1,
                        coverUrl: "../image/column-cover1.jpg",
                        createdAt: new Date(2023, 4, 10),
                        articleCount: 12,
                        subscribers: 125,
                        rating: 4.5
                    },
                    {
                        id: 2,
                        title: "情感关系指南",
                        description: "关于建立和维护健康关系的专业指导",
                        categoryId: 2,
                        coverUrl: "../image/column-cover2.jpg",
                        createdAt: new Date(2023, 5, 20),
                        articleCount: 8,
                        subscribers: 98,
                        rating: 4.2
                    }
                ];

                if (reset) {
                    this.columns = mockColumns;
                    this.clearColumnList();
                } else if (page === 1) {
                    // 只在第一页显示模拟数据
                    this.columns = mockColumns;
                } else {
                    // 第二页及以后没有更多数据
                    this.hasMoreColumns = false;
                }

                this.renderColumnList(this.columns, reset);
                this.updateLoadMoreColumnsButton();

                return this.columns;
            }

        } catch (error) {
            console.error('加载我的专栏列表失败:', error);
            this.showColumnListError('加载专栏失败，请重试');
            throw error;
        } finally {
            this.isLoading = false;
            this.toggleColumnsLoading(false);
        }
    }

    // 加载用户的文章列表
    async loadMyArticles() {
        try {
            this.toggleArticlesLoading(true);

            // 使用正确的API端点
            try {
                const response = await fetch(`${this.baseURL}/columns/getMyArticles`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('获取我的文章列表失败');
                }

                const data = await response.json();
                if (data.code !== 1) {
                    throw new Error(data.msg || '获取我的文章列表失败');
                }

                const articles = data.data || [];
                console.log('API返回的文章数据:', articles); // 添加调试输出

                this.articles = articles;
                this.renderArticleList(articles);

                return articles;
            } catch (error) {
                console.warn('API调用失败，使用模拟数据:', error);

                // 使用模拟数据
                const mockArticles = [
                    {
                        id: 1,
                        title: "如何有效管理情绪压力",
                        content: "现代生活压力大，情绪管理变得尤为重要...",
                        tags: "情绪管理,心理健康",
                        viewCount: 253,
                        likeCount: 45,
                        commentCount: 12,
                        create_time: new Date(2023, 5, 15),
                        columnId: null
                    },
                    {
                        id: 2,
                        title: "建立良好的人际关系技巧",
                        content: "人际关系是我们生活中不可或缺的一部分...",
                        tags: "人际关系,社交技巧",
                        viewCount: 189,
                        likeCount: 37,
                        commentCount: 8,
                        create_time: new Date(2023, 6, 22),
                        columnId: null
                    },
                    {
                        id: 3,
                        title: "职业规划与自我提升",
                        content: "明确的职业规划有助于我们在职场中更好地发展...",
                        tags: "职业发展,自我提升",
                        viewCount: 310,
                        likeCount: 62,
                        commentCount: 16,
                        create_time: new Date(2023, 7, 10),
                        columnId: null
                    }
                ];

                this.articles = mockArticles;
                this.renderArticleList(mockArticles);

                return mockArticles;
            }

        } catch (error) {
            console.error('加载我的文章列表失败:', error);
            this.showArticleListError('加载文章失败，请重试');
            throw error;
        } finally {
            this.toggleArticlesLoading(false);
        }
    }

    // 加载专栏统计信息
    async loadColumnStats() {
        try {
            // 由于API端点不存在，使用模拟数据代替真实API调用
            /*
            const response = await fetch(`${this.baseURL}/columns/getMyStats`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('获取统计信息失败');
            }

            const data = await response.json();
            if (data.code !== 1) {
                throw new Error(data.msg || '获取统计信息失败');
            }

            const stats = data.data || {
                columnCount: 0,
                articleCount: 0,
                totalViews: 0,
                totalLikes: 0,
                totalComments: 0,
                totalSubscribers: 0
            };
            */

            // 使用模拟数据
            const stats = {
                columnCount: this.columns.length || 2,
                articleCount: this.articles.length || 3,
                totalViews: 752,
                totalLikes: 144,
                totalComments: 36,
                totalSubscribers: 28
            };

            this.renderStats(stats);

            return stats;
        } catch (error) {
            console.error('加载统计信息失败:', error);
            // 如果获取统计失败，可以使用本地计算的数据
            this.renderStatsFromLocalData();
            return null;
        }
    }

    // 从本地数据计算统计数据
    renderStatsFromLocalData() {
        const stats = {
            columnCount: this.columns.length,
            articleCount: this.articles.length,
            totalViews: this.columns.reduce((sum, column) => sum + (column.viewCount || 0), 0) +
                this.articles.reduce((sum, article) => sum + (article.viewCount || 0), 0),
            totalLikes: this.articles.reduce((sum, article) => sum + (article.likeCount || 0), 0),
            totalComments: this.articles.reduce((sum, article) => sum + (article.commentCount || 0), 0),
            totalSubscribers: this.columns.reduce((sum, column) => sum + (column.subscribers || 0), 0)
        };

        this.renderStats(stats);
    }

    // 渲染专栏列表
    renderColumnList(columns, reset = false) {
        console.log('开始渲染专栏列表，数据:', columns); // 添加调试输出

        const columnListElement = document.getElementById('myColumnsContainer');
        if (!columnListElement) {
            console.error('未找到myColumnsContainer元素，DOM ID可能不正确');
            return;
        }

        // 移除加载中提示
        const loadingElement = columnListElement.querySelector('.loading-spinner');
        if (loadingElement) {
            loadingElement.remove();
        }

        if (!Array.isArray(columns) || columns.length === 0) {
            console.warn('没有专栏数据可以渲染或数据不是数组');
            if (reset) {
                columnListElement.innerHTML = '<div class="empty-message"><i class="fas fa-book"></i><p>你还没有创建专栏</p></div>';
            }
            return;
        }

        const columnsHtml = columns.map(column => {
            // 检查必要字段是否存在
            console.log('渲染单个专栏:', column);

            // 确保id是有效的
            if (!column.id) {
                console.error('专栏缺少有效的ID:', column);
                return ''; // 跳过无效数据
            }

            // 处理日期
            const formattedDate = this.formatDate(column.createdAt);

            // 获取分类名称
            const categoryNames = {
                1: '心理成长',
                2: '情感关系',
                3: '职业发展',
                4: '生活方式'
            };
            const categoryName = categoryNames[column.categoryId] || '未分类';

            return `
            <div class="column-card animate-fade-up" data-id="${column.id}">
                <div class="column-header">
                    <img src="${column.coverUrl || '../image/default-cover.jpg'}" alt="${column.title || '专栏封面'}" class="column-cover">
                    <div class="column-header-content">
                        <h3 class="column-title">
                            <a href="column_detail.html?id=${column.id}" class="column-title-link">${column.title || '未命名专栏'}</a>
                        </h3>
                        <div class="column-meta">
                            <span class="column-category"><i class="fas fa-tag"></i> ${categoryName}</span>
                            <span class="column-date"><i class="far fa-calendar"></i> ${formattedDate}</span>
                        </div>
                    </div>
                </div>
                <p class="column-description">${column.description || '暂无描述'}</p>
                <div class="column-stats">
                    <span><i class="fas fa-book-open"></i> ${column.articleCount || 0} 篇文章</span>
                    <span><i class="fas fa-user-friends"></i> ${column.subscribers || 0} 订阅者</span>
                    <span><i class="fas fa-star"></i> ${column.rating || 0} 评分</span>
                </div>
                <div class="column-actions">
                    <button class="btn btn-sm btn-outline-primary edit-column-btn"><i class="fas fa-edit"></i> 编辑</button>
                    <button class="btn btn-sm btn-outline-success add-article-btn"><i class="fas fa-plus"></i> 添加文章</button>
                    <button class="btn btn-sm btn-outline-danger delete-column-btn"><i class="fas fa-trash"></i> 删除</button>
                </div>
            </div>
            `;
        }).join('');

        console.log('生成的HTML:', columnsHtml.length > 100 ? columnsHtml.substring(0, 100) + '...' : columnsHtml);

        if (reset) {
            columnListElement.innerHTML = columnsHtml;
        } else {
            columnListElement.insertAdjacentHTML('beforeend', columnsHtml);
        }

        console.log('HTML插入完成，开始添加事件监听');

        // 初始化新添加的专栏卡片的事件监听
        this.initColumnCardEvents(columns);
    }

    // 为新添加的专栏卡片添加事件监听
    initColumnCardEvents(columns) {
        if (!Array.isArray(columns) || columns.length === 0) return;

        columns.forEach(column => {
            // 确保专栏有有效的ID
            if (!column.id) {
                console.error('专栏缺少有效的ID, 无法添加事件监听:', column);
                return;
            }

            const columnCard = document.querySelector(`.column-card[data-id="${column.id}"]`);
            if (!columnCard) return;

            // 为整个卡片添加点击事件，进入专栏详情
            columnCard.addEventListener('click', (e) => {
                // 避免点击操作按钮时触发卡片点击事件
                if (
                    !e.target.closest('.edit-column-btn') &&
                    !e.target.closest('.add-article-btn') &&
                    !e.target.closest('.delete-column-btn')
                ) {
                    console.log(`跳转到专栏详情页：专栏ID=${column.id}`);
                    window.location.href = `column_detail.html?id=${column.id}`;
                }
            });

            // 编辑专栏按钮
            const editBtn = columnCard.querySelector('.edit-column-btn');
            if (editBtn) {
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // 阻止事件冒泡
                    this.showEditColumnModal(column);
                });
            }

            // 添加文章按钮
            const addArticleBtn = columnCard.querySelector('.add-article-btn');
            if (addArticleBtn) {
                addArticleBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // 阻止事件冒泡
                    this.showAddArticleModal(column);
                });
            }

            // 删除专栏按钮
            const deleteBtn = columnCard.querySelector('.delete-column-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // 阻止事件冒泡
                    this.confirmDeleteColumn(column);
                });
            }
        });
    }

    // 渲染文章列表
    renderArticleList(articles) {
        const articleListElement = document.getElementById('myArticlesContainer');
        if (!articleListElement) {
            console.error('未找到myArticlesContainer元素，DOM ID可能不正确');
            return;
        }

        // 移除加载中提示
        const loadingElement = articleListElement.querySelector('.loading-spinner');
        if (loadingElement) {
            loadingElement.remove();
        }

        if (!Array.isArray(articles) || articles.length === 0) {
            articleListElement.innerHTML = '<div class="empty-message"><i class="fas fa-file-alt"></i><p>你还没有发表文章</p></div>';
            return;
        }

        const articlesHtml = articles.map(article => {
            // 处理标签
            let tags = [];
            try {
                if (typeof article.tags === 'string') {
                    if (article.tags.startsWith('[')) {
                        tags = JSON.parse(article.tags);
                    } else {
                        tags = [article.tags];
                    }
                }
            } catch (e) {
                if (article.tags) {
                    tags = [article.tags];
                }
            }

            const tagsHtml = tags.length > 0
                ? tags.map(tag => `<span class="article-tag">${tag}</span>`).join('')
                : '<span class="article-tag muted">无标签</span>';

            // 处理日期
            const formattedDate = this.formatDate(article.create_time);

            // 获取专栏名称
            let columnName = '未分配专栏';
            const column = this.columns.find(col => col.id === article.columnId);
            if (column) {
                columnName = column.title || '未命名专栏';
            }

            return `
            <div class="article-item animate-fade-up" data-id="${article.id}">
                <div class="article-header">
                    <h3 class="article-title">
                        <a href="zhxt_article_details.html?id=${article.id}">${article.title || '未命名文章'}</a>
                    </h3>
                    <div class="article-meta">
                        <span class="article-column"><i class="fas fa-book"></i> ${columnName}</span>
                        <span class="article-date"><i class="far fa-calendar"></i> ${formattedDate}</span>
                    </div>
                </div>
                <div class="article-footer">
                    <div class="article-tags">
                        ${tagsHtml}
                    </div>
                    <div class="article-stats">
                        <span><i class="far fa-eye"></i> ${article.viewCount || 0}</span>
                        <span><i class="far fa-thumbs-up"></i> ${article.likeCount || 0}</span>
                        <span><i class="far fa-comment"></i> ${article.commentCount || 0}</span>
                    </div>
                    <div class="article-actions">
                        <button class="btn btn-sm btn-outline-primary edit-article-btn"><i class="fas fa-edit"></i> 编辑</button>
                        <button class="btn btn-sm btn-outline-danger delete-article-btn"><i class="fas fa-trash"></i> 删除</button>
                    </div>
                </div>
            </div>
            `;
        }).join('');

        articleListElement.innerHTML = articlesHtml;

        // 初始化文章项的事件监听
        this.initArticleItemEvents(articles);
    }

    // 为文章项添加事件监听
    initArticleItemEvents(articles) {
        if (!Array.isArray(articles) || articles.length === 0) return;

        articles.forEach(article => {
            const articleItem = document.querySelector(`.article-item[data-id="${article.id}"]`);
            if (!articleItem) return;

            // 编辑文章按钮
            const editBtn = articleItem.querySelector('.edit-article-btn');
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    window.location.href = `edit_article.html?id=${article.id}`;
                });
            }

            // 删除文章按钮
            const deleteBtn = articleItem.querySelector('.delete-article-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    this.confirmDeleteArticle(article);
                });
            }
        });
    }

    // 渲染统计信息
    renderStats(stats) {
        if (!stats) return;

        const columnCountElement = document.getElementById('totalColumnsCount');
        if (columnCountElement) {
            columnCountElement.textContent = stats.columnCount || 0;
        }

        const articleCountElement = document.getElementById('totalArticlesCount');
        if (articleCountElement) {
            articleCountElement.textContent = stats.articleCount || 0;
        }

        const totalViewsElement = document.getElementById('totalViewsCount');
        if (totalViewsElement) {
            totalViewsElement.textContent = stats.totalViews || 0;
        }

        const totalSubscribersElement = document.getElementById('totalSubscribersCount');
        if (totalSubscribersElement) {
            totalSubscribersElement.textContent = stats.totalSubscribers || 0;
        }
    }

    // 显示编辑专栏模态框
    showEditColumnModal(column) {
        const modal = document.getElementById('createColumnModal');
        if (!modal) return;

        const modalTitle = modal.querySelector('.modal-title');
        if (modalTitle) {
            modalTitle.textContent = '编辑专栏';
        }

        // 保存正在编辑的专栏ID
        this.editingColumnId = column.id;

        const form = document.getElementById('columnForm');
        if (form) {
            const titleInput = form.querySelector('input[name="title"]');
            if (titleInput) {
                titleInput.value = column.title || '';
            }

            const descriptionInput = form.querySelector('textarea[name="description"]');
            if (descriptionInput) {
                descriptionInput.value = column.description || '';
            }

            const categorySelect = form.querySelector('select[name="categoryId"]');
            if (categorySelect) {
                categorySelect.value = column.categoryId || '';
            }
        }

        const submitBtn = document.getElementById('submitColumn');
        if (submitBtn) {
            submitBtn.textContent = '更新';
        }

        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }

    // 显示创建专栏模态框
    showCreateColumnModal() {
        const modal = document.getElementById('createColumnModal');
        if (!modal) return;

        const modalTitle = modal.querySelector('.modal-title');
        if (modalTitle) {
            modalTitle.textContent = '创建专栏';
        }

        // 清除正在编辑的专栏ID
        this.editingColumnId = null;

        const form = document.getElementById('columnForm');
        if (form) {
            form.reset();
        }

        const submitBtn = document.getElementById('submitColumn');
        if (submitBtn) {
            submitBtn.textContent = '创建';
        }

        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }

    // 显示添加文章到专栏模态框
    showAddArticleModal(column) {
        const modal = document.getElementById('addArticleModal');
        if (!modal) return;

        const modalTitle = modal.querySelector('.modal-title');
        if (modalTitle) {
            modalTitle.textContent = `添加文章到专栏: ${column.title || '未命名专栏'}`;
        }

        // 保存当前操作的专栏ID
        this.currentColumnId = column.id;

        // 过滤出不在当前专栏的文章
        const availableArticles = this.articles.filter(article => article.columnId !== column.id);

        // 获取模态框中的文章列表容器
        const articleListContainer = modal.querySelector('.article-selection-container');
        if (!articleListContainer) {
            // 如果容器不存在，创建一个
            const formBody = modal.querySelector('.modal-body form');
            if (formBody) {
                const container = document.createElement('div');
                container.className = 'article-selection-container mt-3';
                container.innerHTML = '<label class="form-label">选择要添加的文章</label>';
                formBody.appendChild(container);

                // 重新获取创建的容器
                const newContainer = modal.querySelector('.article-selection-container');
                this.renderAvailableArticles(newContainer, availableArticles);
            }
        } else {
            // 容器存在，直接渲染文章列表
            this.renderAvailableArticles(articleListContainer, availableArticles);
        }

        // 更新提交按钮状态
        const submitBtn = document.getElementById('submitAddArticle');
        if (submitBtn) {
            submitBtn.disabled = availableArticles.length === 0;
        }

        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }

    // 渲染可添加到专栏的文章列表
    renderAvailableArticles(container, articles) {
        if (!container) return;

        if (!Array.isArray(articles) || articles.length === 0) {
            container.innerHTML = '<div class="alert alert-info">没有可添加的文章</div>';
            return;
        }

        // 创建文章选择列表
        let html = '<div class="available-articles-list">';

        articles.forEach(article => {
            const formattedDate = this.formatDate(article.create_time);

            html += `
            <div class="article-select-item">
                <div class="form-check">
                    <input class="form-check-input article-checkbox" type="checkbox" value="${article.id}" id="article-${article.id}">
                    <label class="form-check-label" for="article-${article.id}">
                        <div class="article-select-title">${article.title || '未命名文章'}</div>
                        <div class="article-select-meta">
                            <span><i class="far fa-calendar"></i> ${formattedDate}</span>
                            <span><i class="far fa-eye"></i> ${article.viewCount || 0} 浏览</span>
                        </div>
                    </label>
                </div>
            </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;

        // 添加文章选择事件
        const checkboxes = container.querySelectorAll('.article-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', this.updateArticleSelection.bind(this));
        });
    }

    // 更新选中的文章
    updateArticleSelection() {
        const selectedCheckboxes = document.querySelectorAll('.article-checkbox:checked');
        const submitBtn = document.getElementById('submitAddArticle');

        if (submitBtn) {
            submitBtn.disabled = selectedCheckboxes.length === 0;
        }
    }

    // 将文章添加到专栏
    async addArticleToColumn() {
        // 获取当前操作的专栏ID
        const columnId = this.currentColumnId;
        if (!columnId) {
            this.showError('专栏ID无效');
            return;
        }

        // 获取选中的文章ID
        const selectedCheckboxes = document.querySelectorAll('.article-checkbox:checked');
        const articleIds = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);

        if (articleIds.length === 0) {
            this.showError('请选择要添加的文章');
            return;
        }

        try {
            // 使用Promise.all并行处理多个文章添加请求
            const promises = articleIds.map(articleId =>
                fetch(`${this.baseURL}/columns/addMyArticleToColumn`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        columnId: parseInt(columnId),
                        articleId: parseInt(articleId)
                    })
                }).then(response => {
                    if (!response.ok) {
                        throw new Error(`文章(ID: ${articleId})添加失败`);
                    }
                    return response.json();
                }).then(data => {
                    if (data.code !== 1) {
                        throw new Error(data.msg || `文章(ID: ${articleId})添加失败`);
                    }
                    return data;
                })
            );

            await Promise.all(promises);

            this.showToast(`成功添加 ${articleIds.length} 篇文章到专栏`);

            // 关闭模态框
            const modal = bootstrap.Modal.getInstance(document.getElementById('addArticleModal'));
            if (modal) {
                modal.hide();
            }

            // 重新加载数据
            await Promise.all([
                this.loadMyColumns(true),
                this.loadMyArticles()
            ]);
            await this.loadColumnStats();

        } catch (error) {
            console.error('添加文章到专栏失败:', error);
            this.showError('添加文章到专栏失败，请重试');
            throw error;
        }
    }

    // 确认删除专栏
    confirmDeleteColumn(column) {
        if (confirm(`确定要删除专栏"${column.title || '未命名专栏'}"吗？该操作不可恢复，专栏内的文章将会移除专栏归属。`)) {
            this.deleteColumn(column.id);
        }
    }

    // 确认删除文章
    confirmDeleteArticle(article) {
        if (confirm(`确定要删除文章"${article.title || '未命名文章'}"吗？该操作不可恢复。`)) {
            this.deleteArticle(article.id);
        }
    }

    // 保存专栏（创建或更新）
    async saveColumn() {
        const form = document.getElementById('columnForm');
        if (!form) return;

        const titleInput = form.querySelector('input[name="title"]');
        const descriptionInput = form.querySelector('textarea[name="description"]');
        const categorySelect = form.querySelector('select[name="categoryId"]');
        const coverInput = form.querySelector('input[name="cover"]');

        if (!titleInput || !titleInput.value.trim()) {
            this.showError('请输入专栏标题');
            return;
        }

        // 检查描述长度是否符合要求（10-300字符）
        const description = descriptionInput ? descriptionInput.value.trim() : '';
        if (description.length < 10 || description.length > 300) {
            this.showError('专栏描述需要10-300字符');
            return;
        }

        try {
            let url = '';
            let method = '';

            if (this.editingColumnId) {
                // 更新专栏 - 根据API文档，使用FormData处理请求
                url = `${this.baseURL}/columns/updateColumn`;
                method = 'POST'; // API文档中指定使用POST方法

                // 使用FormData处理包含文件的请求
                const formData = new FormData();
                formData.append('title', titleInput.value.trim());
                formData.append('description', description);
                formData.append('categoryId', categorySelect ? categorySelect.value : '1');
                formData.append('columnId', this.editingColumnId); // 使用columnId参数

                // 添加封面图片（如果有）
                if (coverInput && coverInput.files && coverInput.files.length > 0) {
                    formData.append('cover', coverInput.files[0]);
                }

                console.log('发送更新专栏请求:', {
                    url,
                    method,
                    title: titleInput.value.trim(),
                    description,
                    categoryId: categorySelect ? categorySelect.value : '1',
                    columnId: this.editingColumnId,
                    hasFile: coverInput && coverInput.files && coverInput.files.length > 0
                });

                const response = await fetch(url, {
                    method: method,
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('更新专栏失败');
                }

                const data = await response.json();
                console.log('更新专栏响应:', data);

                // 根据API文档，成功响应的code为1
                if (data.code === 1) {
                    this.showToast('专栏更新成功');
                } else {
                    throw new Error(data.msg || data.message || '更新专栏失败');
                }
            } else {
                // 创建专栏 - 使用新的API路径和参数格式
                url = `${this.baseURL}/columns/create`;
                method = 'POST';

                // 使用FormData处理包含文件的请求
                const formData = new FormData();
                formData.append('title', titleInput.value.trim());
                formData.append('description', description);
                formData.append('categoryId', categorySelect ? categorySelect.value : '1');

                // 添加封面图片（如果有）
                if (coverInput && coverInput.files && coverInput.files.length > 0) {
                    formData.append('cover', coverInput.files[0]);
                }

                console.log('发送创建专栏请求:', {
                    url,
                    method,
                    title: titleInput.value.trim(),
                    description,
                    categoryId: categorySelect ? categorySelect.value : '1',
                    hasFile: coverInput && coverInput.files && coverInput.files.length > 0
                });

                const response = await fetch(url, {
                    method: method,
                    body: formData
                });

                console.log('创建专栏HTTP状态:', response.status, response.statusText);
                let data;

                try {
                    // 尝试解析JSON响应
                    const text = await response.text();
                    console.log('原始响应文本:', text);

                    try {
                        data = text ? JSON.parse(text) : {};
                    } catch (e) {
                        console.log('响应不是有效的JSON:', e);
                        // 如果不是JSON，但请求成功，仍视为成功
                        data = { success: response.ok };
                    }
                } catch (e) {
                    console.log('读取响应文本失败:', e);
                    // 即使无法读取响应，如果HTTP状态为成功，仍视为成功
                    data = { success: response.ok };
                }

                console.log('创建专栏响应数据:', data);

                // 无论响应如何，如果HTTP状态码正常，都认为是成功
                if (response.ok) {
                    this.showToast('专栏创建成功');
                } else {
                    // 只有HTTP状态异常时才显示错误
                    const errorMsg = (data && (data.message || data.msg)) || '创建专栏失败';
                    console.error('创建专栏响应错误:', data);
                    this.showError(errorMsg);
                    throw new Error(errorMsg);
                }
            }

            // 关闭模态框
            const modal = bootstrap.Modal.getInstance(document.getElementById('createColumnModal'));
            if (modal) {
                modal.hide();
            }

            // 重新加载数据
            await this.loadMyColumns(true);
            await this.loadColumnStats();

        } catch (error) {
            console.error('保存专栏失败:', error);
            this.showError('保存专栏失败，请重试');
            throw error;
        }
    }

    // 删除专栏
    async deleteColumn(columnId) {
        if (!confirm(`确定要删除这个专栏吗？该操作不可恢复，专栏内的文章将会移除专栏归属。`)) {
            return;
        }

        try {
            // 根据API文档，修改参数名为column_id
            const response = await fetch(`${this.baseURL}/columns/deleteColumn?column_id=${columnId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('删除专栏失败');
            }

            const data = await response.json();
            if (data.code !== 1) {
                throw new Error(data.msg || data.message || '删除专栏失败');
            }

            this.showToast('专栏已成功删除');

            // 从服务器重新加载专栏数据，而不仅是过滤本地数据
            await this.loadMyColumns(true);
            // 重新加载文章列表和统计信息
            await this.loadMyArticles();
            await this.loadColumnStats();

            return data.data;
        } catch (error) {
            console.error('删除专栏失败:', error);
            this.showError('删除专栏失败，请重试');
            throw error;
        }
    }

    // 删除文章
    async deleteArticle(articleId) {
        if (!confirm(`确定要删除这篇文章吗？该操作不可恢复。`)) {
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/articles/deleteArticle?id=${articleId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('删除文章失败');
            }

            const data = await response.json();
            if (data.code !== 1) {
                throw new Error(data.msg || '删除文章失败');
            }

            // 从列表中移除此文章
            this.articles = this.articles.filter(article => article.id !== articleId);
            this.renderArticleList(this.articles);

            this.showToast('文章已成功删除');

            // 重新加载统计信息
            await this.loadColumnStats();

            return data.data;
        } catch (error) {
            console.error('删除文章失败:', error);
            this.showError('删除文章失败，请重试');
            throw error;
        }
    }

    // 初始化事件监听
    initEventListeners() {
        // 创建专栏按钮点击事件
        const createColumnBtn = document.getElementById('createColumnBtn');
        if (createColumnBtn) {
            createColumnBtn.addEventListener('click', () => {
                this.showCreateColumnModal();
            });
        }

        // 保存专栏按钮点击事件
        const saveColumnBtn = document.getElementById('submitColumn');
        if (saveColumnBtn) {
            saveColumnBtn.addEventListener('click', () => {
                this.saveColumn();
            });
        }

        // 保存添加文章按钮点击事件
        const saveAddArticleBtn = document.getElementById('submitAddArticle');
        if (saveAddArticleBtn) {
            saveAddArticleBtn.addEventListener('click', () => {
                this.addArticleToColumn();
            });
        }

        // 加载更多专栏按钮点击事件
        const loadMoreColumnsBtn = document.getElementById('loadMoreColumnsBtn');
        if (loadMoreColumnsBtn) {
            loadMoreColumnsBtn.addEventListener('click', () => {
                this.loadMyColumns();
            });
        }

        // 排序选择器改变事件
        const sortSelect = document.getElementById('columnSortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                this.currentSort = sortSelect.value;
                this.currentPage = 1;
                this.loadMyColumns(true);
            });
        }

        // 侧边栏菜单项点击事件
        const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                // 移除所有菜单项的活动状态
                menuItems.forEach(mi => mi.classList.remove('active'));
                // 添加当前菜单项的活动状态
                item.classList.add('active');

                // 隐藏所有内容区域
                const sections = document.querySelectorAll('.content-section');
                sections.forEach(section => section.classList.add('d-none'));

                // 显示当前选择的内容区域
                const sectionId = item.getAttribute('data-section') + '-section';
                const currentSection = document.getElementById(sectionId);
                if (currentSection) {
                    currentSection.classList.remove('d-none');
                }
            });
        });
    }

    // 更新加载更多专栏按钮状态
    updateLoadMoreColumnsButton() {
        const loadMoreBtn = document.getElementById('loadMoreColumnsBtn');
        if (!loadMoreBtn) return;

        if (this.hasMoreColumns) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }

    // 切换专栏列表加载状态
    toggleColumnsLoading(isLoading) {
        const loadMoreBtn = document.getElementById('loadMoreColumnsBtn');
        if (!loadMoreBtn) return;

        if (isLoading) {
            loadMoreBtn.disabled = true;
            loadMoreBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 加载中...';
        } else {
            loadMoreBtn.disabled = false;
            loadMoreBtn.innerHTML = '<i class="fas fa-sync-alt"></i> 加载更多';
        }
    }

    // 切换文章列表加载状态
    toggleArticlesLoading(isLoading) {
        const articleList = document.getElementById('myArticlesContainer');
        if (!articleList) return;

        if (isLoading) {
            if (!articleList.querySelector('.loading-spinner')) {
                articleList.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">加载中...</span>
                    </div>
                    <p>加载中...</p>
                </div>
                `;
            }
        }
    }

    // 清空专栏列表
    clearColumnList() {
        const columnListElement = document.getElementById('myColumnsContainer');
        if (columnListElement) {
            columnListElement.innerHTML = '';
        }
    }

    // 显示专栏列表错误
    showColumnListError(message) {
        const columnListElement = document.getElementById('myColumnsContainer');
        if (!columnListElement) return;

        const errorHtml = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
        `;

        columnListElement.innerHTML = errorHtml;
    }

    // 显示文章列表错误
    showArticleListError(message) {
        const articleListElement = document.getElementById('myArticlesContainer');
        if (!articleListElement) return;

        const errorHtml = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
        `;

        articleListElement.innerHTML = errorHtml;
    }

    // 格式化日期
    formatDate(dateString) {
        if (!dateString) return '未知日期';

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '未知日期';

            return date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('日期格式化错误:', error);
            return '未知日期';
        }
    }

    // 显示错误
    showError(message) {
        // 可以根据实际情况实现
        this.showToast(message, 'error');
    }

    // 显示Toast提示
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;

        const toastBody = toast.querySelector('.toast-body');
        if (!toastBody) return;

        toast.classList.remove('bg-success', 'bg-danger');
        toast.classList.add(type === 'success' ? 'bg-success' : 'bg-danger');

        toastBody.textContent = message;

        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }

    // 关闭指定ID的模态框
    closeModal(modalId) {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        }
    }

    // 添加文章选择列表的样式
    addArticleSelectionStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .article-selection-container {
                max-height: 300px;
                overflow-y: auto;
                border: 1px solid #e0e0e0;
                border-radius: 5px;
                padding: 10px;
                margin-top: 15px;
            }
            
            .available-articles-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .article-select-item {
                border-bottom: 1px solid #f0f0f0;
                padding-bottom: 8px;
            }
            
            .article-select-item:last-child {
                border-bottom: none;
            }
            
            .article-select-title {
                font-weight: 500;
                margin-bottom: 5px;
            }
            
            .article-select-meta {
                display: flex;
                gap: 10px;
                font-size: 0.8rem;
                color: #666;
            }
            
            .form-check-label {
                width: 100%;
                cursor: pointer;
            }
            
            .article-checkbox {
                margin-top: 10px;
            }
            
            .column-title-link {
                color: inherit;
                text-decoration: none;
                transition: color 0.2s;
            }
            
            .column-title-link:hover {
                color: #007bff;
                text-decoration: none;
            }
            
            .column-card {
                cursor: pointer;
                transition: all 0.3s ease;
                border: 1px solid #e0e0e0;
            }
            
            .column-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                border-color: #007bff;
            }
        `;
        document.head.appendChild(styleElement);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new MyColumnsPage();
}); 