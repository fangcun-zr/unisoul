$(document).ready(function() {

    // 缓存DOM元素（性能优化）
    const $historyModal = $('#historyModal');
    const $loadingState = $historyModal.find('.loading-state');
    const $contentContainer = $historyModal.find('.history-content');
    const $historyName = $('#historyName');
    const $historyTime = $('#historyTime');
    const $historyResults = $('#historyResults');

    // 全局状态管理对象
    const AssessmentState = {
        currentSession: null,
        currentAssessment: null,
        currentQuestionIndex: 0,
        totalQuestions: 0,
        answers: {},
        questions: []
    };

    // 初始化
    function init() {
        loadAssessments();
        bindAllEvents();
        initProgressBar();
    }

    // 事件绑定总控
    function bindAllEvents() {
        // 分类筛选
        $('.category-btn').on('click', function() {
            const category = $(this).data('category');
            loadAssessments(category);
        });

        // 新增报告保存事件绑定
        $('#saveReport').on('click', handleSaveReport);
        $('#cancelSaveReport').on('click', handleCancelSave);

        // 开始测评
        $(document).on('click', '.start-assessment', handleStartAssessment);

        // 历史记录点击事件
        $('#historyBtn').on('click', function(e) {
            e.preventDefault();
            loadHistoryData();
            $historyModal.modal('show');
        });

        // 动态元素事件绑定
        $(document)
            .on('click', '.option-item', handleOptionSelect)
            .on('click', '#prevQuestion', handlePrevQuestion)
            .on('click', '#nextQuestion', handleNextQuestion)
            .on('click', '#submitAssessment', handleSubmit);
    }

    // 初始化进度条
    function initProgressBar() {
        $('.progress-bar').css('width', '0%');
    }

    // 加载测评列表
    function loadAssessments(categoryId = 0) {
        showLoading(true);
        AssessmentAPI.getAssessmentList(categoryId)
            .done(response => {
                renderAssessments(response.data);
            })
            .fail(() => {
                showAlert('加载失败，请稍后重试', 'danger');
            })
            .always(() => {
                showLoading(false);
            });
    }

    // 渲染测评列表（直接处理数组）
    function renderAssessments(assessments) {
        const template = assessments.length > 0 ? assessments.map(item => `
        <div class="col-md-4 col-sm-6 mb-4">
            <div class="card assessment-card h-100 shadow-sm">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <h5 class="card-title mb-0">${item.name}</h5>
                        <span class="badge bg-primary">${getCategoryName(item.categoryId)}</span>
                    </div>
                    
                    <p class="card-text text-muted flex-grow-1">
                        ${item.introduction || '暂无详细说明'}
                    </p>
                    
                    <div class="stats-container mt-2">
                        <div class="d-flex justify-content-between text-muted small">
                            <span title已完成测试人次>
                                <i class="fas fa-users"></i>
                                ${item.csCount || 0}人完成
                            </span>
                            <span title="题目数量">
                                <i class="fas fa-list-ol"></i>
                                ${item.questionsCount}题
                            </span>
                        </div>
                    </div>
                    
                    <div class="d-grid mt-3">
                        <button class="btn btn-primary start-assessment" 
                                data-id="${item.id}">
                            <i class="fas fa-play-circle me-2"></i>
                            开始测试
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('') : `
        <div class="col-12 text-center py-5">
            <div class="empty-state">
                <i class="fas fa-box-open fs-1 text-secondary mb-3"></i>
                <p class="text-muted mb-0">暂时没有可用测评</p>
            </div>
        </div>
    `;

        $('#assessmentList').html(template);
    }

    // 分类转换辅助函数
    function getCategoryName(categoryId) {
        return {
            1: '学习测评',
            2: '就业测评',
            3: '心理测评',
            4: '性格测试'
        }[categoryId] || '通用测评';
    }

    // 处理开始测评
    function handleStartAssessment() {

        const assessmentId = $(this).data('id');

        showLoading(true);

        // 重置状态
        AssessmentState.questions = [];
        AssessmentState.currentQuestionIndex = 0;
        AssessmentState.answers = {};
        $('.progress-bar').css('width', '0%');

        AssessmentAPI.startAssessment(assessmentId)
            .done(response => {
                AssessmentState.currentSession = response.data;
                AssessmentState.currentAssessment = assessmentId;
                loadAssessmentQuestions();
            })
            .fail(() => {
                showAlert('无法开始测评', 'danger');
                showLoading(false);
            });
    }

    // 加载题目
    function loadAssessmentQuestions() {
        AssessmentAPI.getQuestions(
            AssessmentState.currentSession,
            AssessmentState.currentAssessment
        )
            .done(response => {
                AssessmentState.questions = response.data.map(q => ({
                    ...q,
                    options: JSON.parse(q.options)
                }));
                AssessmentState.totalQuestions = response.data.length;
                showQuestionModal();
            })
            .fail(() => {
                showAlert('加载题目失败', 'warning');
                showLoading(false);
            });
    }

    // 显示题目模态框
    function showQuestionModal() {
        renderCurrentQuestion();
        updateProgressDisplay();
        $('#assessmentModal').modal('show');
        showLoading(false);
    }

    // 渲染当前题目
    function renderCurrentQuestion() {
        const currentQuestion = AssessmentState.questions[AssessmentState.currentQuestionIndex];
        if (!currentQuestion) return;

        const options = currentQuestion.options.map((option, index) => {
            const isChecked = isOptionSelected(currentQuestion.sortOrder, option);
            const inputType = getInputType(currentQuestion.questionType);

            return `
                <div class="option-item ${isChecked ? 'selected' : ''}" 
                     data-value="${option}">
                    <div class="form-check">
                        <input class="form-check-input" 
                               type="${inputType}"
                               name="questionOption" 
                               ${isChecked ? 'checked' : ''}>
                        <label class="form-check-label">${option}</label>
                    </div>
                </div>
            `;
        }).join('');

        const questionHtml = `
            <div class="question-content">
                <h4 class="mb-3">${currentQuestion.topic}</h4>
                <div class="question-meta mb-4">
                    <span class="badge bg-secondary me-2">
                        第${currentQuestion.sortOrder}题
                    </span>
                    <span class="text-muted">
                        ${getQuestionTypeText(currentQuestion.questionType)}
                    </span>
                </div>
                <div class="options-container">${options}</div>
            </div>
        `;

        $('#questionContainer').html(questionHtml);
        updateNavigationButtons();
    }

    // 处理选项选择
    function handleOptionSelect() {
        const value = $(this).data('value');
        const question = AssessmentState.questions[AssessmentState.currentQuestionIndex];

        if (!question) return;

        const currentAnswers = AssessmentState.answers[question.sortOrder] || [];
        const questionType = question.questionType;

        let newAnswers;
        if (questionType === 'multiple_choice') {
            newAnswers = currentAnswers.includes(value)
                ? currentAnswers.filter(v => v !== value)
                : [...currentAnswers, value];
        } else {
            newAnswers = [value];
        }

        AssessmentState.answers[question.sortOrder] = newAnswers;
        renderCurrentQuestion();
    }

    // 处理上一题
    function handlePrevQuestion() {
        if (AssessmentState.currentQuestionIndex > 0) {
            AssessmentState.currentQuestionIndex--;
            renderCurrentQuestion();
            updateProgressDisplay();
        }
    }

    // 处理下一题
    function handleNextQuestion() {
        if (validateCurrentQuestion()) {
            AssessmentState.currentQuestionIndex++;
            renderCurrentQuestion();
            updateProgressDisplay();
        } else {
            showAlert('请先完成当前题目', 'warning');
        }
    }

    // 更新进度显示
    function updateProgressDisplay() {
        const progress = ((AssessmentState.currentQuestionIndex + 1) / AssessmentState.totalQuestions) * 100;
        $('.progress-bar')
            .css('width', `${progress}%`)
            .text(`进度：${Math.round(progress)}%`);
    }

    // 更新导航按钮
    function updateNavigationButtons() {
        const controlsHtml = `
            <div class="navigation-controls mt-4">
                ${AssessmentState.currentQuestionIndex > 0 ? `
                    <button class="btn btn-secondary me-2" id="prevQuestion">
                        <i class="fas fa-arrow-left"></i> 上一题
                    </button>
                ` : ''}
                
                ${AssessmentState.currentQuestionIndex < AssessmentState.totalQuestions - 1 ? `
                    <button class="btn btn-primary" id="nextQuestion">
                        下一题 <i class="fas fa-arrow-right"></i>
                    </button>
                ` : `
                    <button class="btn btn-success" id="submitAssessment">
                        <i class="fas fa-check-circle"></i> 提交答案
                    </button>
                `}
            </div>
        `;
        $('#navigationContainer').html(controlsHtml);
    }

    // 验证当前题目
    function validateCurrentQuestion() {
        const question = AssessmentState.questions[AssessmentState.currentQuestionIndex];
        const answers = AssessmentState.answers[question.sortOrder];

        switch(question.questionType) {
            case 'single_choice':
            case 'scale':
                return answers?.length === 1;
            case 'multiple_choice':
                return answers?.length >= 1;
            default:
                return false;
        }
    }

    // 修改后的提交处理函数
    function handleSubmit() {
        if (!validateAllAnswers()) {
            showAlert('请完成所有题目', 'warning');
            return;
        }

        $('#assessmentModal').modal('hide');
        $('#loadingModal').modal('show');

        // 生成符合接口要求的答案格式
        const formattedData = {
            assessment_session_id: AssessmentState.currentSession,
            id: AssessmentState.currentAssessment,
            answers: formatSubmissionAnswers()
        };

        AssessmentAPI.submitAnswers(formattedData)
            .done(response => {
                showResultReport(response.data.content);
            })
            .fail(() => {
                $('#loadingModal').modal('hide');
                showAlert('提交失败，请重试', 'danger');
            });
    }

// 新增答案格式化方法
    function formatSubmissionAnswers() {
        return AssessmentState.questions.map(question => {
            const answerValues = AssessmentState.answers[question.sortOrder] || [];

            return {
                topic: question.topic,
                options: Array.isArray(answerValues) ?
                    answerValues.join(', ') : // 多选答案用逗号分隔
                    answerValues.toString()   // 单选答案直接转换
            };
        });
    }

    // 显示结果报告
    function showResultReport(content) {
        $('#loadingModal').modal('hide');

        const reportHtml = `
            <div class="report-content">
                <h4 class="text-primary mb-4">分析结论</h4>
                <div class="conclusion mb-4">${content.conclusion}</div>
                
                <hr class="my-4">
                
                <div class="suggestions bg-light p-3 rounded">
                    <h5 class="text-success mb-3">专业建议</h5>
                    <div class="advice">${content.suggestions}</div>
                </div>
            </div>
        `;

        $('#reportContent').html(reportHtml);
        $('#reportModal').modal('show');
    }

    // 辅助函数：获取题型文本
    function getQuestionTypeText(type) {
        const typeMap = {
            single_choice: '单选题',
            multiple_choice: '多选题',
            scale: '评分题'
        };
        return typeMap[type] || '未知题型';
    }

    // 辅助函数：获取输入类型
    function getInputType(questionType) {
        return questionType === 'multiple_choice' ? 'checkbox' : 'radio';
    }

    // 辅助函数：检查选项是否选中
    function isOptionSelected(questionId, value) {
        return AssessmentState.answers[questionId]?.includes(value);
    }

    // 辅助函数：验证全部答案
    function validateAllAnswers() {
        return Object.keys(AssessmentState.answers).length === AssessmentState.totalQuestions;
    }

    // 辅助函数：显示加载状态
    function showLoading(show) {
        $('.loading-overlay').toggle(show);
    }

    // 辅助函数：显示提示信息
    function showAlert(message, type = 'success') {
        const alert = $(`
            <div class="alert alert-${type} alert-dismissible fade show" 
                 role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999;">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);
        $('body').append(alert);
        setTimeout(() => alert.alert('dispose'), 3000);
    }



// 新增：处理保存报告
    function handleSaveReport() {
        // 构建报告数据
        const reportData = {
            sessionUuid: AssessmentState.currentSession, // 从全局状态获取sessionUuid
            generatedTime: getCurrentTimeArray(), // 生成时间数组
            content: extractReportContent() // 从模态框提取报告内容
        };

        // 显示加载状态
        showLoading(true);
        $('#reportModal').modal('hide');

        // 发送保存请求
        AssessmentAPI.saveReport(reportData)
            .done(() => {
                showAlert('报告保存成功', 'success');
            })
            .fail(() => {
                showAlert('报告保存失败，请重试', 'danger');
            })
            .always(() => {
                showLoading(false);
                $('#reportModal').modal('show');
            });
    }

// 新增：取消保存处理
    function handleCancelSave() {
        if (confirm('确定放弃保存报告吗？')) {
            $('#reportModal').modal('hide');
        }
    }

// 新增：从模态框提取报告内容
    function extractReportContent() {
        return {
            conclusion: $('#reportContent .conclusion').text().trim(), // 提取结论
            suggestions: $('#reportContent .advice').text().trim(), // 提取建议
            rawContent: buildRawContent() // 构建原始内容
        };
    }

// 新增：构建原始内容
    function buildRawContent() {
        const conclusion = $('#reportContent .conclusion').text().trim();
        const suggestions = $('#reportContent .advice').text().trim();
        return `分析结论：\n${conclusion}\n\n专业建议：\n${suggestions}`;
    }

// 新增：生成时间数组
    function getCurrentTimeArray() {
        const now = new Date();
        return [
            now.getFullYear(), // 年
            now.getMonth() + 1, // 月（修正为1-12）
            now.getDate(), // 日
            now.getHours(), // 小时
            now.getMinutes(), // 分钟
            now.getSeconds(), // 秒
            now.getMilliseconds() * 1000000 // 纳秒
        ];
    }

    // 加载历史数据（修复版）
    function loadHistoryData() {
        // 重置状态
        $loadingState.removeClass('d-none');
        $contentContainer.addClass('d-none');
        $historyResults.empty();

        AssessmentAPI.getHistory()
            .done(response => {
                // 添加状态码验证
                if (response.code !== 1 || !Array.isArray(response.data)) {
                    throw new Error('无效的响应格式');
                }

                renderHistory(response.data);
                $loadingState.addClass('d-none');
                $contentContainer.removeClass('d-none');
            })
            .fail(xhr => {
                showErrorAlert(xhr);
                $historyModal.modal('hide');
            });
    }

// 正确渲染方法（适配新数据结构）
    function renderHistory(historyList) {
        // 清空原有内容
        $historyResults.empty();

        // 遍历历史记录数组
        historyList.forEach(session => {
            // 时间格式化（适配数组格式）
            // 正确解构数组参数
            const [year, month, day, hours, minutes, seconds] = session.createdAt;

            // 创建Date对象（月份需要-1）
            const createdAt = new Date(
                year,
                month - 1, // 关键修正点：月份0-11
                day,
                hours,
                minutes,
                seconds
            );

            // 构建条目模板
            const $item = $(`
            <div class="card mb-3 shadow-sm">
                <div class="card-header bg-light">
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">${formatDateTime(createdAt)}</small>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title text-primary mb-3">
                        <i class="fas fa-file-alt me-2"></i>分析结论
                    </h5>
                    <p class="card-text">${session.content.conclusion}</p>
                    
                    <h5 class="card-title text-success mt-4 mb-3">
                        <i class="fas fa-lightbulb me-2"></i>专业建议
                    </h5>
                    <div class="suggestions-list">
                        ${session.content.suggestions.split('。').filter(Boolean).map(s => `
                            <div class="d-flex mb-2">
                                <i class="fas fa-angle-right text-success me-2 mt-1"></i>
                                <span>${s.trim()}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `);

            $historyResults.append($item);
        });
    }

    //格式化时间
    function formatDateTime(createdAtArray) {
        // 参数严格校验
        if (!Array.isArray(createdAtArray)) {
            console.error("时间参数必须是数组", createdAtArray);
            return "时间格式错误";
        }

        if (createdAtArray.length < 3) {
            console.error("时间数组至少需要包含年月日", createdAtArray);
            return "时间数据不完整";
        }

        // 类型转换（防御性处理）
        const toNumber = (val, index) => {
            const num = Number(val);
            if (isNaN(num)) {
                console.error(`第${index+1}个元素不是有效数字:`, val);
                return null;
            }
            return num;
        };

        // 提取年月日（允许忽略时分秒）
        const year = toNumber(createdAtArray, 0);
        const month = toNumber(createdAtArray, 1);
        const day = toNumber(createdAtArray, 2);

        // 验证数字有效性
        if ([year, month, day].some(v => v === null)) {
            return "包含无效数字";
        }

        // 范围验证
        if (year < 1970 || year > 2100) return "年份超出范围";
        if (month < 1 || month > 12) return "月份无效";
        if (day < 1 || day > 31) return "日期无效";

        // 创建日期对象（兼容处理）
        const date = new Date(year, month - 1, day);

        // 验证日期有效性
        const isValidDate = (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
        );

        if (!isValidDate) {
            console.error("日期不合法:", { year, month, day });
            return "日期不存在";
        }

        // 格式化输出（示例：2025年3月10日）
        return `${year}年${month}月${day}日`;
    }
    // 初始化执行
    init();
});