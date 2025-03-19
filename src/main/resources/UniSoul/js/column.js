import columnApi from '../api/column.js';

class ColumnPage {


    constructor() {
        this.currentPage = 1;
        this.currentCategory = 0; // 初始值改为'0'与默认分类一致
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

    async loadFeaturedColumn(reset = false) {
        const params = {
            page: reset ? 1 : this.currentPage,
            categoryId: this.currentCategory // 统一参数名
        };
        try {
            const response = await columnApi.getFeaturedColumns(params);

            // 添加响应数据结构校验
            if (!response?.data?.records) {
                console.error('响应数据结构异常:', response);
                return;
            }

            // 修改判断逻辑：检查数组长度
            if (response.data.records.length > 0) {
                const featuredColumn = response.data.records[0];
                this.renderFeaturedColumn(featuredColumn);
            } else {
                console.log('当前分类下无精选专栏');
                document.querySelector('.featured-column').innerHTML = '暂无精选内容';
            }
        } catch (error) {
            console.error('加载精选专栏失败:', error);
            // 建议添加用户提示
            const container = document.querySelector('.featured-column');
            if (container) {
                container.innerHTML = '<div class="error">加载失败，请稍后重试</div>';
            }
        }
    }

    /**
     * 加载普通专栏
     * @param reset
     * @returns {Promise<void>}
     */
    async loadColumns(reset = false) {
        if (this.isLoading) return;

        try {
            this.isLoading = true;
            this.toggleLoadingState(true);


            const params = {
                page: reset ? 1 : this.currentPage,
                categoryId: this.currentCategory // 参数名改为categoryId
            };

            console.log('请求专栏列表，参数:', params);
            const response = await columnApi.getColumns(params);
            console.log('专栏列表API返回数据:', response);

            // 错误处理（根据你的API设计）
            if (response.code !== 1) {
                throw new Error(response.msg || '请求失败');
            }

            // 验证返回的数据包含records数组
            if (!response.data || !Array.isArray(response.data.records)) {
                console.error('API返回数据格式异常，缺少records数组:', response.data);
                throw new Error('API返回数据格式异常');
            }

            // 检查专栏ID的有效性
            const records = response.data.records;
            const validRecords = records.filter(record => !!record.id);

            if (validRecords.length < records.length) {
                console.warn(`检测到${records.length - validRecords.length}条数据缺少有效ID`);
            }

            console.log(`成功加载${validRecords.length}条有效专栏数据`);

            if (reset) {
                this.clearColumns();
            }

            // 传递正确的数据
            this.renderColumns(response.data.records);

            // // 计算是否还有更多数据
            // const total = response.data.total;
            // const currentTotal = (reset ? 0 : (this.currentPage - 1) * size) + response.data.records.length;
            // const hasMore = currentTotal < total;
            //
            // if (hasMore) {
            //     this.currentPage++;
            //     this.showLoadMoreButton();
            // } else {
            //     this.hideLoadMoreButton();
            // }
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
        // 添加可选链操作符防止未找到元素导致后续错误
        const featuredContainer = document.querySelector('.featured-column');
        if (!featuredContainer) {
            console.error('未找到.featured-column元素');
            return;
        }

        // 建议增加数据校验
        if (!column) {
            featuredContainer.innerHTML = '暂无精选专栏';
            return;
        }

        // 添加ID有效性检查
        if (!column.id) {
            console.error('精选专栏缺少有效ID:', column);
            featuredContainer.innerHTML = '专栏数据异常';
            return;
        }

        console.log('渲染精选专栏，ID =', column.id);

        // 使用createElement替代innerHTML提升安全性（可选）
        featuredContainer.innerHTML = `
<a class="column-card featured animate-fade-up" 
   href="column_detail.html?id=${column.id}" 
   style="display: block; text-decoration: none; color: inherit;">
    <div class="card-image">
        <img src="${column.coverUrl || 'default-cover.jpg'}" 
             alt="${column.title || '未命名专栏'}">
        <div class="featured-badge">
            <i class="fas fa-crown"></i> 精选
        </div>
    </div>
    <div class="card-content">
        <h3>${column.title || '未命名专栏'}</h3>
        <p>${column.description || '暂无描述'}</p>
        <div class="column-stats">
            <span><i class="fas fa-book-reader"></i> ${column.articleCount ?? 0} 篇文章</span>
            <span><i class="fas fa-user-friends"></i> ${column.subscribers ?? 0} 订阅</span>
            <span><i class="fas fa-star"></i> ${column.rating ?? '暂无'} 评分</span>
        </div>
    </div>
</a>
    `;
    }


    // 渲染普通专栏列表
    renderColumns(columns) {
        if (!Array.isArray(columns)) {
            console.error('接收到非数组数据:', columns);
            return;
        }

        const columnsContainer = document.querySelector('.regular-columns');
        if (!columnsContainer) {
            console.error('未找到.regular-columns元素');
            return;
        }

        // 过滤掉不带有效ID的专栏
        const validColumns = columns.filter(column => {
            if (!column.id) {
                console.error('专栏缺少有效ID:', column);
                return false;
            }
            return true;
        });

        if (validColumns.length === 0) {
            if (this.currentPage === 1) {
                columnsContainer.innerHTML = '<div class="empty-message">暂无专栏</div>';
            }
            return;
        }

        console.log('渲染普通专栏列表，数量 =', validColumns.length);

        const columnsHtml = validColumns.map(column => {
            console.log('渲染普通专栏，ID =', column.id);
            return `
    <a href="column_detail.html?id=${column.id}" class="column-link">
    <div class="column-card hover-scale animate-fade-up">
        <div class="card-image">
            <img src="${column.coverUrl || '../image/default-cover.jpg'}" alt="${column.title || '未命名专栏'}">
        </div>
        <div class="card-content">
            <h3>${column.title || '未命名专栏'}</h3>
            <p>${column.description || '暂无描述'}</p>
            <div class="column-stats">
                <span><i class="fas fa-book-reader"></i> ${column.articleCount || 0} 篇文章</span>
                <span><i class="fas fa-user-friends"></i> ${column.subscribers || 0} 订阅</span>
            </div>
        </div>
    </div>
</a>
`;
        }).join('');

        if (this.currentPage === 1) {
            columnsContainer.innerHTML = columnsHtml;
        } else {
            columnsContainer.insertAdjacentHTML('beforeend', columnsHtml);
        }
    }

    // 初始化事件监听
    initEventListeners() {
        // 分类切换使用事件委托
        document.querySelectorAll('.category-tabs').forEach(container => {
            container.addEventListener('click', (e) => {
                const tab = e.target.closest('.category-tab');
                if (!tab) return;

                const category = tab.dataset.categoryId;
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

    // 修改分类切换处理方法
    // 修改分类切换事件处理
    handleCategoryChange(category) {
        // 添加参数类型转换（确保与后端类型匹配）
        const categoryId = String(category); // 转换为字符串类型
        if (categoryId === this.currentCategory) return;

        // 更新UI选择逻辑
        document.querySelectorAll('.category-tab').forEach(tab => {
            const tabCategory = tab.dataset.categoryId;
            tab.classList.toggle('active', tabCategory === categoryId);
        });

        this.currentCategory = categoryId;
        this.currentPage = 1;

        // 添加加载状态
        this.toggleLoadingState(true);
        Promise.all([
            this.loadFeaturedColumn(true),
            this.loadColumns(true)
        ]).finally(() => {
            this.toggleLoadingState(false);
        });
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