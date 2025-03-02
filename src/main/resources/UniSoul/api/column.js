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

// 专栏相关API
const columnApi = {
    // 获取专栏列表
    getColumns: async (params = {}) => {
        const { page = 1, size = 10, category = 'all', sort = 'latest' } = params;
        try {
            const response = await fetch(
                `${BASE_URL}/columns?page=${page}&size=${size}&category=${category}&sort=${sort}`,
                {
                    method: 'GET',
                    headers: getHeaders()
                }
            );
            return handleResponse(response);
        } catch (error) {
            console.error('获取专栏列表失败:', error);
            throw error;
        }
    },

    // 获取精选专栏
    getFeaturedColumns: async () => {
        try {
            const response = await fetch(`${BASE_URL}/columns/featured`, {
                method: 'GET',
                headers: getHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('获取精选专栏失败:', error);
            throw error;
        }
    },

    // 创建专栏
    createColumn: async (formData) => {
        try {
            const response = await fetch(`${BASE_URL}/columns`, {
                method: 'POST',
                headers: {
                    'Authorization': getHeaders().Authorization
                },
                body: formData
            });
            return handleResponse(response);
        } catch (error) {
            console.error('创建专栏失败:', error);
            throw error;
        }
    },

    // 订阅专栏
    subscribeColumn: async (columnId) => {
        try {
            const response = await fetch(`${BASE_URL}/columns/${columnId}/subscribe`, {
                method: 'POST',
                headers: getHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('订阅专栏失败:', error);
            throw error;
        }
    },

    // 取消订阅专栏
    unsubscribeColumn: async (columnId) => {
        try {
            const response = await fetch(`${BASE_URL}/columns/${columnId}/unsubscribe`, {
                method: 'POST',
                headers: getHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('取消订阅失败:', error);
            throw error;
        }
    },

    // 获取专栏详情
    getColumnDetail: async (columnId) => {
        try {
            const response = await fetch(`${BASE_URL}/columns/${columnId}`, {
                method: 'GET',
                headers: getHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('获取专栏详情失败:', error);
            throw error;
        }
    },

    // 获取专栏文章列表
    getColumnArticles: async (columnId, page = 1, size = 10) => {
        try {
            const response = await fetch(
                `${BASE_URL}/columns/${columnId}/articles?page=${page}&size=${size}`,
                {
                    method: 'GET',
                    headers: getHeaders()
                }
            );
            return handleResponse(response);
        } catch (error) {
            console.error('获取专栏文章列表失败:', error);
            throw error;
        }
    },

    // 获取专栏分类
    getCategories: async () => {
        try {
            const response = await fetch(`${BASE_URL}/columns/categories`, {
                method: 'GET',
                headers: getHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('获取专栏分类失败:', error);
            throw error;
        }
    },

    // 更新专栏信息
    updateColumn: async (columnId, data) => {
        try {
            const response = await fetch(`${BASE_URL}/columns/${columnId}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });
            return handleResponse(response);
        } catch (error) {
            console.error('更新专栏信息失败:', error);
            throw error;
        }
    },

    // 删除专栏
    deleteColumn: async (columnId) => {
        try {
            const response = await fetch(`${BASE_URL}/columns/${columnId}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('删除专栏失败:', error);
            throw error;
        }
    },

    // 获取专栏统计数据
    getColumnStats: async (columnId) => {
        try {
            const response = await fetch(`${BASE_URL}/columns/${columnId}/stats`, {
                method: 'GET',
                headers: getHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('获取专栏统计数据失败:', error);
            throw error;
        }
    }
};

export default columnApi;