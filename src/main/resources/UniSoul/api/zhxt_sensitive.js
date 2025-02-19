// 敏感词相关的API请求
const sensitive = {
    // 获取敏感词列表
    getList: function(page = 1, limit = 10) {
        return $.ajax({
            url: `${API_BASE_URL}/sensitive/list`,
            type: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            data: {
                page: page,
                limit: limit
            }
        });
    },

    // 添加敏感词
    add: function(word) {
        return $.ajax({
            url: `${API_BASE_URL}/sensitive/add`,
            type: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            contentType: 'application/json',
            data: JSON.stringify({
                word: word
            })
        });
    },

    // 删除敏感词
    delete: function(wordId) {
        return $.ajax({
            url: `${API_BASE_URL}/sensitive/delete/${wordId}`,
            type: 'DELETE',
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });
    },

    // 批量导入敏感词
    import: function(file) {
        const formData = new FormData();
        formData.append('file', file);

        return $.ajax({
            url: `${API_BASE_URL}/sensitive/import`,
            type: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            data: formData,
            processData: false,
            contentType: false
        });
    }
};