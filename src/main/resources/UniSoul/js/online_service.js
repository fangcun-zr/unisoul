// 全局错误提示函数
function showError(message) {
    console.error(message);
    alert(message);
}

// API调用对象
if (typeof ConsultAPI === 'undefined') {
    const ConsultAPI = {
        // 获取用户列表（咨询师或普通用户）
        getCounselors: function (category) {
            return $.ajax({
                url: '/api/consult/getCounselors',
                method: 'GET',
                data: { category: category }
            });
        },

        // 获取聊天记录
        getMessages: function (userId, receiverId) {
            // 确保参数是字符串类型
            const stringUserId = String(userId);
            const stringReceiverId = String(receiverId);
            console.log('获取聊天记录，userId:', stringUserId, 'receiverId:', stringReceiverId);

            return $.ajax({
                url: '/api/consult/messages',
                method: 'GET',
                data: {
                    userId: stringUserId,
                    receiverId: stringReceiverId
                }
            });
        },

        // 发送消息
        sendMessage: function (receiverId, content) {
            return $.ajax({
                url: '/api/consult/send',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    senderId: currentUserId,
                    receiverId: receiverId,
                    content: content,
                    messageType: 'TEXT',
                    status: 'SENT'
                })
            });
        },

        // 删除消息
        deleteMessage: function (messageId) {
            return $.ajax({
                url: '/api/consult/message/' + messageId,
                method: 'DELETE'
            });
        },

        // 获取当前用户ID
        getCurrentUserId: function () {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: '/api/consult/getUserId',
                    method: 'GET',
                    timeout: 5000,
                    dataType: 'json',
                    success: function (response) {
                        console.log('获取用户ID响应:', response);
                        if (response && response.code === 1 && response.data) {
                            resolve(response.data);
                        } else {
                            reject(new Error(response ? response.msg : '获取用户ID失败'));
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error('获取用户ID请求失败:', {
                            status: status,
                            error: error,
                            response: xhr.responseText
                        });
                        reject(new Error('获取用户ID失败: ' + (error || '未知错误')));
                    }
                });
            });
        }
    };

    // 将ConsultAPI添加到全局作用域
    window.ConsultAPI = ConsultAPI;
}

// 全局变量
const API_BASE_URL = '/api';  // 修改为正确的API基础路径
const WS_BASE_URL = window.location.protocol === 'https:' ? 'wss:' : 'ws:' + '//' + window.location.host;  // 动态获取WebSocket服务器地址
let stompClient = null;
let currentUserId = null;
let currentReceiverId = null;
let messageInput = null;
let chatMessages = null;
let refreshTimer = null;
let currentUserRole = null;    // 用户角色：'counselor'或'user'
let currentView = 'counselors'; // 默认显示咨询师列表
let currentUserAvatar = null;   // 当前用户头像URL

// Main JavaScript functionality
$(document).ready(function () {
    // 获取当前用户信息
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
        showError('请先登录');
        return;
    }

    // 设置用户角色
    currentUserRole = userInfo.role;

    // 获取当前用户ID
    ConsultAPI.getCurrentUserId()
        .then(response => {
            currentUserId = response;
            console.log('获取到用户ID:', currentUserId);

            // 获取用户详细信息
            $.ajax({
                url: '/api/consult/getUserInformation',
                method: 'GET',
                data: { userId: currentUserId },
                success: function (response) {
                    if (response.code === 1 && response.data) {
                        const userInfo = response.data;
                        console.log('获取到用户信息:', userInfo);

                        // 更新用户头像
                        currentUserAvatar = userInfo.avatarUrl;
                        if (currentUserAvatar) {
                            $('#userAvatar').attr('src', currentUserAvatar);
                        }

                        // 显示用户信息
                        const userInfoHtml = `
                            <div class="user-info-container">
                                <div class="user-info-header">
                                    <img src="${userInfo.avatarUrl || '/UniSoul/image/default-avatar.png'}" alt="用户头像" class="user-info-avatar">
                                    <div class="user-info-basic">
                                        <h3>${userInfo.name || userInfo.username}</h3>
                                        <p>${userInfo.biography || '这个人很懒，什么都没写~'}</p>
                                    </div>
                                </div>
                                <div class="user-info-details">
                                    <p><i class="fas fa-envelope"></i> ${userInfo.email || '未设置邮箱'}</p>
                                    <p><i class="fas fa-graduation-cap"></i> ${userInfo.school || '未设置学校'}</p>
                                    <p><i class="fas fa-user"></i> ${userInfo.age ? userInfo.age + '岁' : '年龄未设置'}</p>
                                    <p><i class="fas fa-venus-mars"></i> ${userInfo.gender === '1' ? '男' : userInfo.gender === '2' ? '女' : '未设置'}</p>
                                </div>
                            </div>
                        `;

                        // 显示用户信息区域
                        $('#userInfoContainer').html(userInfoHtml).show();
                        $('#chatContainer').hide();

                        // 根据角色加载不同的用户列表
                        loadUserList();

                        // 绑定事件
                        setupEventListeners();

                        // 初始化WebSocket连接
                        initWebSocket();
                    } else {
                        console.error('获取用户信息失败:', response.msg);
                        showError('获取用户信息失败，请重试');
                    }
                },
                error: function (xhr, status, error) {
                    console.error('获取用户信息请求失败:', error);
                    showError('获取用户信息失败，请重试');
                }
            });
        })
        .catch(error => {
            console.error('获取用户ID失败:', error.message);
            showError(error.message || '获取用户ID失败，请重试');
        });
});

// 加载用户列表
function loadUserList() {
    const category = currentUserRole === 'counselor' ? 0 : 1; // 0: 用户列表, 1: 咨询师列表
    $('.loading-spinner').show();

    console.log('加载用户列表, category:', category, 'role:', currentUserRole);

    ConsultAPI.getCounselors(category)
        .then(response => {
            $('.loading-spinner').hide();
            console.log('获取用户列表响应:', response);

            if (response.code === 1) {
                if (!response.data || response.data.length === 0) {
                    console.log('用户列表为空');
                    renderUserList([]);
                } else {
                    console.log('获取到用户数量:', response.data.length);
                    renderUserList(response.data);
                }
            } else {
                console.error('加载用户列表失败:', response.msg);
                showError('加载用户列表失败: ' + response.msg);
            }
        })
        .catch(error => {
            $('.loading-spinner').hide();
            console.error('加载用户列表请求失败:', error);
            showError('加载用户列表失败');
        });
}

// 渲染用户列表
function renderUserList(users) {
    const $listContainer = $('#usersList');
    $listContainer.empty();

    if (!users || users.length === 0) {
        $listContainer.html(`
            <div class="empty-message">
                <i class="fas fa-user-slash"></i>
                <p>暂无${currentUserRole === 'counselor' ? '用户' : '咨询师'}数据</p>
            </div>
        `);
        return;
    }

    console.log('渲染用户列表, 用户数量:', users.length);

    users.forEach(user => {
        // 确保用户头像URL存在
        const avatarUrl = user.avatarUrl || '/UniSoul/image/default-avatar.png';
        console.log('用户头像:', avatarUrl);

        const userItem = `
            <div class="list-item" data-id="${user.id}">
                <div class="item-avatar">
                    <img src="${avatarUrl}" alt="${user.name || user.username}">
                    <span class="status-dot ${user.isOnline ? 'online' : 'offline'}"></span>
                </div>
                <div class="item-info">
                    <h4>${user.name || user.username}</h4>
                    <p>${user.biography || (user.school ? '来自' + user.school : '暂无简介')}</p>
                </div>
                <div class="item-meta">
                    <span class="time">${new Date().toLocaleTimeString().substring(0, 5)}</span>
                </div>
            </div>
        `;
        $listContainer.append(userItem);
    });
}

// 选择聊天用户
function selectUser(userId, userName) {
    console.log('选择用户:', userId, userName);

    // 获取用户详细信息
    $.ajax({
        url: '/api/consult/getUserInformation',
        method: 'GET',
        data: { userId: userId },
        success: function (response) {
            if (response.code === 1 && response.data) {
                const userInfo = response.data;
                console.log('获取到用户信息:', userInfo);

                // 更新用户信息展示区域
                const userInfoHtml = `
                    <div class="user-info-container">
                        <div class="user-info-header">
                            <img src="${userInfo.avatarUrl || '/UniSoul/image/default-avatar.png'}" alt="用户头像" class="user-info-avatar">
                            <div class="user-info-basic">
                                <h3>${userInfo.name || userInfo.username}</h3>
                                <p>${userInfo.biography || '这个人很懒，什么都没写~'}</p>
                            </div>
                        </div>
                        <div class="user-info-details">
                            <p><i class="fas fa-envelope"></i> ${userInfo.email}</p>
                            <p><i class="fas fa-graduation-cap"></i> ${userInfo.school || '未设置学校'}</p>
                            <p><i class="fas fa-user"></i> ${userInfo.age ? userInfo.age + '岁' : '年龄未设置'}</p>
                            <p><i class="fas fa-venus-mars"></i> ${userInfo.gender === '1' ? '男' : userInfo.gender === '2' ? '女' : '未设置'}</p>
                        </div>
                        <div class="user-info-actions">
                            <button class="select-user-btn" onclick="confirmSelectUser(${userId}, '${userInfo.name || userInfo.username}', ${userInfo.category})">
                                ${userInfo.category === 0 ? '选择该用户' : '选择该咨询师'}
                            </button>
                        </div>
                    </div>
                `;

                // 显示用户信息区域
                $('#userInfoContainer').html(userInfoHtml).show();
                $('#chatContainer').hide();
            } else {
                console.error('获取用户信息失败:', response.msg);
                showError('获取用户信息失败，请重试');
            }
        },
        error: function (xhr, status, error) {
            console.error('获取用户信息请求失败:', error);
            showError('获取用户信息失败，请重试');
        }
    });
}

// 确认选择用户并进入聊天
function confirmSelectUser(userId, userName, category) {
    console.log('确认选择用户:', userId, userName, category);

    // 更新UI状态
    $('.list-item').removeClass('active');
    $(`.list-item[data-id="${userId}"]`).addClass('active');

    // 更新当前聊天对象
    currentReceiverId = userId;

    // 获取用户头像
    $.ajax({
        url: '/api/consult/getAvatarById',
        method: 'GET',
        data: { userId: userId },
        success: function (response) {
            if (response.code === 1 && response.data) {
                const avatarUrl = response.data;
                console.log('获取到用户头像:', avatarUrl);

                // 保存当前聊天对象信息到localStorage
                const currentReceiver = {
                    id: userId,
                    name: userName,
                    avatarUrl: avatarUrl,
                    category: category
                };
                localStorage.setItem('currentReceiver', JSON.stringify(currentReceiver));

                // 更新聊天头部信息
                $('.chat-user-name').text(userName);
                $('.chat-user-status').text('在线');
                $('.chat-user-avatar').attr('src', avatarUrl).show();

                // 隐藏用户信息区域，显示聊天区域
                $('#userInfoContainer').hide();
                $('#chatContainer').show();

                // 加载聊天记录
                if (currentUserId && currentReceiverId) {
                    loadChatHistory(currentUserId, currentReceiverId);
                } else {
                    console.error('加载聊天记录失败：缺少用户ID');
                    showError('加载聊天记录失败：缺少用户信息');
                }
            } else {
                console.error('获取用户头像失败:', response.msg);
                showError('获取用户头像失败，请重试');
            }
        },
        error: function (xhr, status, error) {
            console.error('获取用户头像请求失败:', error);
            showError('获取用户头像失败，请重试');
        }
    });
}

// 开始定时刷新
function startRefreshTimer() {
    // 清除已存在的定时器
    if (refreshTimer) {
        clearInterval(refreshTimer);
    }

    // 设置新的定时器，每30秒刷新一次
    refreshTimer = setInterval(() => {
        if (currentUserId && currentReceiverId) {
            loadChatHistory(currentUserId, currentReceiverId);
        }
    }, 30000);
}

// 停止定时刷新
function stopRefreshTimer() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
    }
}

// 加载聊天记录
function loadChatHistory(senderId, receiverId) {
    if (!senderId || !receiverId) {
        console.error('加载聊天记录失败：缺少必要的参数');
        showError('加载聊天记录失败：缺少用户信息');
        return;
    }

    console.log('加载聊天记录:', '发送者ID:', senderId, '接收者ID:', receiverId);
    $('.loading-spinner').show();

    // 获取双向消息
    ConsultAPI.getMessages(senderId, receiverId)
        .then(response => {
            $('.loading-spinner').hide();
            if (response && response.code === 1) {
                console.log('获取到聊天记录:', response.data);
                // 按时间排序消息
                const sortedMessages = response.data.sort((a, b) =>
                    new Date(a.createTime) - new Date(b.createTime)
                );
                displayMessages(sortedMessages);
                // 开始定时刷新
                startRefreshTimer();
            } else {
                console.error('加载聊天记录失败:', response ? response.msg : '未知错误');
                showError('加载聊天记录失败: ' + (response ? response.msg : '未知错误'));
            }
        })
        .catch(error => {
            $('.loading-spinner').hide();
            console.error('加载聊天记录请求失败:', error);
            showError('加载聊天记录失败，请稍后重试');
        });
}

// 显示消息
function displayMessages(messages) {
    const $chatContainer = $('#chatMessages');
    if (!$chatContainer.length) {
        console.error('找不到聊天消息容器');
        return;
    }

    $chatContainer.empty();

    messages.forEach(message => {
        const isSelf = message.senderId === currentUserId;
        const messageTime = formatTime(message.createTime);
        console.log('消息时间:', message.createTime, '格式化后:', messageTime);

        const messageHtml = `
            <div class="message-wrapper ${isSelf ? 'message-wrapper-sent' : 'message-wrapper-received'}">
                ${!isSelf ? `
                    <div class="message-avatar">
                        <img src="${message.senderAvatar || '/UniSoul/image/default-avatar.png'}" alt="用户头像">
                    </div>
                ` : ''}
                <div class="message ${isSelf ? 'message-sent' : 'message-received'}">
                    <div class="message-content">
                        <div class="message-text">${message.content}</div>
                        <div class="message-time">${messageTime}</div>
                    </div>
                    <div class="message-actions">
                        <button class="delete-message" data-id="${message.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                ${isSelf ? `
                    <div class="message-avatar">
                        <img src="${message.senderAvatar || '/UniSoul/image/default-avatar.png'}" alt="用户头像">
                    </div>
                ` : ''}
            </div>
        `;
        $chatContainer.append(messageHtml);
    });

    // 滚动到底部
    $chatContainer.scrollTop($chatContainer[0].scrollHeight);
}

// 添加新消息到聊天记录
function appendMessage(message) {
    const $chatContainer = $('#chatMessages');
    if (!$chatContainer.length) {
        console.error('找不到聊天消息容器');
        return;
    }

    // 获取当前用户信息
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
        console.error('未找到用户信息');
        return;
    }

    // 获取当前聊天对象信息
    const currentReceiver = JSON.parse(localStorage.getItem('currentReceiver'));
    if (!currentReceiver) {
        console.error('未找到当前聊天对象信息');
        return;
    }

    const isSelf = message.senderId === currentUserId;
    const messageTime = formatTime(message.createTime);
    console.log('新消息时间:', message.createTime, '格式化后:', messageTime);

    // 根据消息发送者设置正确的头像
    const senderAvatar = isSelf ? userInfo.avatarUrl : currentReceiver.avatarUrl;
    const receiverAvatar = isSelf ? currentReceiver.avatarUrl : userInfo.avatarUrl;

    console.log('消息头像信息:', {
        senderAvatar,
        receiverAvatar,
        isSelf,
        currentUserAvatar: userInfo.avatarUrl,
        receiverAvatar: currentReceiver.avatarUrl
    });

    const messageHtml = `
        <div class="message-wrapper ${isSelf ? 'message-wrapper-sent' : 'message-wrapper-received'}">
            ${!isSelf ? `
                <div class="message-avatar">
                    <img src="${senderAvatar || '/UniSoul/image/default-avatar.png'}" alt="用户头像">
                </div>
            ` : ''}
            <div class="message ${isSelf ? 'message-sent' : 'message-received'}">
                <div class="message-content">
                    <div class="message-text">${message.content}</div>
                    <div class="message-time">${messageTime}</div>
                </div>
                <div class="message-actions">
                    <button class="delete-message" data-id="${message.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            ${isSelf ? `
                <div class="message-avatar">
                    <img src="${currentUserAvatar || '/UniSoul/image/default-avatar.png'}" alt="用户头像">
                </div>
            ` : ''}
        </div>
    `;
    $chatContainer.append(messageHtml);

    // 滚动到底部
    $chatContainer.scrollTop($chatContainer[0].scrollHeight);
}

// 格式化消息时间
function formatMessageTime(timestamp) {
    const date = new Date(timestamp);
    date.setHours(date.getHours() + 8);
    const now = new Date();
    const diff = now - date;

    // 如果是今天的消息，只显示时间
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }

    // 如果是昨天的消息，显示"昨天"
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
        return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }

    // 如果是今年的消息，显示月日
    if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) + ' ' +
            date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }

    // 其他情况显示完整日期
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' +
        date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

// 格式化时间
function formatTime(timestamp) {
    if (!timestamp) {
        console.error('时间戳为空');
        return '';
    }

    try {
        // 确保timestamp是有效的日期字符串或时间戳
        if (Array.isArray(timestamp)) {
            // 假设数组格式为 [年, 月, 日, 时, 分, 秒]
            if (timestamp.length >= 6) {
                const date = new Date(
                    timestamp[0], // 年
                    timestamp[1] - 1, // 月（JavaScript中月份从0开始）
                    timestamp[2], // 日
                    timestamp[3], // 时
                    timestamp[4], // 分
                    timestamp[5]  // 秒
                );
                console.log('处理数组格式时间:', timestamp, '转换后:', date);
                timestamp = date.toISOString();
            } else {
                console.error('时间数组格式不正确:', timestamp);
                return '';
            }
        }
        let date;
        if (typeof timestamp === 'string') {
            // 处理ISO格式的日期字符串
            date = new Date(timestamp.replace('T', ' ').replace('Z', ''));
            console.log('处理ISO格式时间:', timestamp, '转换后:', date);
        } else if (typeof timestamp === 'number') {
            // 处理时间戳
            date = new Date(timestamp);
            console.log('处理时间戳:', timestamp, '转换后:', date);
        } else {
            console.error('无效的时间格式:', timestamp);
            return '';
        }

        // 检查日期是否有效
        if (isNaN(date.getTime())) {
            console.error('无效的日期:', timestamp);
            return '';
        }

        const now = new Date();
        date.setHours(date.getHours() + 8);
        const diff = now - date;

        // 如果是今天的消息，只显示时间
        if (date.toDateString() === now.toDateString()) {
            const timeStr = date.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            console.log('今天的时间:', timeStr);
            return timeStr;
        }

        // 如果是昨天的消息，显示"昨天"
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
            const timeStr = '昨天 ' + date.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            console.log('昨天的时间:', timeStr);
            return timeStr;
        }

        // 如果是今年的消息，显示月日
        if (date.getFullYear() === now.getFullYear()) {
            const timeStr = date.toLocaleDateString('zh-CN', {
                month: '2-digit',
                day: '2-digit'
            }) + ' ' + date.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            console.log('今年的时间:', timeStr);
            return timeStr;
        }

        // 其他情况显示完整日期
        const timeStr = date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }) + ' ' + date.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        console.log('完整时间:', timeStr);
        return timeStr;
    } catch (error) {
        console.error('格式化时间失败:', error, '时间戳:', timestamp);
        return '';
    }
}

// 生成消息ID
function generateMessageId() {
    // 使用当前时间戳的后6位，加上一个0-999的随机数
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return parseInt(timestamp + random);
}

// 发送消息
function sendMessage() {
    const messageInput = $('.message-input');
    const content = messageInput.val().trim();

    if (!content || !currentReceiverId) {
        showError('请先选择聊天对象');
        return;
    }

    if (!currentUserId) {
        showError('未获取到用户ID，请刷新页面重试');
        return;
    }

    console.log('发送消息:', content, '发送者:', currentUserId, '接收者:', currentReceiverId);
    $('.loading-spinner').show();

    // 创建消息对象
    const message = {
        senderId: currentUserId,
        receiverId: currentReceiverId,
        content: content,
        messageType: 'TEXT',
        status: 'SENT',
        createTime: new Date().toISOString()
    };

    // 立即显示发送的消息
    appendMessage(message);

    // 清空输入框
    messageInput.val('');

    // 通过WebSocket发送消息
    if (stompClient && stompClient.connected) {
        try {
            // 发送消息到正确的端点
            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(message));
            console.log('消息发送成功');

            // 延迟1秒后刷新聊天记录，确保后端处理完成
            // setTimeout(() => {
            //     loadChatHistory(currentUserId, currentReceiverId);
            // }, 10);
        } catch (error) {
            console.error('发送消息失败:', error);
            showError('发送消息失败，请重试');
        }
    } else {
        console.error('WebSocket未连接');
        showError('WebSocket未连接，请刷新页面重试');
    }

    $('.loading-spinner').hide();
}

// 删除消息
function deleteMessage(messageId) {
    if (!messageId) {
        console.error('消息ID不能为空');
        return;
    }

    if (!confirm('确定要删除这条消息吗？')) {
        return;
    }

    console.log('删除消息:', messageId);
    $('.loading-spinner').show();

    ConsultAPI.deleteMessage(messageId)
        .then(response => {
            $('.loading-spinner').hide();
            if (response.code === 1) {
                // 从DOM中移除消息
                $(`.delete-message[data-id="${messageId}"]`).closest('.message-wrapper').remove();

                // 如果聊天记录为空，显示空状态消息
                if ($('#chatMessages .message-wrapper').length === 0) {
                    $('#chatMessages').html(`
                        <div class="empty-message">
                            <i class="fas fa-comments"></i>
                            <p>暂无聊天记录</p>
                        </div>
                    `);
                }
            } else {
                showError('删除消息失败: ' + response.msg);
            }
        })
        .catch(error => {
            $('.loading-spinner').hide();
            console.error('删除消息失败:', error);
            showError('删除消息失败，请稍后重试');
        });
}

// 设置事件监听器
function setupEventListeners() {
    // 用户列表项点击
    $(document).on('click', '.list-item', function () {
        const userId = $(this).data('id');
        const userName = $(this).find('h4').text();
        selectUser(userId, userName);
    });

    // 发送消息按钮
    $('.btn-send').click(sendMessage);

    // 回车发送消息
    $('.message-input').keypress(function (e) {
        if (e.which === 13 && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // 删除消息
    $(document).on('click', '.delete-message', function (e) {
        e.stopPropagation();
        const messageId = $(this).data('id');
        deleteMessage(messageId);
    });

    // 搜索框功能
    $('#searchInput').on('input', function () {
        const searchText = $(this).val().toLowerCase();
        $('.list-item').each(function () {
            const userName = $(this).find('h4').text().toLowerCase();
            const userBio = $(this).find('p').text().toLowerCase();

            if (userName.includes(searchText) || userBio.includes(searchText)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
}

// 初始化WebSocket连接
function initWebSocket() {
    try {
        // 创建SockJS连接
        const socket = new SockJS('/api/websocket/chat', null, {
            transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
            timeout: 10000,
            debug: true
        });
        console.log('SockJS连接创建成功:',socket);

        // 创建STOMP客户端
        stompClient = Stomp.over(socket);

        // 设置调试日志
        stompClient.debug = function (str) {
            console.log('STOMP Debug:', str);
        };

        // 设置连接选项
        const connectHeaders = {
            'heart-beat': '10000,10000'
        };

        // 连接WebSocket
        stompClient.connect(connectHeaders, onConnected, onError);
    } catch (error) {
        console.error('WebSocket初始化失败:', error);
        showError('WebSocket连接失败: ' + error.message);
    }
}

// WebSocket连接成功回调
function onConnected(frame) {
    console.log('WebSocket连接成功:', frame);

    try {
        // 订阅个人消息主题
        const subscription = stompClient.subscribe(`/user/${currentUserId}/topic/messages`, onMessageReceived);
        console.log('订阅成功:', subscription);

        // 发送上线通知
        const statusMessage = {
            userId: currentUserId,
            isOnline: true
        };
        console.log('发送上线通知:', statusMessage);
        stompClient.send("/app/chat.userStatus", {}, JSON.stringify(statusMessage));
    } catch (error) {
        console.error('WebSocket订阅失败:', error);
        showError('WebSocket订阅失败，请刷新页面重试');
    }
}

// WebSocket连接错误回调
function onError(error) {
    console.error('WebSocket连接错误:', error);
    showError('WebSocket连接失败，请刷新页面重试');

    // 3秒后尝试重连
    setTimeout(() => {
        if (!stompClient || !stompClient.connected) {
            console.log('尝试重新连接WebSocket...');
            initWebSocket();
        }
    }, 3000);
}

// 接收消息回调
function onMessageReceived(message) {
    try {
        const chatMessage = JSON.parse(message.body);
        console.log('收到新消息:', chatMessage);

        // 如果消息是当前聊天对象的，直接添加到聊天记录
        if (chatMessage.senderId === currentReceiverId || chatMessage.receiverId === currentReceiverId) {
            appendMessage(chatMessage);
            // 刷新聊天记录以确保消息顺序正确
            loadChatHistory(currentUserId, currentReceiverId);
        } else {
            // 否则更新未读消息数
            updateUnreadCount(chatMessage.senderId);
        }
    } catch (error) {
        console.error('处理消息失败:', error);
    }
}
//AI咨询
function sendAIMessage() {
    const question = $('.ai-message-input').val().trim();
    if (!question) return;

    console.log('发送AI问题:', question);

    // 先显示用户消息
    const userMessageHtml = `
        <div class="ai-message user">
            ${question}
            <span class="message-time">${new Date().toLocaleTimeString().substring(0, 5)}</span>
        </div>
    `;
    $('#aiChatMessages').append(userMessageHtml);

    // 清空输入框
    $('.ai-message-input').val('');

    // 添加"思考中"状态消息
    const thinkingMessageId = 'ai-thinking-' + Date.now();
    const thinkingHtml = `
        <div class="ai-message thinking" id="${thinkingMessageId}">
            <div class="thinking-dots">
                <span class="dot dot1"></span>
                <span class="dot dot2"></span>
                <span class="dot dot3"></span>
            </div>
            <span class="message-time">思考中...</span>
        </div>
    `;
    $('#aiChatMessages').append(thinkingHtml);

    // 滚动到底部
    $('#aiChatMessages').scrollTop($('#aiChatMessages')[0].scrollHeight);

    // 调用AI接口
    $.get('/consult/chat', { question: question })
        .done(function (response) {
            // 移除思考中的消息
            $(`#${thinkingMessageId}`).remove();

            console.log('AI响应:', response);

            // 显示AI回复
            const aiMessageHtml = `
                <div class="ai-message">
                    ${response.data || '抱歉，我暂时无法回答这个问题。'}
                    <span class="message-time">${new Date().toLocaleTimeString().substring(0, 5)}</span>
                </div>
            `;
            $('#aiChatMessages').append(aiMessageHtml);

            // 滚动到底部
            $('#aiChatMessages').scrollTop($('#aiChatMessages')[0].scrollHeight);
        })
        .fail(function (error) {
            // 移除思考中的消息
            $(`#${thinkingMessageId}`).remove();

            // 显示错误消息
            const errorMessageHtml = `
                <div class="ai-message">
                    抱歉，系统出现了问题，请稍后再试。
                    <span class="message-time">${new Date().toLocaleTimeString().substring(0, 5)}</span>
                </div>
            `;
            $('#aiChatMessages').append(errorMessageHtml);
            console.error('AI chat error:', error);
        });
}
// AI咨询按钮
$('#aiChatToggle').click(function () {
    $('.ai-chat-interface').fadeToggle();
});

// 关闭AI聊天界面
$('.close-ai-chat').click(function () {
    $('.ai-chat-interface').fadeOut();
});

// 发送AI消息
$('.btn-send-ai').click(function () {
    sendAIMessage();
});

// 回车发送AI消息
$('.ai-message-input').keypress(function (e) {
    if (e.which === 13 && !e.shiftKey) {
        e.preventDefault();
        sendAIMessage();
    }
});
// 页面关闭时清理
$(window).on('beforeunload', function () {
    if (stompClient && stompClient.connected) {
        // 发送下线通知
        stompClient.send("/app/chat.userStatus", {}, JSON.stringify({
            userId: currentUserId,
            isOnline: false
        }));
        // 断开连接
        stompClient.disconnect();
    }
    if (refreshTimer) {
        clearInterval(refreshTimer);
    }
});