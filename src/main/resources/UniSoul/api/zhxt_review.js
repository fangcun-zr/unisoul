// 文章审核相关的API请求
const review = {
    // 获取待审核文章列表
    getPendingList: function(page = 1, limit = 10) {
        return $.ajax({
            url: `${API_BASE_URL}/article/review/list`,
            type: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            data: {
                page: page,
                limit: limit,
                status: 'pending'
            }
        });
    },

    // 审核文章
    reviewArticle: function(articleId, action, comment) {
        return $.ajax({
            url: `${API_BASE_URL}/article/review`,
            type: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            contentType: 'application/json',
            data: JSON.stringify({
                article_id: articleId,
                action: action, // 'approve' 或 'reject'
                comment: comment
            })
        });
    },

    // 获取审核历史
    getReviewHistory: function(page = 1, limit = 10) {
        return $.ajax({
            url: `${API_BASE_URL}/article/review/history`,
            type: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            data: {
                page: page,
                limit: limit
            }
        });
    }
};