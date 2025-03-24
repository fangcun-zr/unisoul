// Consultation API Layer

const BASE_URL = 'http://localhost:8080';  // 设置后端基础URL

const ConsultAPI = {
    // 发送咨询消息
    // POST /consult/send
    // 请求体: {receiverId: string, content: string}
    sendMessage: function(receiverId, content) {
        console.log('调用API: sendMessage, 参数:', { receiverId, content });
        return $.ajax({
            url: `${BASE_URL}/consult/send`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                receiverId: receiverId,
                content: content
            })
        });
    },

    // 获取咨询消息历史
    // GET /consult/consultMessage?senderId=xxx&receiverId=xxx
    getMessages: function(senderId, receiverId) {
        console.log('调用API: getMessages, 参数:', { senderId, receiverId });
        return $.ajax({
            url: `${BASE_URL}/consult/consultMessage`,
            type: 'GET',
            data: {
                senderId: senderId,
                receiverId: receiverId
            }
        });
    },

    // 获取咨询师或用户列表
    // GET /consult/getCounselors?category=xxx
    // category: 1返回咨询师列表，0返回用户列表
    getCounselors: function(category) {
        // 确保category是数字: 1(咨询师) 或 0(用户)
        const numCategory = typeof category === 'string' ?
            (category === 'counselor' ? 1 : 0) :
            (category || 0);

        console.log('调用API: getCounselors, 参数:', { category: numCategory });
        return $.ajax({
            url: `${BASE_URL}/consult/getCounselors`,
            type: 'GET',
            data: {
                category: numCategory
            }
        });
    },

    // 删除消息
    // DELETE /consult/deleteMessage?contentId=xxx
    deleteMessage: function(contentId) {
        console.log('调用API: deleteMessage, 参数:', { contentId });
        return $.ajax({
            url: `${BASE_URL}/consult/deleteMessage`,
            type: 'DELETE',
            data: {
                contentId: contentId
            }
        });
    },

    // AI咨询
    // GET /consult/chat?question=xxx
    chatWithAI: function(question) {
        console.log('调用API: chatWithAI, 参数:', { question });
        return $.ajax({
            url: `${BASE_URL}/consult/chat`,
            type: 'GET',
            data: {
                question: question
            }
        });
    }
};