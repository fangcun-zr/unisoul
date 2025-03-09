// AI咨询相关的API请求
const AICounselorAPI = {
    // 发送消息
    sendMessage: function(data) {
        return $.ajax({
            url: '/api/ai/chat',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                sessionId: data.sessionId,
                message: data.message,
                timestamp: new Date().getTime()
            })
        });
    },

    // 获取历史会话列表
    getChatHistory: function() {
        return $.ajax({
            url: '/api/ai/history',
            method: 'GET'
        });
    },

    // 创建新会话
    createNewSession: function() {
        return $.ajax({
            url: '/api/ai/session/create',
            method: 'POST'
        });
    },

    // 删除会话
    deleteSession: function(sessionId) {
        return $.ajax({
            url: `/api/ai/session/${sessionId}`,
            method: 'DELETE'
        });
    },

    // 上传文件
    uploadFile: function(formData) {
        return $.ajax({
            url: '/api/ai/upload',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false
        });
    },

    // 获取会话详情
    getSessionDetail: function(sessionId) {
        return $.ajax({
            url: `/api/ai/session/${sessionId}`,
            method: 'GET'
        });
    }
};