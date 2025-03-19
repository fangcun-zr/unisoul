// 移除导入语句，直接使用fetch
// import { getColumnDetail, getColumnArticles, subscribeColumn, unsubscribeColumn } from '../api/column_detail.js';

class ColumnDetailPage {
    constructor() {
        this.columnId = this.getColumnIdFromUrl();
        this.currentPage = 1;
        this.currentSort = 'newest';
        this.hasMoreArticles = true;
        this.isLoading = false;
        this.isSubscribed = false;
        this.baseURL = 'http://localhost:8080';
        this.authorInfo = null;

        if (!this.columnId) {
            console.error('无法初始化页面: columnId无效');
            this.showError('未找到专栏ID，请重新进入');
            return;
        }

        console.log('初始化专栏详情页，专栏ID =', this.columnId);
        this.init();
    }

    async init() {
        try {
            if (!this.columnId) {
                console.error('init方法中检测到columnId无效');
                return; // 避免在无效ID时发送API请求
            }

            // 增加获取作者信息的调用
            await Promise.all([
                this.loadColumnDetail(),
                this.loadColumnArticles(true),
                this.loadColumnAuthor()
            ]);

            this.initEventListeners();
        } catch (error) {
            console.error('初始化页面失败:', error);
            this.showError('加载专栏信息失败，请刷新重试');
        }
    }

    // 从URL获取专栏ID
    getColumnIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        console.log('从URL获取专栏ID:', id);

        if (!id) {
            console.error('URL中缺少专栏ID参数');
            this.showError('未找到专栏ID，请返回列表页重新选择专栏');
            return null;
        }

        // 验证ID是否为有效数字
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
            console.error('URL中的专栏ID不是有效数字:', id);
            this.showError('专栏ID格式错误，请返回列表页重新选择专栏');
            return null;
        }

        return numericId;
    }

    // 获取专栏作者信息
    async loadColumnAuthor() {
        try {
            // 使用API文档中的获取专栏作者信息接口
            const response = await fetch(`${this.baseURL}/columns/getColumAuthor?column_id=${this.columnId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getToken()
                }
            });

            if (!response.ok) {
                throw new Error('获取专栏作者信息失败');
            }

            const data = await response.json();
            if (data.code !== 1) {
                throw new Error(data.msg || '获取专栏作者信息失败');
            }

            this.authorInfo = data.data;
            this.renderAuthorInfo(this.authorInfo);
            return data.data;
        } catch (error) {
            console.error('加载专栏作者信息失败:', error);
            this.showError('获取作者信息失败，请重试');
            throw error;
        }
    }

    // 渲染作者信息
    renderAuthorInfo(author) {
        if (!author) return;

        // 作者信息
        const authorAvatarElement = document.getElementById('authorAvatar');
        if (authorAvatarElement) {
            authorAvatarElement.src = author.avatarUrl || '../image/avatar.png';
            authorAvatarElement.alt = author.name || '作者头像';
        }

        const authorNameElement = document.getElementById('authorName');
        if (authorNameElement) {
            authorNameElement.textContent = author.name || '匿名作者';
        }

        const authorTitleElement = document.getElementById('authorTitle');
        if (authorTitleElement) {
            // 可以组合作者信息中的学校、简介等字段作为作者头衔
            let title = '';
            if (author.school) {
                title += author.school;
            }
            if (author.biography) {
                title += title ? ' · ' + author.biography : author.biography;
            }
            authorTitleElement.textContent = title || '暂无简介';
        }
    }

    // 加载专栏详情
    async loadColumnDetail() {
        try {
            // 使用新的API接口获取专栏详情
            const response = await fetch(`${this.baseURL}/columns/GetColumnDetail?columnId=${this.columnId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getToken()
                }
            });

            if (!response.ok) {
                throw new Error('获取专栏详情失败');
            }

            const data = await response.json();
            if (data.code !== 1) {
                throw new Error(data.msg || '获取专栏详情失败');
            }

            this.renderColumnDetail(data.data);
            return data.data;
        } catch (error) {
            console.error('加载专栏详情失败:', error);
            this.showError('获取专栏信息失败，请重试');
            throw error;
        }
    }

    // 加载专栏文章列表
    async loadColumnArticles(reset = false) {
        if (this.isLoading || (!this.hasMoreArticles && !reset)) return;

        try {
            this.isLoading = true;
            this.toggleLoadingState(true);

            const page = reset ? 1 : this.currentPage;
            const pageSize = 10;

            // 仍然使用原有的接口获取专栏文章列表
            const response = await fetch(`${this.baseURL}/columns/getThisArticles?id=${this.columnId}&page=${page}&size=${pageSize}&sort=${this.currentSort}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getToken()
                }
            });

            if (!response.ok) {
                throw new Error('获取专栏文章列表失败');
            }

            const data = await response.json();
            if (data.code !== 1) {
                throw new Error(data.msg || '获取专栏文章列表失败');
            }

            const articles = data.data || [];

            // 根据排序选项对文章进行排序
            const sortedArticles = this.sortArticles(articles, this.currentSort);

            if (reset) {
                this.clearArticleList();
            }

            this.renderArticleList(sortedArticles);

            // 更新加载更多按钮状态
            // 假设如果返回的文章数小于请求的pageSize，就没有更多文章了
            this.hasMoreArticles = articles.length >= pageSize;
            this.updateLoadMoreButton();

            if (!reset) {
                this.currentPage++;
            }

            return articles;
        } catch (error) {
            console.error('加载专栏文章列表失败:', error);
            this.showArticleListError('加载文章失败，请重试');
            throw error;
        } finally {
            this.isLoading = false;
            this.toggleLoadingState(false);
        }
    }

    // 根据选项对文章进行排序
    sortArticles(articles, sortOption) {
        if (!Array.isArray(articles)) return [];

        const clonedArticles = [...articles];

        switch (sortOption) {
            case 'newest':
                // 按发布时间降序排序
                return clonedArticles.sort((a, b) => {
                    const dateA = this.parseDate(a.create_time);
                    const dateB = this.parseDate(b.create_time);
                    return dateB - dateA;
                });
            case 'oldest':
                // 按发布时间升序排序
                return clonedArticles.sort((a, b) => {
                    const dateA = this.parseDate(a.create_time);
                    const dateB = this.parseDate(b.create_time);
                    return dateA - dateB;
                });
            case 'popular':
                // 按阅读量降序排序
                return clonedArticles.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
            default:
                return clonedArticles;
        }
    }

    // 解析日期
    parseDate(dateData) {
        if (!dateData) return new Date(0);

        if (Array.isArray(dateData) && dateData.length >= 3) {
            const [year, month, day] = dateData;
            return new Date(year, month - 1, day);
        }

        return new Date(dateData);
    }

    // 渲染专栏详情
    renderColumnDetail(column) {
        if (!column) {
            this.showError('未找到专栏信息');
            return;
        }

        // 更新页面标题
        document.title = `${column.title || '专栏详情'} - 学途心绘坊`;

        // 专栏基本信息
        const coverElement = document.getElementById('columnCover');
        if (coverElement) {
            coverElement.src = column.coverUrl || '../image/default-cover.jpg';
            coverElement.alt = column.title || '专栏封面';
        }

        const titleElement = document.getElementById('columnTitle');
        if (titleElement) {
            titleElement.textContent = column.title || '未命名专栏';
        }

        const categoryElement = document.getElementById('columnCategory');
        if (categoryElement) {
            // 根据分类ID获取分类名称
            const categoryNames = {
                1: '心理成长',
                2: '情感关系',
                3: '职业发展',
                4: '生活方式'
            };
            categoryElement.textContent = categoryNames[column.categoryId] || '未分类';
        }

        const ratingElement = document.getElementById('columnRating');
        if (ratingElement) {
            ratingElement.textContent = column.rating?.toFixed(1) || '暂无评分';
        }

        const articleCountElement = document.getElementById('articleCount');
        if (articleCountElement) {
            articleCountElement.textContent = column.articleCount || 0;
        }

        const subscriberCountElement = document.getElementById('subscriberCount');
        if (subscriberCountElement) {
            subscriberCountElement.textContent = column.subscribers || 0;
        }

        const createTimeElement = document.getElementById('createTime');
        if (createTimeElement) {
            // 处理日期时间格式，仅保留日期部分
            const createdAt = column.createdAt ? column.createdAt.split(' ')[0] : '';
            createTimeElement.textContent = createdAt || '未知日期';
        }

        const descriptionElement = document.getElementById('columnDescription');
        if (descriptionElement) {
            descriptionElement.textContent = column.description || '暂无描述';
        }

        // 不再在这里渲染作者信息，而是在loadColumnAuthor方法中处理

        // 更新订阅按钮状态 - 由于新API可能不返回isSubscribed字段，默认设为false
        this.updateSubscribeButton(column.isSubscribed || false);
    }

    // 渲染文章列表
    renderArticleList(articles) {
        const articleListElement = document.getElementById('articleList');
        if (!articleListElement) return;

        // 移除加载中提示
        const loadingElement = articleListElement.querySelector('.loading-spinner');
        if (loadingElement) {
            loadingElement.remove();
        }

        if (!Array.isArray(articles) || articles.length === 0) {
            articleListElement.innerHTML = '<div class="empty-message"><i class="fas fa-file-alt"></i><p>暂无文章</p></div>';
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

            // 限制标签数量，最多显示3个
            const displayTags = tags.slice(0, 3);
            let tagsHtml = displayTags.length > 0
                ? displayTags.map(tag => `<span class="article-tag">${tag}</span>`).join('')
                : '<span class="article-tag muted">无标签</span>';

            // 如果标签数量超过3个，显示+N标签
            if (tags.length > 3) {
                tagsHtml += `<span class="article-tag">+${tags.length - 3}</span>`;
            }

            // 处理日期
            const formattedDate = this.formatDate(article.create_time);

            // 处理文章标题，限制长度
            const maxTitleLength = 60;
            let title = article.title || '未命名文章';
            if (title.length > maxTitleLength) {
                title = title.substring(0, maxTitleLength) + '...';
            }

            // 处理文章摘要
            let summary = '';
            if (article.content) {
                // 移除HTML标签并截取前150个字符作为摘要
                summary = article.content.replace(/<[^>]*>/g, '').substring(0, 150);
                if (article.content.length > 150) {
                    summary += '...';
                }
            }

            return `
            <div class="article-item animate-fade-up">
                <div class="article-header">
                    <h3 class="article-title">
                        <a href="zhxt_article_details.html?id=${article.id}" title="${article.title || '未命名文章'}">${title}</a>
                    </h3>
                    <div class="article-meta">
                        <span><i class="far fa-calendar"></i> ${formattedDate}</span>
                    </div>
                </div>
                <p class="article-summary">${summary || '暂无内容'}</p>
                <div class="article-footer">
                    <div class="article-tags">
                        ${tagsHtml}
                    </div>
                    <div class="article-stats">
                        <span><i class="far fa-eye"></i> ${article.viewCount || 0}</span>
                        <span><i class="far fa-thumbs-up"></i> ${article.likeCount || 0}</span>
                        <span><i class="far fa-comment"></i> ${article.commentCount || 0}</span>
                    </div>
                </div>
            </div>
            `;
        }).join('');

        // 添加延迟显示动画效果
        const animationDelay = this.currentPage === 1 ? 0 : 300;

        setTimeout(() => {
            if (this.currentPage === 1) {
                articleListElement.innerHTML = articlesHtml;
            } else {
                articleListElement.insertAdjacentHTML('beforeend', articlesHtml);
            }

            // 让卡片依次显示动画
            const newArticleItems = articleListElement.querySelectorAll('.article-item:not(.animated)');
            newArticleItems.forEach((item, index) => {
                item.style.animationDelay = `${index * 0.1}s`;
                item.classList.add('animated');
            });
        }, animationDelay);
    }

    // 格式化日期
    formatDate(dateData) {
        if (!dateData) return '未知日期';

        let date;
        if (Array.isArray(dateData) && dateData.length >= 3) {
            const [year, month, day] = dateData;
            date = new Date(year, month - 1, day);
        } else {
            date = new Date(dateData);
        }

        if (isNaN(date.getTime())) return '未知日期';

        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    // 初始化事件监听
    initEventListeners() {
        // 排序选择改变事件
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                this.currentSort = sortSelect.value;
                this.currentPage = 1;
                this.loadColumnArticles(true);
            });
        }

        // 加载更多按钮点击事件
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadColumnArticles();
            });
        }

        // 订阅按钮点击事件
        const subscribeBtn = document.getElementById('subscribeBtn');
        if (subscribeBtn) {
            subscribeBtn.addEventListener('click', () => {
                this.toggleSubscription();
            });
        }
    }

    // 切换订阅状态
    async toggleSubscription() {
        const subscribeBtn = document.getElementById('subscribeBtn');
        if (!subscribeBtn) return;

        try {
            subscribeBtn.disabled = true;

            if (this.isSubscribed) {
                // 取消订阅
                await this.unsubscribeColumn(this.columnId);
                this.isSubscribed = false;
                this.showToast('已取消订阅');
            } else {
                // 订阅
                await this.subscribeColumn(this.columnId);
                this.isSubscribed = true;
                this.showToast('已成功订阅');
            }

            this.updateSubscribeButton(this.isSubscribed);
        } catch (error) {
            console.error('切换订阅状态失败:', error);
            this.showToast('操作失败，请稍后重试', 'error');
        } finally {
            subscribeBtn.disabled = false;
        }
    }

    // 订阅专栏
    async subscribeColumn(columnId) {
        try {
            const response = await fetch(`${this.baseURL}/columns/subscribe?id=${columnId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getToken()
                }
            });

            if (!response.ok) {
                throw new Error('订阅专栏失败');
            }

            const data = await response.json();
            if (data.code !== 1) {
                throw new Error(data.msg || '订阅专栏失败');
            }

            return data.data;
        } catch (error) {
            console.error('订阅专栏失败:', error);
            throw error;
        }
    }

    // 取消订阅专栏
    async unsubscribeColumn(columnId) {
        try {
            const response = await fetch(`${this.baseURL}/columns/unsubscribe?id=${columnId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getToken()
                }
            });

            if (!response.ok) {
                throw new Error('取消订阅专栏失败');
            }

            const data = await response.json();
            if (data.code !== 1) {
                throw new Error(data.msg || '取消订阅专栏失败');
            }

            return data.data;
        } catch (error) {
            console.error('取消订阅专栏失败:', error);
            throw error;
        }
    }

    // 更新订阅按钮状态
    updateSubscribeButton(isSubscribed) {
        this.isSubscribed = isSubscribed;

        const subscribeBtn = document.getElementById('subscribeBtn');
        if (!subscribeBtn) return;

        if (isSubscribed) {
            subscribeBtn.innerHTML = '<i class="fas fa-check"></i> 已订阅';
            subscribeBtn.classList.add('subscribed');
        } else {
            subscribeBtn.innerHTML = '<i class="fas fa-plus"></i> 订阅专栏';
            subscribeBtn.classList.remove('subscribed');
        }

        // 添加按钮点击的视觉反馈
        subscribeBtn.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });

        subscribeBtn.addEventListener('mouseup', function() {
            this.style.transform = '';
        });

        subscribeBtn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    }

    // 更新加载更多按钮状态
    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (!loadMoreBtn) return;

        if (this.hasMoreArticles) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }

    // 切换加载状态
    toggleLoadingState(isLoading) {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (!loadMoreBtn) return;

        if (isLoading) {
            loadMoreBtn.disabled = true;
            loadMoreBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 加载中...';
        } else {
            loadMoreBtn.disabled = false;
            loadMoreBtn.innerHTML = '<i class="fas fa-sync-alt"></i> 加载更多';
        }
    }

    // 清空文章列表
    clearArticleList() {
        const articleListElement = document.getElementById('articleList');
        if (articleListElement) {
            articleListElement.innerHTML = '';
        }
    }

    // 显示文章列表错误
    showArticleListError(message) {
        const articleListElement = document.getElementById('articleList');
        if (!articleListElement) return;

        const errorHtml = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
        `;

        articleListElement.innerHTML = errorHtml;
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

    // 获取Token
    getToken() {
        return localStorage.getItem('auth_token') || '';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new ColumnDetailPage();
});