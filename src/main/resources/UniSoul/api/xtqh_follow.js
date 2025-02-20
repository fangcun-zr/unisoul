// // API基础URL
// const API_BASE_URL = 'http://localhost:8080';
// 关注相关的API请求
const xtqh_follow = {
    // 关注用户
    followUser: function(username) {
        return $.ajax({
            url: `${API_BASE_URL}/xtqh/follow?username=${encodeURIComponent(username)}`,
            type: 'GET',
            contentType: 'application/json'
        });
    },
// 取消关注
    unfollowUser: function(username) {
        return $.ajax({
            url: `${API_BASE_URL}/xtqh/unfollow`,
            type: 'GET',
            // headers: {
            //     'Authorization': localStorage.getItem('token')
            // },
            contentType: 'application/json',
            data: JSON.stringify({
                user_id: username
            })
        });
    }
};