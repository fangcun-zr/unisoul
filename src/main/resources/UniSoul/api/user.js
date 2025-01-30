// 用户相关的API请求
const user = {
    // 获取用户信息
    getInformation: function() {
        return $.ajax({
            url: `${API_BASE_URL}/xtqh/information`,
            type: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });
    },

    // 设置粉丝昵称
    setFanNickname: function(fanData) {
        return $.ajax({
            url: `${API_BASE_URL}/xtqh/fan_nickname`,
            type: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            contentType: 'application/json',
            data: JSON.stringify(fanData)
        });
    }
};