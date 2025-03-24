// API配置
const API = {
    // 基础URL
    baseUrl: 'http://localhost:8080',

    // 获取个人信息
    getInformation: function() {
        return `${this.baseUrl}/xtqh/getinformation`;
    },

    // 更新个人信息
    updateInformation: function() {
        return `${this.baseUrl}/xtqh/information`;
    },

    // 获取粉丝列表
    getFansList: function() {
        return `${this.baseUrl}/xtqh/getFansList`;
    },

    // 获取关注列表
    getFollowList: function() {
        return `${this.baseUrl}/xtqh/getFollowList`;
    },

    // 关注用户
    followUser: function(userId) {
        return `${this.baseUrl}/xtqh/followUser?userId=${userId}`;
    },

    // 取消关注用户
    unfollowUser: function(userId) {
        return `${this.baseUrl}/xtqh/unfollowUser?userId=${userId}`;
    },

    // 获取个人中心信息
    getMyInformation: function() {
        return `${this.baseUrl}/xtqh/MyInformation`;
    },

    // 上传头像
    uploadAvatar: function() {
        return `${this.baseUrl}/xtqh/changeAvatar`;
    },

    // 获取我的文章
    getMyArticles: function() {
        return `${this.baseUrl}/xtqh/getMyArticles`;
    },

    // 获取我的数据统计
    getMyData: function() {
        return `${this.baseUrl}/zhxt/getMyData`;
    },

    // 获取收藏文章
    getCollectArticles: function() {
        return `${this.baseUrl}/xtqh/getCollectArticles`;
    },

    // 获取我的专栏
    getMyColumns: function() {
        return `${this.baseUrl}/columns/getMyColumns`;
    },

    // 获取测评历史
    getAssessmentHistory: function() {
        return `${this.baseUrl}/assessment/history`;
    },

    // 删除文章
    deleteArticle: function(articleId) {
        return `${this.baseUrl}/zhxt/deleteArticle?articleId=${articleId}`;
    }
};