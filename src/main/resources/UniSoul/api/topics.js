const API_BASE_URL = "http://localhost:8080"

const TopicsAPI = {
    // 创建话题
    createTopic: function (topicData) {
        return $.ajax({
            url: API_BASE_URL + '/topic/createTopic',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(topicData)
        });
    },

    // 回复话题
    replyTopic: function (replyData) {
        // 确保数据类型正确
        const requestData = {
            topicId: Number(replyData.topicId), // 确保是整数类型
            content: String(replyData.content), // 确保是字符串类型
            anonymous: Boolean(replyData.anonymous) // 确保是布尔类型
        };

        return $.ajax({
            url: API_BASE_URL + '/topic/replies',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData)
        });
    },

    // 获取所有话题
    getAllTopics: function () {
        return $.ajax({
            url: API_BASE_URL + '/topic/allTopic',
            method: 'GET'
        });
    },

    // 话题分页展示
    getTopics: function (page, pageSize, category_id, keyWords) {
        return $.ajax({
            url: API_BASE_URL + '/topic/list',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                page: page,
                pageSize: pageSize,
                category_id: category_id,
                keyWords: keyWords
            })
        });
    },

    // 获取话题评论
    getReplies: function (topicId) {
        return $.ajax({
            url: API_BASE_URL + '/topic/getReplies',
            method: 'GET',
            data: { topicId: topicId }
        });
    },

    // 点赞
    like: function (topicId, likeCount, isLike) {
        console.log('发送点赞请求，参数：', { topicId, likeCount, isLike });
        return $.ajax({
            url: API_BASE_URL + '/topic/likes',
            method: 'GET',
            data: {
                topicId: String(topicId),
                likeCount: Number(likeCount),
                isLike: Boolean(isLike)
            }
        });
    },

    // 获取总点赞数
    getAllLikeCounts: function () {
        return $.ajax({
            url: API_BASE_URL + '/topic/allLikeCounts',
            method: 'GET'
        });
    },

    // 获取总话题数
    getAllTopicCounts: function () {
        return $.ajax({
            url: API_BASE_URL + '/topic/allTopicCounts',
            method: 'GET'
        });
    },

    // 获取我的评论
    getMyReplies: function () {
        return $.ajax({
            url: API_BASE_URL + '/topic/getMyReplies',
            method: 'GET'
        });
    },

    // 获取总评论数
    getAllRepliesCounts: function () {
        return $.ajax({
            url: API_BASE_URL + '/topic/allRepliesCounts',
            method: 'GET'
        });
    },

    // 获取话题详情
    getTopicInformation: function (topicId) {
        return $.ajax({
            url: API_BASE_URL + '/topic/getTopicInformation',
            method: 'GET',
            data: { topicId: topicId }
        });
    },

    // 删除话题
    deleteTopic: function (topicId) {
        return $.ajax({
            url: API_BASE_URL + '/topic/deleteTopic',
            method: 'DELETE',
            data: { topicId: topicId }
        });
    },

    // 删除评论
    deleteReply: function (id) {
        return $.ajax({
            url: API_BASE_URL + '/topic/deleteReplies',
            method: 'DELETE',
            data: { id: id }
        });
    },

    // 获取所有标签
    getAllTags: function () {
        return $.ajax({
            url: API_BASE_URL + '/topic/AllTags',
            method: 'GET'
        });
    },

    // 通过标签获取话题
    getTopicsByTags: function (tagsName) {
        return $.ajax({
            url: API_BASE_URL + '/topic/getTopicsByTags',
            method: 'GET',
            data: { tagsName: tagsName }
        });
    },

    // 关键词搜索
    searchKeyWord: function (keyWord) {
        return $.ajax({
            url: API_BASE_URL + '/topic/searchKeyWord',
            method: 'GET',
            data: { keyWord: keyWord }
        });
    },

    // 获取最新话题
    getNewTopics: function () {
        return $.ajax({
            url: API_BASE_URL + '/topic/newTopics',
            method: 'GET'
        });
    }
};