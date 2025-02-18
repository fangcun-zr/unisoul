// 关注相关的API请求
const xtqh_follow = {
    // 关注用户
    followUser: function(userId) {
        return $.ajax({
            url: `${API_BASE_URL}/xtqh/follow`,
            type: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            contentType: 'application/json',
            data: JSON.stringify({
                user_id: userId
            })
        });
    },

    // 取消关注
    unfollowUser: function(userId) {
        return $.ajax({
            url: `${API_BASE_URL}/xtqh/unfollow`,
            type: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            contentType: 'application/json',
            data: JSON.stringify({
                user_id: userId
            })
        });
    }
};