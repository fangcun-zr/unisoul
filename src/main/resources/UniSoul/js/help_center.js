// help-center.js

$(document).ready(function() {
    // 初始化页面
    initPage();

    // 绑定事件
    bindEvents();
});

function initPage() {
    // 加载热门问题
    loadHotQuestions();

    // 加载默认帮助分类内容
    loadHelpContent('all');

    // 初始化聊天窗口
    initChatWindow();
}

function bindEvents() {
    // 搜索框事件
    $('.btn-search').on('click', function() {
        const query = $('.search-box input').val();
        if (query) {
            searchHelp(query);
        }
    });

    // 帮助分类标签点击事件
    $('.category-tab').on('click', function() {
        const category = $(this).data('category');
        loadHelpContent(category);
        $('.category-tab').removeClass('active');
        $(this).addClass('active');
    });

    // 提交反馈表单
    $('#submitFeedback').on('click', function() {
        submitFeedback();
    });

    // 打开聊天窗口
    $('.contact-card .btn-primary').on('click', function() {
        $('#chatWindow').fadeIn();
    });

    // 关闭聊天窗口
    $('#closeChatBtn').on('click', function() {
        $('#chatWindow').fadeOut();
    });

    // 发送聊天消息
    $('.btn-send').on('click', function() {
        sendChatMessage();
    });
}

function loadHotQuestions() {
    HelpCenterAPI.getHotQuestions().done(function(data) {
        const questionGrid = $('.question-grid');
        questionGrid.empty();
        data.forEach(function(question) {
            const questionCard = `
                <div class="question-card animate__animated animate__fadeInUp">
                    <div class="question-icon">
                        <i class="fas fa-question-circle"></i>
                    </div>
                    <h4>${question.title}</h4>
                    <p>${question.description}</p>
                    <a href="#" class="card-link">查看详情 <i class="fas fa-chevron-right"></i></a>
                </div>
            `;
            questionGrid.append(questionCard);
        });
    }).fail(function(error) {
        console.error('Failed to load hot questions:', error);
    });
}

function loadHelpContent(category) {
    HelpCenterAPI.getHelpContent(category).done(function(data) {
        const helpContent = $('.help-content');
        helpContent.empty();
        data.forEach(function(item) {
            const contentItem = `
                <div class="help-item">
                    <h4>${item.title}</h4>
                    <p>${item.content}</p>
                </div>
            `;
            helpContent.append(contentItem);
        });
    }).fail(function(error) {
        console.error('Failed to load help content:', error);
    });
}

function submitFeedback() {
    const feedbackData = {
        type: $('#feedbackForm select[name="type"]').val(),
        content: $('#feedbackForm textarea[name="content"]').val(),
        contact: $('#feedbackForm input[name="contact"]').val()
    };

    HelpCenterAPI.submitFeedback(feedbackData).done(function(response) {
        alert('反馈提交成功！');
        $('#feedbackModal').modal('hide');
    }).fail(function(error) {
        console.error('Failed to submit feedback:', error);
        alert('反馈提交失败，请重试。');
    });
}

function initChatWindow() {
    HelpCenterAPI.getChatMessages().done(function(data) {
        const chatMessages = $('.chat-messages');
        chatMessages.empty();
        data.forEach(function(message) {
            const messageElement = `
                <div class="message">
                    <p>${message.text}</p>
                </div>
            `;
            chatMessages.append(messageElement);
        });
    }).fail(function(error) {
        console.error('Failed to load chat messages:', error);
    });
}

function sendChatMessage() {
    const message = $('.chat-input input').val();
    if (message) {
        HelpCenterAPI.sendChatMessage(message).done(function(response) {
            $('.chat-input input').val('');
            const chatMessages = $('.chat-messages');
            const messageElement = `
                <div class="message">
                    <p>${message}</p>
                </div>
            `;
            chatMessages.append(messageElement);
            chatMessages.scrollTop(chatMessages[0].scrollHeight);
        }).fail(function(error) {
            console.error('Failed to send message:', error);
        });
    }
}

function searchHelp(query) {
    // 实现搜索功能
    console.log('Searching for:', query);
    // 这里可以调用API进行搜索
}