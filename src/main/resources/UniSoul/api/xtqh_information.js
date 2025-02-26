 // API_BASE_URL = "http://localhost:8080";

// 学途启航-个人信息相关的API请求
const xtqh_information = {
    // // 获取个人信息
    // getInformation: function() {
    //     return $.ajax({
    //         url: `${API_BASE_URL}/xtqh/information`,
    //         type: 'GET',
    //         headers: {
    //             'Authorization': localStorage.getItem('token')
    //         }
    //     });
    // },

    // 更新个人信息
    updateInformation: function(userData) {
        return $.ajax({
            url: `${API_BASE_URL}/xtqh/information`,
            type: 'POST',
            contentType: 'application/json',
            charset:'UTF-8',
            data: JSON.stringify({
                name: userData.name,
                gender: userData.gender,
                age: userData.age,
                school: userData.school,
                biography: userData.biography,
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
    },

    uploadAvatar: function (formData) {
        return $.ajax({
            url: `${API_BASE_URL}/xtqh/changeAvatar`,
            type: 'POST',
            enctype: 'multipart/form-data',
            data: formData,
            processData: false,  // 告诉jQuery不要处理发送的数据
            contentType: false   // 告诉jQuery不要设置Content-Type请求头
        });
    }

};