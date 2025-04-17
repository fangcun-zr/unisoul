$(document).ready(function () {
    // 全局变量
    const currentUserId = localStorage.getItem('userId') || 1; // 当前用户ID
    let selectedUserId = null; // 当前选中的聊天对象ID
    let currentPage = 1; // 当前分页
    const pageSize = 20; // 每页条数
    let isLoading = false; // 是否正在加载数据

    // 初始化页面
    function initPage() {
        initAutoResize();
        loadMessageThreads(); // 加载私信列表
        bindEvents(); // 绑定事件
        startMessagePolling(); // 开始消息轮询
        loadContacts();
    }

    // 绑定事件
    function bindEvents() {
        // 发送消息表单提交
        console.log('绑定表单提交事件'); // 调试输出

        $('#sendMessageForm').off('submit').on('submit', handleSendMessage);


        // $('#sendMessageForm').on('submit', handleSendMessage);

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
    function loadContacts() {
        MessageAPI.getAll(currentUserId)
            .then(response => {
                if (response.code === 0) {
                    const $select = $('#contactSelect');
                    response.data.forEach(contact => {
                        $select.append(`<option value="${contact.id}">${contact.name}</option>`);
                    });
                }
            });
    }
    // 加载私信列表
    // function loadMessageThreads() {
    //     if (isLoading) return;
    //     isLoading = true;
    //
    //     MessageAPI.getThreads(currentUserId, currentPage, pageSize)
    //         .then(response => {
    //             console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    //             console.log(response.code)
    //             if (response.code === 0) {
    //                 renderThreadList(response.data.records);
    //             } else {
    //                 console.error('加载私信列表失败111112222:', response.message);
    //             }
    //         })
    //         .finally(() => {
    //             isLoading = false;
    //             $('#loadingSpinner').hide();
    //         });
    // }
    function setSendButtonState(isLoading) {
        const $btn = $('.send-button');
        $btn.prop('disabled', isLoading);
        $btn.find('i').toggleClass('fa-paper-plane fa-spinner fa-spin', isLoading);
    }
    function loadMessageThreads() {
        if (isLoading) return;
        isLoading = true;
        // 记录当前页码，避免外部修改导致竞态
        const targetPage = currentPage;
        MessageAPI.getThreads(currentUserId, targetPage, pageSize)
            .then(response => {
                if (response.code === 0 && response.data?.records) {
                    // 若是第一页，先清空列表
                    if (targetPage === 1) {
                        $('#threadList').empty();
                    }
                    renderThreadList(response.data.records);
                    // 仅在成功时递增页码
                    currentPage = targetPage + 1;
                } else {
                    console.error('加载失败:', response.message);
                    showErrorToast('加载失败: ' + response.message);
                }
            })
            .catch(error => {
                console.error(error);
                return Promise.reject(error); // 保持链式
            })
            .always(() => { // 使用 jQuery 的 .always()
                isLoading = false;
            });
    }




    // 渲染私信列表
    function renderThreadList(threads) {
        const $threadList = $('#threadList');
        const html = threads.map(thread => `
      <div class="message-thread" data-user-id="${thread.contactId}">
        <div class="avatar">
          <img src="${thread.avatar || 'default-avatar.png'}" alt="avatar">
        </div>
        <div class="thread-content">
          <div class="username">${thread.contactId}</div>
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
        console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
        if (isLoading) return;
        isLoading = true;

        MessageAPI.getHistory(currentUserId, userId, currentPage, pageSize)
            .then(response => {
                if (response.code === 0) {
                    renderChatHistory(response.data.records, isLoadMore);
                    if (!isLoadMore) {
                        scrollToBottom();
                    }
                } else {
                    console.error('加载聊天历史失败:', response.message);
                }
            })
            .catch(error => {
                console.error(error);
                return Promise.reject(error); // 保持链式
            })
            .always(() => { // 使用 jQuery 的 .always()
                isLoading = false;
            });
    }

    // 渲染聊天历史
    function renderChatHistory(messages, isLoadMore) {
        console.log(messages)
        const $chatHistory = $('#chatHistory');
        const html = messages.map(message => `
      <div class="message ${message.senderId === currentUserId ? 'message-right' : 'message-left'}">
        <div class="message-avatar">
          <img src="${message.senderAvatar || 'default-avatar.png'}" alt="avatar">
        </div>
        <div class="message-content">
          <div class="message-info">
            <span class="message-sender">${message.sendName}</span>
            <span class="message-time">${message.sendTime}</span>
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
                if (response.code === 0) {
                    $('#messageInput').val('');
                    loadChatHistory(selectedUserId);
                    scrollToBottom();
                } else {
                    showErrorToast(`发送失败: ${response.message}`);
                }
            })
            .catch(error => {
                console.error('发送请求异常:', error);
                showErrorToast('网络异常，请检查连接');
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
    let pollingInterval;

    function startMessagePolling() {
        // 先清除已有轮询
        if (pollingInterval) clearInterval(pollingInterval);

        pollingInterval = setInterval(() => {
            console.log('执行消息轮询...');
            if (selectedUserId) {
                loadChatHistory(selectedUserId);
            }
            loadMessageThreads();
        }, 10000);
    }

// 在窗口失去焦点时暂停轮询
    $(window).on('blur', () => clearInterval(pollingInterval));
    $(window).on('focus', startMessagePolling);
    function initAutoResize() {
        $('#messageInput').on('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
    // 工具函数：格式化时间
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // 工具函数：滚动到底部
    function handleScroll() {
        const $chatHistory = $('#chatHistory');
        const scrollThreshold = 100; // 提前加载阈值

        if ($chatHistory.scrollTop() < scrollThreshold &&
            !isLoading &&
            selectedUserId) {
            currentPage++;
            loadChatHistory(selectedUserId, true);
        }
    }

    // 初始化页面
    $(document).ready(function() {
        try {
            // 确保依赖库加载完成
            if (!window.$ || !window.bootstrap) {
                throw new Error('依赖库未正确加载');
            }

            // 初始化工具提示
            $('[data-bs-toggle="tooltip"]').tooltip();

            // 执行页面初始化
            initPage();

            // 调试输出
            console.log('页面初始化完成');
        } catch (error) {
            console.error('初始化失败:', error);
            showErrorToast('页面初始化失败，请刷新重试');
        }
    });
});
