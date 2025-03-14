const API_CONFIG = {
    BASE_URL: 'http://localhost:8080',
    TIMEOUT: 10000,
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

const MessageAPI = {
    sendMessage: function (data) {
        return $.ajax({
            url: `${API_CONFIG.BASE_URL}/messages/send`,
            type: 'POST',
            headers: API_CONFIG.HEADERS,
            timeout: API_CONFIG.TIMEOUT,
            data: JSON.stringify(data)
        });
    },

    getHistory: function (user1, user2, current, pageSize) {
        return $.ajax({
            url: `${API_CONFIG.BASE_URL}/messages/history`,
            type: 'GET',
            headers: API_CONFIG.HEADERS,
            timeout: API_CONFIG.TIMEOUT,
            data: { user1, user2, current, pageSize }
        });
    },

    getThreads: function (userId, current, pageSize) {
        return $.ajax({
            url: `${API_CONFIG.BASE_URL}/messages/threads`,
            type: 'GET',
            headers: API_CONFIG.HEADERS,
            timeout: API_CONFIG.TIMEOUT,
            data: { userId, current, pageSize }
        });
    },

    deleteMessage: function (messageId, deleteRequest) {
        return $.ajax({
            url: `${API_CONFIG.BASE_URL}/messages/${messageId}`,
            type: 'DELETE',
            headers: API_CONFIG.HEADERS,
            timeout: API_CONFIG.TIMEOUT,
            data: JSON.stringify(deleteRequest)
        });
    }
};

// 导出API
window.MessageAPI = MessageAPI;