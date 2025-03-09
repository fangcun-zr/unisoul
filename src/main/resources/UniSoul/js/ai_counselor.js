$(document).ready(function() {
    // 全局变量
    let currentSession = null;
    let isProcessing = false;
    let messageQueue = [];

    // 初始化页面
    function initPage() {
        loadChatHistory();
        bindEvents();
        initializeUI();
    }

    // 初始化UI组件
    function initializeUI() {
        // 初始化ElementUI组件
        ELEMENT.Loading.service({
            target: '.chat-container'
        });

        // 自动调整文本框高度
        adjustTextareaHeight();

        // 显示欢迎消息
        showWelcomeMessage();
    }

    // 绑定事件
    function bindEvents() {
        // 侧边栏切换
        $('.toggle-sidebar').on('click', function() {
            $('.sidebar').toggleClass('show');
            $('.main-content').toggleClass('sidebar-hidden');
        });

        // 新建会话
        $('.new-chat-btn').on('click', createNewChat);

        // 发送消息
        $('.send-btn').on('click', sendMessage);
        $('#messageInput').on('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // 文件上传
        $('.upload-btn').on('click', function() {
            $('#fileInput').click();
        });

        $('#fileInput').on('change', handleFileUpload);

        // 工具按钮
        $('.tool-btn').on('click', function() {
            const tool = $(this).data('tool');
            handleToolAction(tool);
        });

        // 设置按钮
        $('.settings-btn').on('click', function() {
            $('#settingsModal').modal('show');
        });
    }

    // 加载聊天历史
    function loadChatHistory() {
        AICounselorAPI.getChatHistory()
            .then(response => {
                renderChatHistory(response);
            })
            .catch(error => {
                ELEMENT.Message.error('加载历史记录失败');
            });
    }

    // 渲染聊天历史
    function renderChatHistory(history) {
        const historyHtml = history.map(session => `
            <div class="chat-session" data-id="${session.id}">
                <i class="fas fa-comments"></i>
                <span class="session-title">${session.title}</span>
                <div class="session-actions">
                    <button class="delete-btn" data-id="${session.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        $('.chat-history').html(historyHtml);

        // 绑定会话点击事件
        $('.chat-session').on('click', function() {
            const sessionId = $(this).data('id');
            loadSession(sessionId);
        });

        // 绑定删除事件
        $('.delete-btn').on('click', function(e) {
            e.stopPropagation();
            const sessionId = $(this).data('id');
            deleteSession(sessionId);
        });
    }

    // 创建新会话
    function createNewChat() {
        AICounselorAPI.createNewSession()
            .then(response => {
                currentSession = response.sessionId;
                clearChat();
                showWelcomeMessage();
            })
            .catch(error => {
                ELEMENT.Message.error('创建会话失败');
            });
    }

    // 发送消息
    function sendMessage() {
        if (isProcessing) return;

        const input = $('#messageInput');
        const message = input.val().trim();

        if (!message) return;

        // 添加用户消息到界面
        appendMessage({
            type: 'user',
            content: message
        });

        // 清空输入框
        input.val('');
        adjustTextareaHeight();

        // 发送消息到服务器
        isProcessing = true;
        showTypingIndicator();

        AICounselorAPI.sendMessage({
            sessionId: currentSession,
            message: message
        })
            .then(response => {
                removeTypingIndicator();
                appendMessage({
                    type: 'ai',
                    content: response.reply
                });
            })
            .catch(error => {
                ELEMENT.Message.error('发送消息失败');
                removeTypingIndicator();
            })
            .finally(() => {
                isProcessing = false;
            });
    }

    // 处理文件上传
    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('sessionId', currentSession);

        ELEMENT.Loading.service({
            text: '正在上传文件...'
        });

        AICounselorAPI.uploadFile(formData)
            .then(response => {
                ELEMENT.Message.success('文件上传成功');
                appendMessage({
                    type: 'user',
                    content: `[文件] ${file.name}`,
                    file: response.fileUrl
                });
            })
            .catch(error => {
                ELEMENT.Message.error('文件上传失败');
            })
            .finally(() => {
                ELEMENT.Loading.service().close();
            });
    }

    // 显示欢迎消息
    function showWelcomeMessage() {
        appendMessage({
            type: 'ai',
            content: '你好！我是心旅坊AI助手，很高兴见到你。让我们开始对话吧！'
        });
    }

    // 添加消息到界面
    function appendMessage(message) {
        const messageHtml = `
            <div class="message ${message.type}">
                <div class="message-avatar">
                    <img src="../images/${message.type}-avatar.png" alt="Avatar">
                </div>
                <div class="message-content">
                    ${message.content}
                    ${message.file ? `<div class="file-attachment">
                        <a href="${message.file}" target="_blank">
                            <i class="fas fa-file"></i> 查看文件
                        </a>
                    </div>` : ''}
                </div>
            </div>
        `;

        $('.messages-container').append(messageHtml);
        scrollToBottom();
    }

    // 滚动到底部
    function scrollToBottom() {
        const container = $('.chat-content');
        container.scrollTop(container[0].scrollHeight);
    }

    // 调整文本框高度
    function adjustTextareaHeight() {
        const textarea = $('#messageInput')[0];
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }

    // 显示输入指示器
    function showTypingIndicator() {
        const typingHtml = `
            <div class="message ai typing">
                <div class="message-avatar">
                    <img src="../images/ai-avatar.png" alt="AI">
                </div>
                <div class="message-content">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;

        $('.messages-container').append(typingHtml);
        scrollToBottom();
    }

    // 移除输入指示器
    function removeTypingIndicator() {
        $('.typing').remove();
    }

    // 初始化页面
    initPage();
});