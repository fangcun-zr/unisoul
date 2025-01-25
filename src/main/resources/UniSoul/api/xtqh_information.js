// 学途启航-个人信息相关的API请求
const xtqh_information = {
    // 获取个人信息
    getInformation: function() {
        return $.ajax({
            url: `${API_BASE_URL}/xtqh/information`,
            type: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });
    },

    // 更新个人信息
    updateInformation: function(userData) {
        return $.ajax({
            url: `${API_BASE_URL}/xtqh/information`,
            type: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            contentType: 'application/json',
            data: JSON.stringify({
                name: userData.name,
                gender: userData.gender,
                age: userData.age,
                school: userData.school,
                biography: userData.biography,
                username: userData.username
            })
        });
    },

    // 获取点赞数
    getLikes: function() {
        return $.ajax({
            url: `${API_BASE_URL}/xtqh/likes`,
            type: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            data: {
                likeCount: "string"
            }
        });
    },

    // 获取粉丝列表
    getFollowers: function() {
        return $.ajax({
            url: `${API_BASE_URL}/xtqh/followers`,
            type: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            data: {
                followerName: "string"
            }
        });
    },

    // 获取关注列表
    getFollowing: function() {
        return $.ajax({
            url: `${API_BASE_URL}/xtqh/iFollow`,
            type: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            data: {
                iFollowName: "string"
            }
        });
    },

    // 发送私信
    sendPrivateMessage: function(messageData) {
        return $.ajax({
            url: `${API_BASE_URL}/xtqh/privateMessage`,
            type: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            data: {
                senderName: messageData.senderName
            }
        });
    }
};