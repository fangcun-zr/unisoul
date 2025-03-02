import columnApi from '../api/column.js';

class ColumnPage {
    constructor() {
        this.currentPage = 1;
        this.currentCategory = 'all';
        this.isLoading = false;
        this.init();
    }

    async init() {
        try {
            await Promise.all([
                this.loadFeaturedColumn(),
                this.loadColumns(),
                this.initEventListeners()
            ]);
        } catch (error) {
            console.error('初始化失败:', error);
            this.showToast('页面初始化失败，请刷新重试', 'error');
        }
    }

    // 加载精选专栏
    async loadFeaturedColumn() {
        try {
            const featured = await columnApi.getFeaturedColumns();
            if (featured.length > 0) {
                const featuredColumn = featured[0];
                this.renderFeaturedColumn(featuredColumn);
            }
        } catch (error) {
            console.error('加载精选专栏失败:', error);
        }
    }

    // 加载普通专栏列表
    async loadColumns(reset = false) {
        if (this.isLoading) return;

        try {
            this.isLoading = true;
            this.toggleLoadingState(true);

            const params = {
                page: reset ? 1 : this.currentPage,
                category: this.currentCategory
            };

            const response = await columnApi.getColumns(params);

            if (reset) {
                this.clearColumns();
            }

            this.renderColumns(response.data);

            if (response.hasMore) {
                this.currentPage++;
                this.showLoadMoreButton();
            } else {
                this.hideLoadMoreButton();
            }
        } catch (error) {
            console.error('加载专栏列表失败:', error);
            this.showToast('加载专栏失败，请稍后重试', 'error');
        } finally {
            this.isLoading = false;
            this.toggleLoadingState(false);
        }
    }

    // 渲染精选专栏
    renderFeaturedColumn(column) {
        const featuredContainer = document.querySelector('.featured-column');
        featuredContainer.innerHTML = `
            <div class="column-card featured animate-fade-up">
                <div class="card-image">
                    <img src="${column.coverImage}" alt="${column.title}">
                    <div class="featured-badge">
                        <i class="fas fa-crown"></i> 精选
                    </div>
                </div>
                <div class="card-content">
                    <div class="author-info">
                        <img src="${column.author.avatar}" alt="${column.author.name}" class="author-avatar">
                        <div class="author-details">
                            <h4>${column.author.name}</h4>
                            <p>${column.author.title}</p>
                        </div>
                    </div>
                    <h3>${column.title}</h3>
                    <p>${column.description}</p>
                    <div class="column-stats">
                        <span><i class="fas fa-book-reader"></i> ${column.articleCount} 篇文章</span>
                        <span><i class="fas fa-user-friends"></i> ${column.subscriberCount} 订阅</span>
                        <span><i class="fas fa-star"></i> ${column.rating} 评分</span>
                    </div>
                </div>
            </div>
        `;
    }

    // 渲染普通专栏列表
    renderColumns(columns) {
        const columnsContainer = document.querySelector('.regular-columns');
        const columnsHtml = columns.map(column => `
            <div class="column-card hover-scale animate-fade-up">
                <div class="card-image">
                    <img src="${column.coverImage}" alt="${column.title}">
                </div>
                <div class="card-content">
                    <div class="author-info">
                        <img src="${column.author.avatar}" alt="${column.author.name}" class="author-avatar">
                        <div class="author-details">
                            <h4>${column.author.name}</h4>
                            <p>${column.author.title}</p>
                        </div>
                    </div>
                    <h3>${column.title}</h3>
                    <p>${column.description}</p>
                    <div class="column-stats">
                        <span><i class="fas fa-book-reader"></i> ${column.articleCount} 篇文章</span>
                        <span><i class="fas fa-user-friends"></i> ${column.subscriberCount} 订阅</span>
                    </div>
                </div>
            </div>
        `).join('');

        if (this.currentPage === 1) {
            columnsContainer.innerHTML = columnsHtml;
        } else {
            columnsContainer.insertAdjacentHTML('beforeend', columnsHtml);
        }
    }

    // 初始化事件监听
    initEventListeners() {
        // 分类切换
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.handleCategoryChange(category);
            });
        });

        // 加载更多
        document.getElementById('loadMoreBtn').addEventListener('click', () => {
            this.loadColumns();
        });

        // 创建专栏
        document.getElementById('createColumnBtn').addEventListener('click', () => {
            this.showCreateColumnModal();
        });

        // 提交创建专栏表单
        document.getElementById('submitColumn').addEventListener('click', () => {
            this.handleCreateColumn();
        });
    }

    // 处理分类切换
    handleCategoryChange(category) {
        if (category === this.currentCategory) return;

        // 更新UI
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === category);
        });

        this.currentCategory = category;
        this.currentPage = 1;
        this.loadColumns(true);
    }

    // 创建专栏表单处理
    async handleCreateColumn() {
        const form = document.getElementById('columnForm');
        const formData = new FormData(form);

        try {
            const response = await columnApi.createColumn(formData);
            this.showToast('专栏创建成功！', 'success');
            this.hideCreateColumnModal();
            this.loadColumns(true);
        } catch (error) {
            this.showToast('创建专栏失败，请重试', 'error');
        }
    }

    // 工具方法
    clearColumns() {
        document.querySelector('.regular-columns').innerHTML = '';
    }

    showLoadMoreButton() {
        document.getElementById('loadMoreBtn').style.display = 'inline-block';
    }

    hideLoadMoreButton() {
        document.getElementById('loadMoreBtn').style.display = 'none';
    }

    toggleLoadingState(isLoading) {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (isLoading) {
            loadMoreBtn.classList.add('loading');
            loadMoreBtn.disabled = true;
        } else {
            loadMoreBtn.classList.remove('loading');
            loadMoreBtn.disabled = false;
        }
    }

    showCreateColumnModal() {
        const modal = new bootstrap.Modal(document.getElementById('createColumnModal'));
        modal.show();
    }

    hideCreateColumnModal() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('createColumnModal'));
        modal.hide();
    }

    showToast(message, type = 'info') {
        const toast = document.querySelector('.toast');
        const toastBody = toast.querySelector('.toast-body');

        toast.classList.remove('bg-success', 'bg-danger');
        toast.classList.add(type === 'success' ? 'bg-success' : 'bg-danger');
        toastBody.textContent = message;

        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new ColumnPage();
});