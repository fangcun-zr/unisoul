const BASE_URL = 'http://localhost:8080';
const TOKEN_KEY = 'auth_token';

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

const columnDetailApi = {
    // 获取专栏详情
    getColumnDetail: async (columnId) => {
        const response = await fetch(`${BASE_URL}/columns/${columnId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    // 获取专栏文章列表
    getColumnArticles: async (columnId, page = 1, size = 10) => {
        const response = await fetch(
            `${BASE_URL}/columns/${columnId}/articles?page=${page}&size=${size}`,
            {
                method: 'GET',
                headers: getHeaders()
            }
        );
        return handleResponse(response);
    },

    // 获取我的可添加文章列表
    getMyAvailableArticles: async () => {
        const response = await fetch(`${BASE_URL}/columns/getMyArticles`, {
            method: 'GET',
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    // 订阅专栏
    subscribeColumn: async (columnId) => {
        const response = await fetch(`${BASE_URL}/columns/${columnId}/subscribe`, {
            method: 'POST',
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    // 取消订阅
    unsubscribeColumn: async (columnId) => {
        const response = await fetch(`${BASE_URL}/columns/${columnId}/subscribe`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    // 更新专栏信息
    updateColumn: async (columnId, formData) => {
        const response = await fetch(`${BASE_URL}/columns/${columnId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: formData
        });
        return handleResponse(response);
    },

    // 删除专栏
    deleteColumn: async (columnId) => {
        const response = await fetch(`${BASE_URL}/columns/${columnId}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    // 添加文章到专栏
    addArticleToColumn: async (columnId, articleId) => {
        const response = await fetch(`${BASE_URL}/columns/${columnId}/articles`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ articleId })
        });
        return handleResponse(response);
    },

    // 从专栏中移除文章
    removeArticleFromColumn: async (columnId, articleId) => {
        const response = await fetch(`${BASE_URL}/columns/${columnId}/articles/${articleId}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    // 更新文章排序
    updateArticlesOrder: async (columnId, articleIds) => {
        const response = await fetch(`${BASE_URL}/columns/${columnId}/articles/order`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ articleIds })
        });
        return handleResponse(response);
    },

    // 更新文章状态
    updateArticleStatus: async (articleId, status) => {
        const response = await fetch(`${BASE_URL}/columns/articles/${articleId}/status`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ status })
        });
        return handleResponse(response);
    },

    // 获取文章统计数据
    getArticleStats: async (articleId) => {
        const response = await fetch(`${BASE_URL}/columns/articles/${articleId}/stats`, {
            method: 'GET',
            headers: getHeaders()
        });
        return handleResponse(response);
    }
};

export default columnDetailApi;