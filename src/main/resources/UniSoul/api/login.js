(function() {
    const API_BASE_URL = 'http://localhost:8080';

    window.auth = {
        // 登录请求
        login: function (username, password) {
            return $.ajax({
                url: `${API_BASE_URL}/xtqh/login`, // 后端登录接口路径
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    username: username,
                    password: password
                })
            });
        }
    };
})();
