// 点赞相关的API请求
const like = {
    // 点赞评论
    likeComment: function(employCommentId) {
        return $.ajax({
            url: `${API_BASE_URL}/zxwl/like`,
            type: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            contentType: 'application/json',
            data: JSON.stringify({
                employ_comment_id: employCommentId
            })
        });
    },

    // 获取点赞状态
    getLikeStatus: function(employCommentId) {
        return $.ajax({
            url: `${API_BASE_URL}/zxwl/like/status`,
            type: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            data: {
                employ_comment_id: employCommentId
            }
        });
    },

    // 获取点赞列表
    getLikeList: function(page = 1, limit = 10) {
        return $.ajax({
            url: `${API_BASE_URL}/zxwl/like/list`,
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