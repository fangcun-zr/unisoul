// // API 基础URL
// const API_BASE_URL = 'localhost:8080';
//
// // 统一的API封装
// const api = {
//     // 用户相关API
//     user: {
//         // 获取用户信息
//         getInfo: function() {
//             return $.ajax({
//                 url: `${API_BASE_URL}/user/info`,
//                 type: 'GET',
//                 headers: {
//                     'Authorization': localStorage.getItem('token')
//                 }
//             });
//         },
//
//         // 更新用户信息
//         updateInfo: function(userData) {
//             return $.ajax({
//                 url: `${API_BASE_URL}/user/info`,
//                 type: 'PUT',
//                 contentType: 'application/json',
//                 data: JSON.stringify(userData),
//                 headers: {
//                     'Authorization': localStorage.getItem('token')
//                 }
//             });
//         },
//
//         // 关注用户
//         follow: function(userId) {
//             return $.ajax({
//                 url: `${API_BASE_URL}/user/follow/${userId}`,
//                 type: 'POST',
//                 headers: {
//                     'Authorization': localStorage.getItem('token')
//                 }
//             });
//         },
//
//         // 取消关注
//         unfollow: function(userId) {
//             return $.ajax({
//                 url: `${API_BASE_URL}/user/unfollow/${userId}`,
//                 type: 'POST',
//                 headers: {
//                     'Authorization': localStorage.getItem('token')
//                 }
//             });
//         }
//     },
//
//     // 通知相关API
//     notification: {
//         // 获取通知列表
//         getList: function(params = {}) {
//             return $.ajax({
//                 url: `${API_BASE_URL}/user/notifications`,
//                 type: 'GET',
//                 data: params,
//                 headers: {
//                     'Authorization': localStorage.getItem('token')
//                 }
//             });
//         },
//
//         // 标记通知为已读
//         markAsRead: function(notificationId) {
//             return $.ajax({
//                 url: `${API_BASE_URL}/user/notifications/${notificationId}/read`,
//                 type: 'PUT',
//                 headers: {
//                     'Authorization': localStorage.getItem('token')
//                 }
//             });
//         },
//
//         // 标记所有通知为已读
//         markAllAsRead: function() {
//             return $.ajax({
//                 url: `${API_BASE_URL}/user/notifications/read-all`,
//                 type: 'PUT',
//                 headers: {
//                     'Authorization': localStorage.getItem('token')
//                 }
//             });
//         }
//     },
//
//     // 上传相关API
//     upload: {
//         // 上传图片
//         image: function(file) {
//             const formData = new FormData();
//             formData.append('image', file);
//
//             return $.ajax({
//                 url: `${API_BASE_URL}/zhxt/upload/image`,
//                 type: 'POST',
//                 data: formData,
//                 processData: false,
//                 contentType: false,
//                 // headers: {
//                 //     'Authorization': localStorage.getItem('token')
//                 // }
//             });
//         }
//     },
//
//     // 分类和标签API
//     category: {
//         // 获取分类列表
//         getList: function() {
//             return $.ajax({
//                 url: `${API_BASE_URL}/zhxt/categories`,
//                 type: 'GET',
//                 headers: {
//                     'Authorization': localStorage.getItem('token')
//                 }
//             });
//         }
//     },
//
//     tag: {
//         // 获取推荐标签
//         getSuggested: function() {
//             return $.ajax({
//                 url: `${API_BASE_URL}/zhxt/tags/suggested`,
//                 type: 'GET',
//                 headers: {
//                     'Authorization': localStorage.getItem('token')
//                 }
//             });
//         }
//     }
// };
//
// // 社区API封装
// const CommunityAPI = {
//     // 获取社区统计数据
//     getStatistics: function() {
//         return $.ajax({
//             url: `${API_BASE_URL}/community/statistics`,
//             method: 'GET',
//             dataType: 'json'
//         });
//     },
//
//     // 获取所有统计数据（管理员用）
//     getAllStatistics: function() {
//         return $.ajax({
//             url: `${API_BASE_URL}/community/statistics/all`,
//             method: 'GET',
//             dataType: 'json'
//         });
//     },
//
//     // 根据ID获取统计数据
//     getStatisticsById: function(id) {
//         return $.ajax({
//             url: `${API_BASE_URL}/community/statistics/${id}`,
//             method: 'GET',
//             dataType: 'json'
//         });
//     },
//
//     // 添加统计数据
//     addStatistics: function(statisticsData) {
//         return $.ajax({
//             url: `${API_BASE_URL}/community/statistics`,
//             method: 'POST',
//             contentType: 'application/json',
//             data: JSON.stringify(statisticsData),
//             dataType: 'json'
//         });
//     },
//
//     // 更新统计数据
//     updateStatistics: function(statisticsData) {
//         return $.ajax({
//             url: `${API_BASE_URL}/community/statistics`,
//             method: 'PUT',
//             contentType: 'application/json',
//             data: JSON.stringify(statisticsData),
//             dataType: 'json'
//         });
//     },
//
//     // 删除统计数据
//     deleteStatistics: function(id) {
//         return $.ajax({
//             url: `${API_BASE_URL}/community/statistics/${id}`,
//             method: 'DELETE',
//             dataType: 'json'
//         });
//     },
//
//     // 获取推荐小组列表
//     getRecommendedGroups: function() {
//         return $.ajax({
//             url: `${API_BASE_URL}/community/recommended-groups`,
//             method: 'GET',
//             dataType: 'json'
//         });
//     },
//
//     // 根据ID获取推荐小组
//     getRecommendedGroupById: function(id) {
//         return $.ajax({
//             url: `${API_BASE_URL}/community/recommended-groups/${id}`,
//             method: 'GET',
//             dataType: 'json'
//         });
//     },
//
//     // 添加推荐小组
//     addRecommendedGroup: function(groupData) {
//         return $.ajax({
//             url: `${API_BASE_URL}/community/recommended-groups`,
//             method: 'POST',
//             contentType: 'application/json',
//             data: JSON.stringify(groupData),
//             dataType: 'json'
//         });
//     },
//
//     // 更新推荐小组
//     updateRecommendedGroup: function(groupData) {
//         return $.ajax({
//             url: `${API_BASE_URL}/community/recommended-groups`,
//             method: 'PUT',
//             contentType: 'application/json',
//             data: JSON.stringify(groupData),
//             dataType: 'json'
//         });
//     },
//
//     // 删除推荐小组
//     deleteRecommendedGroup: function(id) {
//         return $.ajax({
//             url: `${API_BASE_URL}/community/recommended-groups/${id}`,
//             method: 'DELETE',
//             dataType: 'json'
//         });
//     },
//
//     // 获取小组列表
//     getGroups: function(page = 1, size = 10) {
//         return $.ajax({
//             url: `${API_BASE_URL}/community/groups`,
//             method: 'GET',
//             data: { page, size },
//             dataType: 'json'
//         });
//     },
//
//     // 获取小组详情
//     getGroupDetail: function(groupId) {
//         return $.ajax({
//             url: `${API_BASE_URL}/community/groups/${groupId}`,
//             method: 'GET',
//             dataType: 'json'
//         });
//     },
//
//     // 创建小组
//     createGroup: function(groupData) {
//         return $.ajax({
//             url: `${API_BASE_URL}/community/groups`,
//             method: 'POST',
//             contentType: 'application/json',
//             data: JSON.stringify(groupData),
//             dataType: 'json'
//         });
//     },
//
//     // 加入小组
//     joinGroup: function(groupId, userId) {
//         return $.ajax({
//             url: `${API_BASE_URL}/community/groups/${groupId}/join`,
//             method: 'POST',
//             data: { userId },
//             dataType: 'json'
//         });
//     },
//
//     // 获取小组话题列表
//     getGroupTopics: function() {
//         return $.ajax({
//             url: `${API_BASE_URL}/community/group-topics`,
//             method: 'GET',
//             dataType: 'json'
//         });
//     },
//
//     // 根据ID获取小组话题
//     getGroupTopicById: function(id) {
//         return $.ajax({
//             url: `${API_BASE_URL}/community/group-topics/${id}`,
//             method: 'GET',
//             dataType: 'json'
//         });
//     },
//
//     // 添加小组话题
//     addGroupTopic: function(topicData) {
//         return $.ajax({
//             url: `${API_BASE_URL}/community/group-topics`,
//             method: 'POST',
//             contentType: 'application/json',
//             data: JSON.stringify(topicData),
//             dataType: 'json'
//         });
//     },
//
//     // 更新小组话题
//     updateGroupTopic: function(topicData) {
//         return $.ajax({
//             url: `${API_BASE_URL}/community/group-topics`,
//             method: 'PUT',
//             contentType: 'application/json',
//             data: JSON.stringify(topicData),
//             dataType: 'json'
//         });
//     },
//
//     // 删除小组话题
//     deleteGroupTopic: function(id) {
//         return $.ajax({
//             url: `${API_BASE_URL}/community/group-topics/${id}`,
//             method: 'DELETE',
//             dataType: 'json'
//         });
//     }
// };
//
// // 导出API模块
// export default api;
// console.log('API loaded');