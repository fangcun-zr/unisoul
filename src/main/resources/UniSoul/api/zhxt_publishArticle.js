// API 基础URL
const API_BASE_URL = 'http://localhost:8080';

// 文章发布相关的API封装
const publishArticle = {
    /**
     * 发布文章
     * @param {Object} articleData - 文章数据
     * @param {string} articleData.title - 文章标题
     * @param {string} articleData.content - 文章内容
     * @param {File} articleData.file - 封面图片文件
     * @param {string} articleData.category - 文章分类
     * @param {Array} articleData.tags - 文章标签
     * @param {boolean} articleData.allowComment - 是否允许评论
     * @param {boolean} articleData.isOriginal - 是否原创
     * @returns {Promise} 返回请求Promise
     */
    publish: function(articleData) {
        const formData = new FormData();

        // 添加基本信息
        formData.append('title', articleData.title);
        formData.append('content', articleData.content);

        // 添加封面图片
        if (articleData.file) {
            formData.append('file', articleData.file);
        }

        // 添加分类和标签
        if (articleData.category) {
            formData.append('category', articleData.category);
        }
        if (articleData.tags) {
            formData.append('tags', JSON.stringify(articleData.tags));
        }

        // 添加文章设置
        formData.append('allowComment', articleData.allowComment);
        formData.append('isOriginal', articleData.isOriginal);

        return $.ajax({
            url: `${API_BASE_URL}/zhxt/publish`,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            // headers: {
            //     'Authorization': localStorage.getItem('token')
            // }
        });
    },

    /**
     * 保存草稿
     * @param {Object} draftData - 草稿数据
     * @returns {Promise} 返回请求Promise
     */
    saveDraft: function(draftData) {
        const formData = new FormData();

        // 添加草稿内容
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

    /**
     * 获取草稿
     * @returns {Promise} 返回请求Promise
     */
    getDraft: function() {
        return $.ajax({
            url: `${API_BASE_URL}/zhxt/draft/get`,
            type: 'GET',
            // headers: {
            //     'Authorization': localStorage.getItem('token')
            // }
        });
    },

    /**
     * 上传图片
     * @param {File} file - 图片文件
     * @returns {Promise} 返回请求Promise
     */
    uploadImage: function(file) {
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
    },

    /**
     * 获取文章分类列表
     * @returns {Promise} 返回请求Promise
     */
    getCategories: function() {
        return $.ajax({
            url: `${API_BASE_URL}/zhxt/categories`,
            type: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });
    },

    /**
     * 获取推荐标签
     * @returns {Promise} 返回请求Promise
     */
    getSuggestedTags: function() {
        return $.ajax({
            url: `${API_BASE_URL}/zhxt/tags/suggested`,
            type: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });
    },

    /**
     * 预览文章
     * @param {Object} articleData - 文章数据
     * @returns {Promise} 返回请求Promise
     */
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
};

// 导出API模块
export default publishArticle;