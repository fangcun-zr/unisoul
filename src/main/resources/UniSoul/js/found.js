import discoverApi from '../api/discover.js';

class DiscoverPage {
    constructor() {
        this.currentPage = 1;
        this.isLoading = false;
        this.init();
    }

    async init() {
        try {
            await Promise.all([
                this.initCarousel(),
                this.loadHotTopics(),
                this.loadRecommendedExperts(),
                this.loadEvents(),
                this.loadStatistics()
            ]);
            this.initEventListeners();
        } catch (error) {
            console.error('初始化失败:', error);
            this.showError('页面初始化失败，请刷新重试');
        }
    }

    // 初始化轮播图
    async initCarousel() {
        try {
            const carouselData = await discoverApi.getCarouselData();
            const carouselContainer = document.querySelector('.featured-carousel');

            if (carouselData.length > 0) {
                const carouselHtml = carouselData.map((item, index) => `
                    <div class="carousel-item ${index === 0 ? 'active' : ''}">
                        <div class="featured-card">
                            <img src="${item.image}" class="featured-image" alt="${item.title}">
                            <div class="featured-content">
                                <span class="featured-tag">${item.tag}</span>
                                <h2>${item.title}</h2>
                                <p>${item.description}</p>
                                <div class="featured-stats">
                                    <span><i class="fas fa-eye"></i> ${item.views}</span>
                                    <span><i class="fas fa-heart"></i> ${item.likes}</span>
                                    <span><i class="fas fa-comment"></i> ${item.comments}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('');

                carouselContainer.innerHTML = carouselHtml;

                // 初始化Bootstrap轮播
                new bootstrap.Carousel(carouselContainer, {
                    interval: 5000,
                    ride: true
                });
            }
        } catch (error) {
            console.error('加载轮播图失败:', error);
        }
    }

    // 加载热门话题
    async loadHotTopics() {
        try {
            const topics = await discoverApi.getHotTopics();
            const trendingList = document.querySelector('.trending-panel .trending-list');

            const topicsHtml = topics.map((topic, index) => `
                <div class="trending-item">
                    <div class="trending-rank">${index + 1}</div>
                    <div class="trending-content">
                        <h4>${topic.title}</h4>
                        <div class="trending-stats">
                            <span><i class="fas fa-fire"></i> ${topic.heat}</span>
                            <span><i class="fas fa-comment"></i> ${topic.discussions}</span>
                        </div>
                    </div>
                </div>
            `).join('');

            trendingList.innerHTML = topicsHtml;
        } catch (error) {
            console.error('加载热门话题失败:', error);
        }
    }

    // 加载推荐专家
    async loadRecommendedExperts() {
        try {
            const experts = await discoverApi.getRecommendedExperts();
            const expertsGrid = document.querySelector('.expert-grid');

            const expertsHtml = experts.map(expert => `
                <div class="expert-card">
                    <img src="${expert.avatar}" class="expert-avatar" alt="${expert.name}">
                    <h4>${expert.name}</h4>
                    <p>${expert.title}</p>
                    <div class="expert-stats">
                        <span>${expert.articles} 文章</span>
                        <span>${expert.followers} 关注者</span>
                    </div>
                    <button class="btn btn-follow" data-expert-id="${expert.id}">
                        ${expert.isFollowing ? '已关注' : '+ 关注'}
                    </button>
                </div>
            `).join('');

            expertsGrid.innerHTML = expertsHtml;
        } catch (error) {
            console.error('加载推荐专家失败:', error);
        }
    }

    // 加载活动列表
    async loadEvents() {
        try {
            const events = await discoverApi.getEvents();
            const eventsGrid = document.querySelector('.event-grid');

            const eventsHtml = events.map(event => `
                <div class="event-card">
                    <div class="event-date">
                        <span class="date">${new Date(event.date).getDate()}</span>
                        <span class="month">${new Date(event.date).toLocaleString('zh-CN', { month: 'short' })}</span>
                    </div>
                    <div class="event-info">
                        <h4>${event.title}</h4>
                        <p>${event.description}</p>
                        <div class="event-meta">
                            <span><i class="fas fa-users"></i> ${event.participants}人参与</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                        </div>
                    </div>
                    <button class="btn btn-join" data-event-id="${event.id}">
                        立即报名
                    </button>
                </div>
            `).join('');

            eventsGrid.innerHTML = eventsHtml;
        } catch (error) {
            console.error('加载活动列表失败:', error);
        }
    }

    // 加载统计数据
    async loadStatistics() {
        try {
            const stats = await discoverApi.getStatistics();
            // 更新统计数据显示
            Object.entries(stats).forEach(([key, value]) => {
                const element = document.querySelector(`#${key}Count`);
                if (element) {
                    element.textContent = value.toLocaleString();
                }
            });
        } catch (error) {
            console.error('加载统计数据失败:', error);
        }
    }

    // 初始化事件监听
    initEventListeners() {
        // 关注按钮点击事件
        document.querySelectorAll('.btn-follow').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const expertId = e.target.dataset.expertId;
                const isFollowing = e.target.textContent.trim() === '已关注';

                try {
                    if (isFollowing) {
                        await discoverApi.unfollowExpert(expertId);
                        e.target.textContent = '+ 关注';
                    } else {
                        await discoverApi.followExpert(expertId);
                        e.target.textContent = '已关注';
                    }
                } catch (error) {
                    this.showError('操作失败，请稍后重试');
                }
            });
        });

        // 活动报名按钮点击事件
        document.querySelectorAll('.btn-join').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const eventId = e.target.dataset.eventId;
                try {
                    await discoverApi.joinEvent(eventId);
                    e.target.textContent = '已报名';
                    e.target.disabled = true;
                } catch (error) {
                    this.showError('报名失败，请稍后重试');
                }
            });
        });

        // 搜索功能
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(async (e) => {
                const keyword = e.target.value.trim();
                if (keyword) {
                    try {
                        const results = await discoverApi.searchContent(keyword);
                        this.updateSearchResults(results);
                    } catch (error) {
                        console.error('搜索失败:', error);
                    }
                }
            }, 300));
        }
    }

    // 工具方法
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    showError(message) {
        // 使用Bootstrap的Toast显示错误信息
        const toast = new bootstrap.Toast(document.querySelector('.toast'));
        document.querySelector('.toast-body').textContent = message;
        toast.show();
    }

    updateSearchResults(results) {
        // 更新搜索结果显示
        const searchResults = document.querySelector('.search-results');
        if (searchResults) {
            searchResults.innerHTML = results.map(result => `
                <div class="search-result-item">
                    <h5>${result.title}</h5>
                    <p>${result.description}</p>
                </div>
            `).join('');
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new DiscoverPage();
});