// help-center-api.js

const API_BASE_URL = 'https://your-api-endpoint.com'; // 替换为你的API基础URL

const HelpCenterAPI = {
    // 获取热门问题
    getHotQuestions: function() {
        return $.ajax({
            url: `${API_BASE_URL}/hot-questions`,
            method: 'GET',
            dataType: 'json'
        });
    },

    // 获取帮助分类内容
    getHelpContent: function(category) {
        return $.ajax({
            url: `${API_BASE_URL}/help-content`,
            method: 'GET',
            data: { category: category },
            dataType: 'json'
        });
    },

    // 提交反馈
    submitFeedback: function(feedbackData) {
        return $.ajax({
            url: `${API_BASE_URL}/submit-feedback`,
            method: 'POST',
            data: JSON.stringify(feedbackData),
            contentType: 'application/json',
            dataType: 'json'
        });
    },

    // 获取聊天记录
    getChatMessages: function() {
        return $.ajax({
            url: `${API_BASE_URL}/chat-messages`,
            method: 'GET',
            dataType: 'json'
        });
    },

    // 发送聊天消息
    sendChatMessage: function(message) {
        return $.ajax({
            url: `${API_BASE_URL}/send-message`,
            method: 'POST',
            data: JSON.stringify({ message: message }),
            contentType: 'application/json',
            dataType: 'json'
        });
    }
};

// 导出API对象
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HelpCenterAPI;
}