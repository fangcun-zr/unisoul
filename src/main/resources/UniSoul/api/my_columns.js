// 我的专栏页面的API实现
const BASE_URL = 'http://localhost:8080';

// 获取用户的专栏列表
export async function getMyColumns(page = 1, pageSize = 10, sort = 'newest') {
    try {
        const response = await fetch(`${BASE_URL}/columns/myColumns?page=${page}&size=${pageSize}&sort=${sort}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('获取我的专栏列表失败');
        }

        const data = await response.json();
        if (data.code !== 1) {
            throw new Error(data.msg || '获取我的专栏列表失败');
        }

        return data.data;
    } catch (error) {
        console.error('获取我的专栏列表失败:', error);
        throw error;
    }
}

// 创建新专栏
export async function createColumn(columnData) {
    try {
        const response = await fetch(`${BASE_URL}/columns/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(columnData)
        });

        if (!response.ok) {
            throw new Error('创建专栏失败');
        }

        const data = await response.json();
        if (data.code !== 1) {
            throw new Error(data.msg || '创建专栏失败');
        }

        return data.data;
    } catch (error) {
        console.error('创建专栏失败:', error);
        throw error;
    }
}

// 更新专栏信息
export async function updateColumn(columnData) {
    try {
        const response = await fetch(`${BASE_URL}/columns/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(columnData)
        });

        if (!response.ok) {
            throw new Error('更新专栏失败');
        }

        const data = await response.json();
        if (data.code !== 1) {
            throw new Error(data.msg || '更新专栏失败');
        }

        return data.data;
    } catch (error) {
        console.error('更新专栏失败:', error);
        throw error;
    }
}

// 删除专栏
export async function deleteColumn(columnId) {
    try {
        const response = await fetch(`${BASE_URL}/columns/delete?id=${columnId}`, {
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
            throw new Error(data.msg || '删除专栏失败');
        }

        return data.data;
    } catch (error) {
        console.error('删除专栏失败:', error);
        throw error;
    }
}

// 获取用户的文章列表
export async function getMyArticles() {
    try {
        const response = await fetch(`${BASE_URL}/articles/myArticles`, {
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

        return data.data;
    } catch (error) {
        console.error('获取我的文章列表失败:', error);
        throw error;
    }
}

// 将文章添加到专栏
export async function addArticleToColumn(articleId, columnId) {
    try {
        const response = await fetch(`${BASE_URL}/articles/updateColumn`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                articleId,
                columnId
            })
        });

        if (!response.ok) {
            throw new Error('将文章添加到专栏失败');
        }

        const data = await response.json();
        if (data.code !== 1) {
            throw new Error(data.msg || '将文章添加到专栏失败');
        }

        return data.data;
    } catch (error) {
        console.error('将文章添加到专栏失败:', error);
        throw error;
    }
}

// 从专栏中移除文章
export async function removeArticleFromColumn(articleId, columnId) {
    try {
        const response = await fetch(`${BASE_URL}/articles/removeFromColumn`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                articleId,
                columnId
            })
        });

        if (!response.ok) {
            throw new Error('从专栏中移除文章失败');
        }

        const data = await response.json();
        if (data.code !== 1) {
            throw new Error(data.msg || '从专栏中移除文章失败');
        }

        return data.data;
    } catch (error) {
        console.error('从专栏中移除文章失败:', error);
        throw error;
    }
}

// 获取专栏统计信息
export async function getColumnStats() {
    try {
        const response = await fetch(`${BASE_URL}/columns/myStats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('获取专栏统计信息失败');
        }

        const data = await response.json();
        if (data.code !== 1) {
            throw new Error(data.msg || '获取专栏统计信息失败');
        }

        return data.data;
    } catch (error) {
        console.error('获取专栏统计信息失败:', error);
        throw error;
    }
}

// 获取专栏分类列表
export async function getColumnCategories() {
    try {
        const response = await fetch(`${BASE_URL}/columns/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('获取专栏分类列表失败');
        }

        const data = await response.json();
        if (data.code !== 1) {
            throw new Error(data.msg || '获取专栏分类列表失败');
        }

        return data.data;
    } catch (error) {
        console.error('获取专栏分类列表失败:', error);
        throw error;
    }
}