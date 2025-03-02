// API 基础URL
const API_BASE_URL = 'http://localhost:8080';

// 统一的API封装
const api = {
    // 文章相关API
    article: {
        // 获取文章列表
        getList: function(params = {}) {
            return $.ajax({
                url: `${API_BASE_URL}/api/articles`,
                type: 'GET',
                data: params,
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        },

        // 获取文章详情
        getDetail: function(articleId) {
            return $.ajax({
                url: `${API_BASE_URL}/api/articles/${articleId}`,
                type: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        },

        // 发布文章
        publish: function(articleData) {
            const formData = new FormData();

            formData.append('title', articleData.title);
            formData.append('content', articleData.content);

            if (articleData.file) {
                formData.append('file', articleData.file);
            }

            if (articleData.category) {
                formData.append('category', articleData.category);
            }

            if (articleData.tags) {
                formData.append('tags', JSON.stringify(articleData.tags));
            }

            formData.append('allowComment', articleData.allowComment);
            formData.append('isOriginal', articleData.isOriginal);

            return $.ajax({
                url: `${API_BASE_URL}/zhxt/publish`,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        },

        // 保存草稿
        saveDraft: function(draftData) {
            const formData = new FormData();

            formData.append('title', draftData.title);
            formData.append('content', draftData.content);

            if (draftData.file) {
                formData.append('file', draftData.file);
            }
            if (draftData.category) {
                formData.append('category', draftData.category);
            }
            if (draftData.tags) {
                formData.append('tags', JSON.stringify(draftData.tags));
            }

            return $.ajax({
                url: `${API_BASE_URL}/zhxt/draft/save`,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        },

        // 获取草稿
        getDraft: function() {
            return $.ajax({
                url: `${API_BASE_URL}/zhxt/draft/get`,
                type: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        },

        // 点赞文章
        like: function(articleId) {
            return $.ajax({
                url: `${API_BASE_URL}/api/articles/${articleId}/like`,
                type: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        },

        // 收藏文章
        collect: function(articleId) {
            return $.ajax({
                url: `${API_BASE_URL}/api/articles/${articleId}/collect`,
                type: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        },

        // 获取评论列表
        getComments: function(articleId, params = {}) {
            return $.ajax({
                url: `${API_BASE_URL}/api/articles/${articleId}/comments`,
                type: 'GET',
                data: params,
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        },

        // 发表评论
        addComment: function(articleId, content) {
            return $.ajax({
                url: `${API_BASE_URL}/api/articles/${articleId}/comments`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ content }),
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        },

        // 预览文章
        preview: function(articleData) {
            return $.ajax({
                url: `${API_BASE_URL}/zhxt/preview`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(articleData),
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        }
    },

    // 用户相关API
    user: {
        // 获取用户信息
        getInfo: function() {
            return $.ajax({
                url: `${API_BASE_URL}/api/user/info`,
                type: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        },

        // 更新用户信息
        updateInfo: function(userData) {
            return $.ajax({
                url: `${API_BASE_URL}/api/user/info`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(userData),
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        },

        // 关注用户
        follow: function(userId) {
            return $.ajax({
                url: `${API_BASE_URL}/api/user/follow/${userId}`,
                type: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        },

        // 取消关注
        unfollow: function(userId) {
            return $.ajax({
                url: `${API_BASE_URL}/api/user/unfollow/${userId}`,
                type: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        }
    },

    // 通知相关API
    notification: {
        // 获取通知列表
        getList: function(params = {}) {
            return $.ajax({
                url: `${API_BASE_URL}/api/user/notifications`,
                type: 'GET',
                data: params,
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        },

        // 标记通知为已读
        markAsRead: function(notificationId) {
            return $.ajax({
                url: `${API_BASE_URL}/api/user/notifications/${notificationId}/read`,
                type: 'PUT',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        },

        // 标记所有通知为已读
        markAllAsRead: function() {
            return $.ajax({
                url: `${API_BASE_URL}/api/user/notifications/read-all`,
                type: 'PUT',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        }
    },

    // 上传相关API
    upload: {
        // 上传图片
        image: function(file) {
            const formData = new FormData();
            formData.append('image', file);

            return $.ajax({
                url: `${API_BASE_URL}/zhxt/upload/image`,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        }
    },

    // 分类和标签API
    category: {
        // 获取分类列表
        getList: function() {
            return $.ajax({
                url: `${API_BASE_URL}/zhxt/categories`,
                type: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        }
    },

    tag: {
        // 获取推荐标签
        getSuggested: function() {
            return $.ajax({
                url: `${API_BASE_URL}/zhxt/tags/suggested`,
                type: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        }
    }
};

// 导出API模块
export default api;