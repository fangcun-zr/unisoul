$(document).ready(function () {
    // 全局变量
    const currentUserId = localStorage.getItem('userId') || 1; // 当前用户ID
    let selectedUserId = null; // 当前选中的聊天对象ID
    let currentPage = 1; // 当前分页
    const pageSize = 20; // 每页条数
    let isLoading = false; // 是否正在加载数据

    // 初始化页面
    function initPage() {
        loadMessageThreads(); // 加载私信列表
        bindEvents(); // 绑定事件
        startMessagePolling(); // 开始消息轮询
    }

    // 绑定事件
    function bindEvents() {
        // 发送消息表单提交
        $('#sendMessageForm').on('submit', handleSendMessage);

        // 切换聊天对象
        $(document).on('click', '.message-thread', handleThreadSelect);

        // 删除消息
        $(document).on('click', '.delete-message', handleDeleteMessage);

        // 滚动加载更多
        $('#chatHistory').on('scroll', handleScroll);

        // 刷新私信列表
        $('#refreshBtn').on('click', function () {
            currentPage = 1;
            loadMessageThreads();
        });

        // 新建私信
        $('#newMessageBtn').on('click', function () {
            $('#newMessageModal').modal('show');
        });

        // 开始新对话
        $('#startChatBtn').on('click', handleStartNewChat);
    }

    // 加载私信列表
    function loadMessageThreads() {
        if (isLoading) return;
        isLoading = true;

        MessageAPI.getThreads(currentUserId, currentPage, pageSize)
            .then(response => {
                if (response.code === 200) {
                    renderThreadList(response.data.records);
                } else {
                    console.error('加载私信列表失败:', response.message);
                }
            })
            .finally(() => {
                isLoading = false;
            });
    }

    // 渲染私信列表
    function renderThreadList(threads) {
        const $threadList = $('#threadList');
        const html = threads.map(thread => `
      <div class="message-thread" data-user-id="${thread.userId}">
        <div class="avatar">
          <img src="${thread.avatar || 'default-avatar.png'}" alt="avatar">
        </div>
        <div class="thread-content">
          <div class="username">${thread.username}</div>
          <div class="last-message">${thread.lastMessage}</div>
        </div>
        <div class="thread-info">
          <div class="time">${formatTime(thread.lastMessageTime)}</div>
          ${thread.unreadCount > 0 ? `<div class="unread-count">${thread.unreadCount}</div>` : ''}
        </div>
      </div>
    `).join('');

        $threadList.html(html);
    }

    // 加载聊天历史
    function loadChatHistory(userId, isLoadMore = false) {
        if (isLoading) return;
        isLoading = true;

        MessageAPI.getHistory(currentUserId, userId, currentPage, pageSize)
            .then(response => {
                if (response.code === 200) {
                    renderChatHistory(response.data.records, isLoadMore);
                    if (!isLoadMore) {
                        scrollToBottom();
                    }
                } else {
                    console.error('加载聊天历史失败:', response.message);
                }
            })
            .finally(() => {
                isLoading = false;
            });
    }

    // 渲染聊天历史
    function renderChatHistory(messages, isLoadMore) {
        const $chatHistory = $('#chatHistory');
        const html = messages.map(message => `
      <div class="message ${message.senderId === currentUserId ? 'message-right' : 'message-left'}">
        <div class="message-avatar">
          <img src="${message.senderAvatar || 'default-avatar.png'}" alt="avatar">
        </div>
        <div class="message-content">
          <div class="message-info">
            <span class="message-sender">${message.senderName}</span>
            <span class="message-time">${formatTime(message.createTime)}</span>
          </div>
          <div class="message-body">${message.content}</div>
          <div class="message-actions">
            ${message.senderId === currentUserId ? '<span class="action-delete delete-message" data-message-id="${message.id}">删除</span>' : ''}
          </div>
        </div>
      </div>
    `).join('');

        if (isLoadMore) {
            $chatHistory.prepend(html);
        } else {
            $chatHistory.html(html);
        }
    }

    // 处理发送消息
    function handleSendMessage(e) {
        e.preventDefault();
        const content = $('#messageInput').val().trim();
        if (!content || !selectedUserId) {
            alert('请输入消息内容或选择聊天对象');
            return;
        }

        const messageData = {
            senderId: currentUserId,
            receiverId: selectedUserId,
            content: content,
            parentId: null
        };

        MessageAPI.sendMessage(messageData)
            .then(response => {
                if (response.code === 200) {
                    $('#messageInput').val('');
                    loadChatHistory(selectedUserId);
                } else {
                    console.error('发送消息失败:', response.message);
                }
            });
    }

    // 处理线程选择
    function handleThreadSelect() {
        const userId = $(this).data('user-id');
        if (selectedUserId === userId) return;

        selectedUserId = userId;
        currentPage = 1;
        $('#chatUser').text($(this).find('.username').text());
        loadChatHistory(userId);
    }

    // 处理删除消息
    function handleDeleteMessage() {
        const messageId = $(this).data('message-id');
        if (!messageId) return;

        if (confirm('确定要删除这条消息吗？')) {
            MessageAPI.deleteMessage(messageId, { id: currentUserId })
                .then(response => {
                    if (response.code === 200) {
                        loadChatHistory(selectedUserId);
                    } else {
                        console.error('删除消息失败:', response.message);
                    }
                });
        }
    }

    // 处理滚动加载
    function handleScroll() {
        const $chatHistory = $('#chatHistory');
        if ($chatHistory.scrollTop() === 0 && !isLoading) {
            currentPage++;
            loadChatHistory(selectedUserId, true);
        }
    }

    // 开始新对话
    function handleStartNewChat() {
        const receiverId = $('#contactSelect').val();
        if (!receiverId) {
            alert('请选择联系人');
            return;
        }

        selectedUserId = receiverId;
        $('#newMessageModal').modal('hide');
        loadChatHistory(receiverId);
    }

    // 开始消息轮询
    function startMessagePolling() {
        setInterval(() => {
            if (selectedUserId) {
                loadChatHistory(selectedUserId);
            }
            loadMessageThreads();
        }, 10000); // 每10秒轮询一次
    }

    // 工具函数：格式化时间
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString();
    }

    // 工具函数：滚动到底部
    function scrollToBottom() {
        const $chatHistory = $('#chatHistory');
        $chatHistory.scrollTop($chatHistory.scrollHeight);
    }

    // 初始化页面
    initPage();
});