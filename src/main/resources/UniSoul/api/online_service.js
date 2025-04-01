// Consultation API Layer

const BASE_URL = 'http://localhost:8080/api';  // 设置后端基础URL

// 添加全局错误处理
$.ajaxSetup({
    error: function (jqXHR, textStatus, errorThrown) {
        console.error('API请求失败:', {
            status: textStatus,
            error: errorThrown,
            response: jqXHR.responseText
        });
        showError('请求失败，请检查网络连接或联系管理员');
    }
});

const ConsultAPI = {
    // 发送咨询消息
    // POST /consult/send
    // 请求体: {receiverId: string, content: string}
    sendMessage: function (receiverId, content) {
        console.log('调用API: sendMessage, 参数:', { receiverId, content });
        return $.ajax({
            url: `${BASE_URL}/consult/send`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                receiverId: receiverId,
                content: content
            })
        });
    },

    // 获取咨询消息历史
    // GET /consult/consultMessage?senderId=xxx&receiverId=xxx
    getMessages: function (receiverId) {
        console.log('调用API: getMessages, 参数:', { receiverId });
        return $.ajax({
            url: `${BASE_URL}/consult/consultMessage`,
            method: 'GET',
            data: {
                receiverId: (String)receiverId
            }
        });
    },

    // 获取咨询师或用户列表
    // GET /consult/getCounselors?category=xxx
    // category: 1返回咨询师列表，0返回用户列表
    getCounselors: function (category) {
        // 确保category是数字: 1(咨询师) 或 0(用户)
        const numCategory = typeof category === 'string' ?
            (category === 'counselor' ? 1 : 0) :
            (category || 0);

        console.log('调用API: getCounselors, 参数:', { category: numCategory });
        return $.ajax({
            url: `${BASE_URL}/consult/getCounselors`,
            method: 'GET',
            data: { category: numCategory }
        });
    },

    // 删除消息
    // DELETE /consult/deleteMessage?contentId=xxx
    deleteMessage: function (messageId) {
        console.log('调用API: deleteMessage, 参数:', { messageId });
        return $.ajax({
            url: `${BASE_URL}/consult/deleteMessage`,
            method: 'DELETE',
            data: { messageId: messageId }
        });
    },

    // AI咨询
    // GET /consult/chat?question=xxx
    chatWithAI: function(question) {
        console.log('调用API: chatWithAI, 参数:', { question });
        return $.ajax({
            url: `http://localhost:8080/consult/chat`,
            type: 'GET',
            data: {
                question: question
            }
        });
    }

    // 获取聊天记录
    getChatHistory: function (userId, targetUserId) {
        console.log('调用API: getChatHistory, 参数:', { userId, targetUserId });
        return $.ajax({
            url: `${BASE_URL}/consult/chatHistory`,
            method: 'GET',
            data: {
                userId: userId,
                targetUserId: targetUserId
            }
        });
    },

    // 获取未读消息数
    getUnreadCount: function (userId) {
        console.log('调用API: getUnreadCount, 参数:', { userId });
        return $.ajax({
            url: `${BASE_URL}/consult/unreadCount`,
            method: 'GET',
            data: { userId: userId }
        });
    }
};

// 在线咨询相关的API调用
const OnlineServiceAPI = {
    // 发送咨询信息
    sendMessage: function (data) {
        return $.ajax({
            url: '/consult/send',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data)
        });
    },

    // 获取已咨询的消息
    getConsultMessage: function (receiverId) {
        return $.ajax({
            url: '/consult/consultMessage',
            method: 'GET',
            data: { receiverId }
        });
    },

    // 获取咨询师列表或用户列表
    getCounselors: function (category) {
        return $.ajax({
            url: '/consult/getCounselors',
            method: 'GET',
            data: { category }
        });
    },

    // 删除发送的消息
    deleteMessage: function (contentId) {
        return $.ajax({
            url: '/consult/deleteMessage',
            method: 'DELETE',
            data: { contentId }
        });
    },
};