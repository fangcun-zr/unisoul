// Main JavaScript functionality
$(document).ready(function() {
    let currentReceiverId = null;  // 当前选中的聊天对象ID
    let currentUserRole = null;    // 用户角色：'counselor'或'user'
    let currentUserId = null;      // 当前用户ID
    let refreshTimer = null;       // 定时刷新消息的计时器

    // 初始化页面
    function init() {
        console.log('正在初始化页面...');
        initializeUserInfo();
        setupEventListeners();
        initializeAnimations();
    }

    // 初始化用户信息
    function initializeUserInfo() {
        // 从localStorage获取用户信息
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            currentUserId = userInfo.id;
            currentUserRole = userInfo.role;
            console.log('当前用户信息:', { id: currentUserId, role: currentUserRole });

            // 更新用户头像
            if (userInfo.avatarUrl) {
                $('#userAvatar').attr('src', userInfo.avatarUrl);
            }

            // 更新用户角色显示
            const roleText = currentUserRole === 'counselor' ? '咨询师' : '用户';
            $('#userRole').text(roleText);

            // 根据角色加载不同的用户列表
            if (currentUserRole === 'counselor') {
                loadUsers();  // 咨询师加载用户列表
            } else {
                loadCounselors();  // 普通用户加载咨询师列表
            }
        } else {
            console.error('未找到用户信息');
            showError('请先登录');
        }
    }

    // 加载咨询师列表
    function loadCounselors() {
        console.log('加载咨询师列表...');
        $('.loading-spinner').show();

        // 使用数字1表示获取咨询师列表
        ConsultAPI.getCounselors(1).then(response => {
            $('.loading-spinner').hide();
            console.log('咨询师列表响应:', response);

            if (response.code === 1 && response.data) {
                renderUserList(response.data);
            } else {
                showError('加载咨询师列表失败: ' + (response.msg || '未知错误'));
            }
        }).catch(error => {
            $('.loading-spinner').hide();
            showError('加载咨询师列表失败');
            console.error('Error loading counselors:', error);
        });
    }

    // 加载用户列表
    function loadUsers() {
        console.log('加载用户列表...');
        $('.loading-spinner').show();

        // 使用数字0表示获取用户列表
        ConsultAPI.getCounselors(0).then(response => {
            $('.loading-spinner').hide();
            console.log('用户列表响应:', response);

            if (response.code === 1 && response.data) {
                renderUserList(response.data);
            } else {
                showError('加载用户列表失败: ' + (response.msg || '未知错误'));
            }
        }).catch(error => {
            $('.loading-spinner').hide();
            showError('加载用户列表失败');
            console.error('Error loading users:', error);
        });
    }

    // 渲染用户列表
    function renderUserList(users) {
        console.log('渲染用户列表:', users);
        const $listContainer = $('#usersList');
        $listContainer.empty();

        if (!users || users.length === 0) {
            $listContainer.html('<div class="empty-message"><i class="fas fa-user-slash"></i><p>暂无用户数据</p></div>');
            return;
        }

        users.forEach(user => {
            // 确保头像URL有效，修复路径问题
            const avatarUrl = user.avatarUrl ? user.avatarUrl : '../images/default-avatar.png';
            // 确保显示名称有效
            const displayName = user.name || user.username || '未知用户';

            const userItem = `
                <div class="list-item" data-id="${user.id}">
                    <div class="item-avatar">
                        <img src="${avatarUrl}" alt="${displayName}">
                        <span class="status-dot"></span>
                    </div>
                    <div class="item-info">
                        <h4>${displayName}</h4>
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

    // 加载聊天消息
    function loadChatMessages(receiverId) {
        if (!currentUserId || !receiverId) {
            console.error('缺少必要的用户ID或接收者ID');
            return;
        }

        console.log('加载聊天消息:', '发送者ID:', currentUserId, '接收者ID:', receiverId);
        $('.loading-spinner').show();

        ConsultAPI.getMessages(currentUserId, receiverId).then(response => {
            $('.loading-spinner').hide();
            console.log('聊天消息响应:', response);

            if (response.code === 1) {
                renderMessages(response.data.messageList || []);

                // 启动自动刷新消息
                startRefreshTimer(receiverId);
            } else {
                showError('加载消息失败: ' + (response.msg || '未知错误'));
            }
        }).catch(error => {
            $('.loading-spinner').hide();
            showError('加载消息失败');
            console.error('Error loading messages:', error);
        });
    }

    // 启动定时刷新消息
    function startRefreshTimer(receiverId) {
        // 先清除之前的定时器
        if (refreshTimer) {
            clearInterval(refreshTimer);
        }

        // 设置新的定时器，每10秒刷新一次消息
        refreshTimer = setInterval(() => {
            if (currentReceiverId) {
                console.log('自动刷新消息...');
                refreshMessages(currentReceiverId);
            }
        }, 10000);
    }

    // 刷新消息（不显示加载动画）
    function refreshMessages(receiverId) {
        if (!currentUserId || !receiverId) return;

        ConsultAPI.getMessages(currentUserId, receiverId).then(response => {
            if (response.code === 1) {
                renderMessages(response.data.messageList || []);
            }
        }).catch(error => {
            console.error('刷新消息失败:', error);
        });
    }

    // 渲染消息列表
    function renderMessages(messages) {
        console.log('渲染消息:', messages);
        const $chatBody = $('#chatMessages');
        $chatBody.empty();

        if (!messages || messages.length === 0) {
            $chatBody.html('<div class="empty-message"><i class="fas fa-comments"></i><p>暂无消息，开始聊天吧</p></div>');
            return;
        }

        messages.forEach(message => {
            const isSent = message.senderId == currentUserId;
            const messageHtml = `
                <div class="message ${isSent ? 'sent' : 'received'}">
                    <div class="message-content">
                        <p>${message.content}</p>
                        <span class="message-time">${formatTime(message.createTime)}</span>
                    </div>
                    ${isSent ? `
                        <button class="delete-message" data-id="${message.id}" title="删除消息">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            `;
            $chatBody.append(messageHtml);
        });

        // 滚动到底部
        $chatBody.scrollTop($chatBody[0].scrollHeight);
    }

    // 格式化时间
    function formatTime(timestamp) {
        if (!timestamp) return '刚刚';
        const date = new Date(timestamp);
        return date.toLocaleTimeString().substring(0, 5);
    }

    // 发送消息
    function sendMessage() {
        if (!currentReceiverId) {
            showError('请先选择聊天对象');
            return;
        }

        const content = $('.message-input').val().trim();
        if (!content) return;

        console.log('发送消息:', content, '接收者:', currentReceiverId);
        $('.loading-spinner').show();

        ConsultAPI.sendMessage(currentReceiverId, content).then(response => {
            $('.loading-spinner').hide();
            console.log('发送消息响应:', response);

            if (response.code === 1) {
                $('.message-input').val('');
                // 重新加载消息以显示新发送的消息
                loadChatMessages(currentReceiverId);
            } else {
                showError('发送消息失败: ' + (response.msg || '未知错误'));
            }
        }).catch(error => {
            $('.loading-spinner').hide();
            showError('发送消息失败');
            console.error('Error sending message:', error);
        });
    }

    // 删除消息
    function deleteMessage(messageId) {
        if (!messageId) return;

        if (!confirm('确定要删除这条消息吗？')) return;

        console.log('删除消息:', messageId);
        $('.loading-spinner').show();

        ConsultAPI.deleteMessage(messageId).then(response => {
            $('.loading-spinner').hide();
            console.log('删除消息响应:', response);

            if (response.code === 1) {
                // 重新加载消息列表
                loadChatMessages(currentReceiverId);
            } else {
                showError('删除消息失败: ' + (response.msg || '未知错误'));
            }
        }).catch(error => {
            $('.loading-spinner').hide();
            showError('删除消息失败');
            console.error('Error deleting message:', error);
        });
    }

    // 发送AI消息
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
        ConsultAPI.chatWithAI(question).then(response => {
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
        }).catch(error => {
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

    // 设置事件监听器
    function setupEventListeners() {
        console.log('设置事件监听器');

        // 搜索框功能
        $('#searchInput').on('input', function() {
            const searchText = $(this).val().toLowerCase();
            $('.list-item').each(function() {
                const userName = $(this).find('h4').text().toLowerCase();
                const userBio = $(this).find('p').text().toLowerCase();

                if (userName.includes(searchText) || userBio.includes(searchText)) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        });

        // 用户列表项点击
        $(document).on('click', '.list-item', function() {
            const userId = $(this).data('id');
            const userName = $(this).find('h4').text();

            console.log('选择用户:', userId, userName);

            $('.list-item').removeClass('active');
            $(this).addClass('active');

            currentReceiverId = userId;

            // 更新聊天头部信息
            $('.chat-user-name').text(userName);
            $('.chat-user-status').text('在线');

            // 加载聊天记录
            loadChatMessages(currentReceiverId);
        });

        // 发送消息按钮
        $('.btn-send').click(function() {
            sendMessage();
        });

        // 回车发送消息
        $('.message-input').keypress(function(e) {
            if (e.which === 13 && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // 删除消息
        $(document).on('click', '.delete-message', function(e) {
            e.stopPropagation();
            const messageId = $(this).data('id');
            deleteMessage(messageId);
        });

        // AI咨询按钮
        $('#aiChatToggle').click(function() {
            $('.ai-chat-interface').fadeToggle();
        });

        // 关闭AI聊天界面
        $('.close-ai-chat').click(function() {
            $('.ai-chat-interface').fadeOut();
        });

        // 发送AI消息
        $('.btn-send-ai').click(function() {
            sendAIMessage();
        });

        // 回车发送AI消息
        $('.ai-message-input').keypress(function(e) {
            if (e.which === 13 && !e.shiftKey) {
                e.preventDefault();
                sendAIMessage();
            }
        });
    }

    // 显示错误消息
    function showError(message) {
        console.error(message);
        alert(message);
    }

    // 初始化动画
    function initializeAnimations() {
        // 添加页面加载动画
        $('.main-content').addClass('animate-fade-up');
    }

    // 页面关闭时清理
    $(window).on('beforeunload', function() {
        if (refreshTimer) {
            clearInterval(refreshTimer);
        }
    });

    // 启动初始化
    init();
});