// API基础配置
const BASE_URL = 'http://localhost:8080/api';
const TOKEN_KEY = 'auth_token';

// 工具函数
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '请求失败');
    }
    return response.json();
};

const getHeaders = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

// 发现页API
const discoverApi = {
    // 获取热门话题
    getHotTopics: async (page = 1, size = 10) => {
        try {
            const response = await fetch(`${BASE_URL}/topics/hot?page=${page}&size=${size}`, {
                method: 'GET',
                headers: getHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('获取热门话题失败:', error);
            throw error;
        }
    },

    // 获取推荐专家
    getRecommendedExperts: async (limit = 4) => {
        try {
            const response = await fetch(`${BASE_URL}/experts/recommended?limit=${limit}`, {
                method: 'GET',
                headers: getHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('获取推荐专家失败:', error);
            throw error;
        }
    },

    // 获取分类内容
    getCategoryContent: async (category, page = 1, size = 12) => {
        try {
            const response = await fetch(`${BASE_URL}/content/category/${category}?page=${page}&size=${size}`, {
                method: 'GET',
                headers: getHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('获取分类内容失败:', error);
            throw error;
        }
    },

    // 获取活动列表
    getEvents: async (status = 'upcoming', page = 1, size = 6) => {
        try {
            const response = await fetch(`${BASE_URL}/events?status=${status}&page=${page}&size=${size}`, {
                method: 'GET',
                headers: getHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('获取活动列表失败:', error);
            throw error;
        }
    },

    // 关注专家
    followExpert: async (expertId) => {
        try {
            const response = await fetch(`${BASE_URL}/experts/${expertId}/follow`, {
                method: 'POST',
                headers: getHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('关注专家失败:', error);
            throw error;
        }
    },

    // 取消关注专家
    unfollowExpert: async (expertId) => {
        try {
            const response = await fetch(`${BASE_URL}/experts/${expertId}/unfollow`, {
                method: 'POST',
                headers: getHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('取消关注失败:', error);
            throw error;
        }
    },

    // 报名活动
    joinEvent: async (eventId) => {
        try {
            const response = await fetch(`${BASE_URL}/events/${eventId}/join`, {
                method: 'POST',
                headers: getHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('活动报名失败:', error);
            throw error;
        }
    },

    // 获取轮播图数据
    getCarouselData: async () => {
        try {
            const response = await fetch(`${BASE_URL}/carousel`, {
                method: 'GET',
                headers: getHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('获取轮播图数据失败:', error);
            throw error;
        }
    },

    // 获取统计数据
    getStatistics: async () => {
        try {
            const response = await fetch(`${BASE_URL}/statistics`, {
                method: 'GET',
                headers: getHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('获取统计数据失败:', error);
            throw error;
        }
    },

    // 搜索内容
    searchContent: async (keyword, type = 'all', page = 1, size = 10) => {
        try {
            const response = await fetch(`${BASE_URL}/search?keyword=${keyword}&type=${type}&page=${page}&size=${size}`, {
                method: 'GET',
                headers: getHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('搜索内容失败:', error);
            throw error;
        }
    }
};

export default discoverApi;