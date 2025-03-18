import columnDetailApi from '../api/column_detail.js';

class ColumnDetailPage {
    constructor() {
        this.columnId = new URLSearchParams(window.location.search).get('id');
        this.currentPage = 1;
        this.pageSize = 10;
        this.isLoading = false;
        this.isOwner = false;
        this.articleStats = new Map();
        this.init();
    }

    async init() {
        try {
            await Promise.all([
                this.loadColumnDetail(),
                this.loadColumnArticles(),
                this.initEventListeners()
            ]);
        } catch (error) {
            console.error('初始化失败:', error);
            this.showToast('页面初始化失败，请刷新重试', 'error');
        }
    }

    async loadColumnDetail() {
        try {
            const column = await columnDetailApi.getColumnDetail(this.columnId);
            this.isOwner = column.isAuthor;
            this.renderColumnDetail(column);
        } catch (error) {
            console.error('加载专栏详情失败:', error);
            this.showToast('加载专栏详情失败', 'error');
        }
    }

    async loadColumnArticles(reset = false) {
        if (this.isLoading) return;

        try {
            this.isLoading = true;
            this.toggleLoadingState(true);

            const response = await columnDetailApi.getColumnArticles(
                this.columnId,
                reset ? 1 : this.currentPage,
                this.pageSize
            );

            if (reset) {
                this.clearArticles();
                this.currentPage = 1;
            }

            this.renderArticles(response.data);

            if (response.hasMore) {
                this.currentPage++;
                this.showLoadMoreButton();
            } else {
                this.hideLoadMoreButton();
            }
        } catch (error) {
            console.error('加载文章列表失败:', error);
            this.showToast('加载文章列表失败', 'error');
        } finally {
            this.isLoading = false;
            this.toggleLoadingState(false);
        }
    }

    renderColumnDetail(column) {
        const detailContainer = document.querySelector('.column-detail');
        detailContainer.innerHTML = `
            <div class="column-header">
                <div class="cover-image">
                    <img src="${column.coverImage}" alt="${column.title}">
                </div>
                <div class="column-info">
                    <h1>${column.title}</h1>
                    <p class="description">${column.description}</p>
                    <div class="author-info">
                        <img src="${column.author.avatar}" alt="${column.author.name}" class="author-avatar">
                        <div class="author-details">
                            <h4>${column.author.name}</h4>
                            <p>${column.author.title}</p>
                        </div>
                    </div>
                    <div class="column-stats">
                        <span><i class="fas fa-book-reader"></i> ${column.articleCount} 篇文章</span>
                        <span><i class="fas fa-user-friends"></i> ${column.subscriberCount} 订阅</span>
                        <span><i class="fas fa-star"></i> ${column.rating} 评分</span>
                        <span><i class="fas fa-eye"></i> ${column.totalViews || 0} 总阅读</span>
                    </div>
                    ${this.renderColumnActions(column)}
                </div>
            </div>
        `;
    }

    renderColumnActions(column) {
        if (this.isOwner) {
            return `
                <div class="column-actions">
                    <button class="btn btn-primary" id="editColumnBtn">
                        <i class="fas fa-edit"></i> 编辑专栏
                    </button>
                    <button class="btn btn-success" id="addArticleBtn">
                        <i class="fas fa-plus"></i> 添加文章
                    </button>
                    <button class="btn btn-danger" id="deleteColumnBtn">
                        <i class="fas fa-trash"></i> 删除专栏
                    </button>
                </div>
            `;
        } else {
            return `
                <div class="column-actions">
                    <button class="btn btn-primary" id="subscribeBtn">
                        <i class="fas fa-star"></i> ${column.isSubscribed ? '取消订阅' : '订阅专栏'}
                    </button>
                </div>
            `;
        }
    }

    renderArticles(articles) {
        const articlesContainer = document.querySelector('.article-list');
        const articlesHtml = articles.map(article => `
            <div class="article-item" data-article-id="${article.id}">
                ${this.isOwner ? '<i class="fas fa-grip-vertical drag-handle"></i>' : ''}
                <div class="article-content">
                    <h3>${article.title}</h3>
                    <p>${article.summary}</p>
                    <div class="article-meta">
                        <span><i class="far fa-clock"></i> ${article.createTime}</span>
                        <span><i class="far fa-eye"></i> ${article.viewCount}</span>
                        <span><i class="far fa-thumbs-up"></i> ${article.likeCount}</span>
                        <span><i class="far fa-star"></i> ${article.favoriteCount}</span>
                        <span><i class="far fa-comment"></i> ${article.commentCount}</span>
                    </div>
                </div>
                ${this.isOwner ? `
                    <div class="article-actions">
                        ${this.renderArticleStatusToggle(article)}
                        <button class="btn btn-danger btn-sm remove-article" data-article-id="${article.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                ` : ''}
            </div>
        `).join('');

        if (this.currentPage === 1) {
            articlesContainer.innerHTML = articlesHtml;
        } else {
            articlesContainer.insertAdjacentHTML('beforeend', articlesHtml);
        }

        if (this.isOwner) {
            this.initSortableList();
        }

        articles.forEach(article => {
            this.loadArticleStats(article.id);
        });
    }

    renderArticleStatusToggle(article) {
        return `
            <button class="btn btn-sm article-status-toggle ${article.status === 'published' ? 'btn-success' : 'btn-secondary'}"
                    data-status="${article.status === 'published' ? 'draft' : 'published'}">
                <i class="fas ${article.status === 'published' ? 'fa-eye' : 'fa-eye-slash'}"></i>
                ${article.status === 'published' ? '已发布' : '草稿'}
            </button>
        `;
    }

    showEditColumnModal() {
        const column = {
            title: document.querySelector('.column-info h1').textContent,
            description: document.querySelector('.column-info .description').textContent,
            coverImage: document.querySelector('.cover-image img').src
        };

        const modalContent = `
            <form id="editColumnForm" class="column-form">
                <div class="form-group">
                    <label for="columnTitle">专栏标题</label>
                    <input type="text" id="columnTitle" value="${column.title}" required>
                </div>
                <div class="form-group">
                    <label for="columnDescription">专栏描述</label>
                    <textarea id="columnDescription" required>${column.description}</textarea>
                </div>
                <div class="form-group">
                    <label for="columnCover">封面图片</label>
                    <input type="file" id="columnCover" accept="image/*">
                    <img src="${column.coverImage}" class="preview-image" alt="当前封面">
                </div>
                <button type="submit" class="btn btn-primary">保存修改</button>
            </form>
        `;

        this.showModal('编辑专栏', modalContent);
        this.initEditColumnEvents();
    }

    async showAddArticleModal() {
        try {
            const articles = await columnDetailApi.getMyAvailableArticles();
            const modalContent = this.renderAvailableArticles(articles);
            this.showModal('添加文章', modalContent);
            this.initAddArticleEvents();
        } catch (error) {
            this.showToast('获取可添加文章失败', 'error');
        }
    }

    renderAvailableArticles(articles) {
        return `
            <div class="available-articles">
                ${articles.map(article => `
                    <div class="article-item" data-id="${article.id}">
                        <div class="article-info">
                            <h4>${article.title}</h4>
                            <p>${article.summary || ''}</p>
                            <div class="article-meta">
                                <span><i class="far fa-eye"></i> ${article.viewCount}</span>
                                <span><i class="far fa-thumbs-up"></i> ${article.likeCount}</span>
                                <span><i class="far fa-comment"></i> ${article.commentCount}</span>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-sm add-to-column" data-id="${article.id}">
                            添加到专栏
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    showModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">${content}</div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
    }

    initEditColumnEvents() {
        const form = document.getElementById('editColumnForm');
        const coverInput = document.getElementById('columnCover');
        const previewImage = document.querySelector('.preview-image');

        coverInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => previewImage.src = e.target.result;
                reader.readAsDataURL(file);
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleEditColumn(new FormData(form));
        });
    }

    initAddArticleEvents() {
        document.querySelectorAll('.add-to-column').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const articleId = e.target.dataset.id;
                try {
                    await columnDetailApi.addArticleToColumn(this.columnId, articleId);
                    this.showToast('文章添加成功', 'success');
                    document.querySelector('.modal').remove();
                    this.loadColumnArticles(true);
                } catch (error) {
                    this.showToast('添加文章失败', 'error');
                }
            });
        });
    }

    initEventListeners() {
        document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
            this.loadColumnArticles();
        });

        document.getElementById('subscribeBtn')?.addEventListener('click', () => {
            this.handleSubscribe();
        });

        if (this.isOwner) {
            document.getElementById('editColumnBtn')?.addEventListener('click', () => {
                this.showEditColumnModal();
            });

            document.getElementById('addArticleBtn')?.addEventListener('click', () => {
                this.showAddArticleModal();
            });

            document.getElementById('deleteColumnBtn')?.addEventListener('click', () => {
                this.handleDeleteColumn();
            });

            document.querySelectorAll('.remove-article').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const articleId = e.target.closest('.remove-article').dataset.articleId;
                    this.handleRemoveArticle(articleId);
                });
            });

            document.querySelectorAll('.article-status-toggle').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const articleId = e.target.closest('.article-item').dataset.articleId;
                    const newStatus = e.target.dataset.status;
                    this.updateArticleStatus(articleId, newStatus);
                });
            });
        }
    }

    initSortableList() {
        const articleList = document.querySelector('.article-list');
        if (!articleList) return;

        new Sortable(articleList, {
            animation: 150,
            handle: '.drag-handle',
            onEnd: async (evt) => {
                const articleIds = Array.from(articleList.children).map(
                    item => item.dataset.articleId
                );
                await this.updateArticlesOrder(articleIds);
            }
        });
    }

    async handleSubscribe() {
        try {
            const btn = document.getElementById('subscribeBtn');
            const isSubscribed = btn.textContent.includes('取消订阅');

            if (isSubscribed) {
                await columnDetailApi.unsubscribeColumn(this.columnId);
                btn.innerHTML = '<i class="fas fa-star"></i> 订阅专栏';
                this.showToast('已取消订阅', 'success');
            } else {
                await columnDetailApi.subscribeColumn(this.columnId);
                btn.innerHTML = '<i class="fas fa-star"></i> 取消订阅';
                this.showToast('订阅成功', 'success');
            }
        } catch (error) {
            this.showToast('操作失败，请重试', 'error');
        }
    }

    async handleEditColumn(formData) {
        try {
            await columnDetailApi.updateColumn(this.columnId, formData);
            this.showToast('专栏更新成功', 'success');
            document.querySelector('.modal').remove();
            await this.loadColumnDetail();
        } catch (error) {
            this.showToast('更新专栏失败', 'error');
        }
    }

    async handleDeleteColumn() {
        if (!confirm('确定要删除这个专栏吗？此操作不可恢复。')) {
            return;
        }

        try {
            await columnDetailApi.deleteColumn(this.columnId);
            this.showToast('专栏已删除', 'success');
            setTimeout(() => {
                window.location.href = '/columns';
            }, 1500);
        } catch (error) {
            this.showToast('删除失败，请重试', 'error');
        }
    }

    // ... 前面的代码保持不变 ...

    async handleRemoveArticle(articleId) {
        if (!confirm('确定要从专栏中移除这篇文章吗？')) {
            return;
        }

        try {
            await columnDetailApi.removeArticleFromColumn(this.columnId, articleId);
            this.showToast('文章已移除', 'success');
            this.loadColumnArticles(true);
        } catch (error) {
            this.showToast('移除失败，请重试', 'error');
        }
    }

    async updateArticlesOrder(articleIds) {
        try {
            await columnDetailApi.updateArticlesOrder(this.columnId, articleIds);
            this.showToast('文章排序已更新', 'success');
        } catch (error) {
            this.showToast('更新排序失败', 'error');
            this.loadColumnArticles(true);
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    clearArticles() {
        document.querySelector('.article-list').innerHTML = '';
    }

    showLoadMoreButton() {
        document.getElementById('loadMoreBtn').style.display = 'inline-block';
    }

    hideLoadMoreButton() {
        document.getElementById('loadMoreBtn').style.display = 'none';
    }

    toggleLoadingState(isLoading) {
        const loadingSpinner = document.querySelector('.loading-spinner');
        if (loadingSpinner) {
            loadingSpinner.style.display = isLoading ? 'block' : 'none';
        }
    }

    // 清理事件监听器
    removeEventListeners() {
        const elements = [
            'loadMoreBtn',
            'subscribeBtn',
            'editColumnBtn',
            'addArticleBtn',
            'deleteColumnBtn'
        ];

        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.replaceWith(element.cloneNode(true));
            }
        });

        document.querySelectorAll('.remove-article, .article-status-toggle').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });
    }

    // 销毁实例
    destroy() {
        this.removeEventListeners();
        this.articleStats.clear();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new ColumnDetailPage();
});

export default ColumnDetailPage;