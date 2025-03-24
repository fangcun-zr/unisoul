$(document).ready(function() {
    // 测评管理相关变量
    let selectedCategoryId = 0;

    // 初始加载测评列表
    loadAssessmentsList();

    // 分类筛选变化事件
    $('#assessmentCategoryFilter').on('change', function() {
        selectedCategoryId = $(this).val() || 0;
        loadAssessmentsList();
    });

    // 添加测评按钮点击事件
    $('#addAssessmentBtn').on('click', function() {
        showAddAssessmentModal();
    });

    // 加载测评列表
    function loadAssessmentsList() {
        const requestData = {
            category_id: parseInt(selectedCategoryId)
        };

        $.ajax({
            url: BASE_API_URL + '/assessment/list',
            type: 'GET',
            data: requestData,
            success: function(response) {
                if (response.code === 1 || response.code === 200 || Array.isArray(response)) {
                    const assessments = Array.isArray(response) ? response : (response.data || []);
                    renderAssessmentsList(assessments);
                } else {
                    console.error("加载测评列表失败:", response.message);
                    $('#assessmentTable tbody').html('<tr><td colspan="5" class="text-center">加载失败，请重试</td></tr>');
                }
            },
            error: function(xhr, status, error) {
                console.error("加载测评列表失败:", error);
                $('#assessmentTable tbody').html('<tr><td colspan="5" class="text-center">加载失败，请重试</td></tr>');
            }
        });
    }

    // 渲染测评列表
    function renderAssessmentsList(assessments) {
        const tbody = $('#assessmentTable tbody');
        tbody.empty();

        if (!assessments || assessments.length === 0) {
            tbody.html('<tr><td colspan="5" class="text-center">暂无测评数据</td></tr>');
            return;
        }

        // 渲染测评列表
        assessments.forEach(function(assessment) {
            // 获取分类名称
            let categoryName = getCategoryName(assessment.category_id);

            const row = `
                <tr data-id="${assessment.id}">
                    <td>${assessment.id}</td>
                    <td>${assessment.name}</td>
                    <td>${categoryName}</td>
                    <td>${assessment.questionsCount || 0}</td>
                    <td class="action-btns">
                        <button class="action-btn action-btn-view view-assessment-btn" data-id="${assessment.id}">查看</button>
                        <button class="action-btn action-btn-edit edit-assessment-btn" data-id="${assessment.id}">编辑</button>
                        <button class="action-btn action-btn-delete delete-assessment-btn" data-id="${assessment.id}">删除</button>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });

        // 绑定操作按钮事件
        bindAssessmentActions();
    }

    // 获取分类名称
    function getCategoryName(categoryId) {
        const categories = {
            0: '全部',
            1: '学习',
            2: '就业',
            3: '心理'
        };

        return categories[categoryId] || '未分类';
    }

    // 绑定测评操作按钮事件
    function bindAssessmentActions() {
        // 查看测评
        $('.view-assessment-btn').off('click').on('click', function() {
            const assessmentId = $(this).data('id');
            viewAssessmentDetail(assessmentId);
        });

        // 编辑测评
        $('.edit-assessment-btn').off('click').on('click', function() {
            const assessmentId = $(this).data('id');
            editAssessment(assessmentId);
        });

        // 删除测评
        $('.delete-assessment-btn').off('click').on('click', function() {
            const assessmentId = $(this).data('id');
            confirmDeleteAssessment(assessmentId);
        });
    }

    // 查看测评详情
    function viewAssessmentDetail(assessmentId) {
        $.ajax({
            url: BASE_API_URL + '/admin/changeAssessment',
            type: 'GET',
            data: { id: assessmentId },
            success: function(response) {
                if (response.code === 1 || response.code === 200) {
                    const assessment = response.data || response;
                    showAssessmentDetailModal(assessment);
                } else {
                    console.error("获取测评详情失败:", response.message);
                    alert("获取测评详情失败");
                }
            },
            error: function(xhr, status, error) {
                console.error("获取测评详情失败:", error);
                alert("获取测评详情失败，请重试");
            }
        });
    }

    // 显示测评详情模态框
    function showAssessmentDetailModal(assessment) {
        let questionsHtml = '';

        if (assessment.questionsVo && assessment.questionsVo.length > 0) {
            assessment.questionsVo.forEach(function(question, index) {
                const options = JSON.parse(question.options);
                let optionsHtml = '';

                // 根据问题类型渲染选项
                if (question.questionType === 'single_choice') {
                    options.forEach(function(option, idx) {
                        optionsHtml += `<div class="option"><span class="option-index">${idx + 1}.</span> ${option}</div>`;
                    });
                } else if (question.questionType === 'multiple_choice') {
                    options.forEach(function(option, idx) {
                        optionsHtml += `<div class="option"><span class="option-index">${idx + 1}.</span> ${option}</div>`;
                    });
                } else if (question.questionType === 'scale') {
                    optionsHtml += '<div class="scale-options">';
                    options.forEach(function(option) {
                        optionsHtml += `<span class="scale-point">${option}</span>`;
                    });
                    optionsHtml += '</div>';
                }

                questionsHtml += `
                    <div class="question-item">
                        <div class="question-header">
                            <span class="question-number">问题 ${index + 1}</span>
                            <span class="question-type">${getQuestionTypeName(question.questionType)}</span>
                        </div>
                        <div class="question-content">
                            <p class="question-title">${question.topic}</p>
                            <div class="question-options">
                                ${optionsHtml}
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            questionsHtml = '<p class="no-questions">该测评暂无题目</p>';
        }

        const modalContent = `
            <div class="assessment-detail">
                <h2>${assessment.name}</h2>
                <div class="assessment-meta">
                    <span>分类: ${getCategoryName(assessment.categoryId || assessment.category_id)}</span>
                    <span>题目数量: ${assessment.questionsCount || 0}</span>
                </div>
                <div class="assessment-intro">
                    <h3>测评介绍</h3>
                    <p>${assessment.introduction}</p>
                </div>
                
                <div class="assessment-questions">
                    <h3>测评题目</h3>
                    ${questionsHtml}
                </div>
            </div>
        `;

        window.adminUtils.showModal('测评详情', modalContent);
    }

    // 获取问题类型名称
    function getQuestionTypeName(type) {
        const types = {
            'single_choice': '单选题',
            'multiple_choice': '多选题',
            'scale': '量表题'
        };

        return types[type] || '未知类型';
    }

    // 编辑测评
    function editAssessment(assessmentId) {
        $.ajax({
            url: BASE_API_URL + '/admin/changeAssessment',
            type: 'GET',
            data: { id: assessmentId },
            success: function(response) {
                if (response.code === 1 || response.code === 200) {
                    const assessment = response.data || response;
                    showEditAssessmentModal(assessment);
                } else {
                    console.error("获取测评信息失败:", response.message);
                    alert("获取测评信息失败");
                }
            },
            error: function(xhr, status, error) {
                console.error("获取测评信息失败:", error);
                alert("获取测评信息失败，请重试");
            }
        });
    }

    // 显示编辑测评模态框
    function showEditAssessmentModal(assessment) {
        let questionsHtml = '';

        if (assessment.questionsVo && assessment.questionsVo.length > 0) {
            assessment.questionsVo.forEach(function(question, index) {
                questionsHtml += generateQuestionFormHtml(question, index);
            });
        }

        const modalContent = `
            <form id="editAssessmentForm">
                <div class="form-group">
                    <label for="assessmentName">测评名称:</label>
                    <input type="text" id="assessmentName" name="name" value="${assessment.name}" required>
                </div>
                <div class="form-group">
                    <label for="assessmentCategory">测评分类:</label>
                    <select id="assessmentCategory" name="category_id" required>
                        <option value="1" ${(assessment.categoryId || assessment.category_id) === 1 ? 'selected' : ''}>学习</option>
                        <option value="2" ${(assessment.categoryId || assessment.category_id) === 2 ? 'selected' : ''}>就业</option>
                        <option value="3" ${(assessment.categoryId || assessment.category_id) === 3 ? 'selected' : ''}>心理</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="assessmentIntro">测评介绍:</label>
                    <textarea id="assessmentIntro" name="introduction" required>${assessment.introduction}</textarea>
                </div>
                
                <h3>测评题目</h3>
                <div id="questionsContainer">
                    ${questionsHtml}
                </div>
                
                <div class="form-actions">
                    <button type="button" id="addQuestionBtn" class="btn btn-primary">添加题目</button>
                    <input type="hidden" name="id" value="${assessment.id}">
                    <input type="hidden" id="questionCount" name="question_count" value="${assessment.questionsVo ? assessment.questionsVo.length : 0}">
                    <button type="submit" class="btn btn-success">保存测评</button>
                </div>
            </form>
        `;

        window.adminUtils.showModal('编辑测评', modalContent);

        // 绑定添加题目按钮事件
        $('#addQuestionBtn').on('click', function() {
            addNewQuestion();
        });

        // 绑定删除题目按钮事件
        bindDeleteQuestionEvents();

        // 绑定表单提交事件
        $('#editAssessmentForm').on('submit', function(e) {
            e.preventDefault();
            saveAssessment();
        });
    }

    // 生成问题表单HTML
    function generateQuestionFormHtml(question, index) {
        const options = question.options ? JSON.parse(question.options) : [];
        let optionsHtml = '';

        options.forEach(function(option, idx) {
            optionsHtml += `
                <div class="option-input">
                    <input type="text" name="questions[${index}].option${idx}" value="${option}" required>
                    <button type="button" class="btn-sm btn-danger remove-option-btn">删除</button>
                </div>
            `;
        });

        return `
            <div class="question-form" data-index="${index}">
                <div class="question-form-header">
                    <h4>问题 ${index + 1}</h4>
                    <button type="button" class="btn-sm btn-danger delete-question-btn" data-id="${question.questionId || ''}">删除题目</button>
                </div>
                <div class="form-group">
                    <label for="question${index}Topic">问题内容:</label>
                    <input type="text" id="question${index}Topic" name="questions[${index}].topic" value="${question.topic}" required>
                </div>
                <div class="form-group">
                    <label for="question${index}Type">问题类型:</label>
                    <select id="question${index}Type" name="questions[${index}].questionType" required>
                        <option value="single_choice" ${question.questionType === 'single_choice' ? 'selected' : ''}>单选题</option>
                        <option value="multiple_choice" ${question.questionType === 'multiple_choice' ? 'selected' : ''}>多选题</option>
                        <option value="scale" ${question.questionType === 'scale' ? 'selected' : ''}>量表题</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>选项:</label>
                    <div class="options-container" id="options${index}">
                        ${optionsHtml}
                    </div>
                    <button type="button" class="btn-sm btn-primary add-option-btn" data-index="${index}">添加选项</button>
                </div>
                <input type="hidden" name="questions[${index}].sortOrder" value="${question.sortOrder || (index + 1)}">
                ${question.questionId ? `<input type="hidden" name="questions[${index}].questionId" value="${question.questionId}">` : ''}
            </div>
        `;
    }

    // 添加新问题
    function addNewQuestion() {
        const questionCount = $('.question-form').length;
        const newQuestion = {
            topic: '',
            questionType: 'single_choice',
            options: '[""]',
            sortOrder: questionCount + 1
        };

        const questionHtml = generateQuestionFormHtml(newQuestion, questionCount);
        $('#questionsContainer').append(questionHtml);

        // 更新问题计数
        $('#questionCount').val(questionCount + 1);

        // 重新绑定删除问题和添加选项按钮事件
        bindDeleteQuestionEvents();
        bindAddOptionEvents();
    }

    // 绑定删除问题按钮事件
    function bindDeleteQuestionEvents() {
        $('.delete-question-btn').off('click').on('click', function() {
            const questionId = $(this).data('id');
            const questionForm = $(this).closest('.question-form');

            if (questionId) {
                // 已存在的问题，需要调用删除API
                deleteQuestion(questionId, function() {
                    removeQuestionForm(questionForm);
                });
            } else {
                // 新添加的问题，直接移除
                removeQuestionForm(questionForm);
            }
        });

        bindAddOptionEvents();
    }

    // 绑定添加选项按钮事件
    function bindAddOptionEvents() {
        $('.add-option-btn').off('click').on('click', function() {
            const index = $(this).data('index');
            const optionsContainer = $(`#options${index}`);
            const optionCount = optionsContainer.find('.option-input').length;

            const newOptionHtml = `
                <div class="option-input">
                    <input type="text" name="questions[${index}].option${optionCount}" value="" required>
                    <button type="button" class="btn-sm btn-danger remove-option-btn">删除</button>
                </div>
            `;

            optionsContainer.append(newOptionHtml);
            bindRemoveOptionEvents();
        });

        bindRemoveOptionEvents();
    }

    // 绑定删除选项按钮事件
    function bindRemoveOptionEvents() {
        $('.remove-option-btn').off('click').on('click', function() {
            $(this).closest('.option-input').remove();
        });
    }

    // 移除问题表单并重新排序
    function removeQuestionForm(questionForm) {
        questionForm.remove();

        // 更新剩余问题的索引和标题
        $('.question-form').each(function(idx) {
            const form = $(this);
            form.attr('data-index', idx);
            form.find('h4').text(`问题 ${idx + 1}`);

            // 更新输入字段的name属性
            form.find('input, select, textarea').each(function() {
                const input = $(this);
                const name = input.attr('name');
                if (name) {
                    input.attr('name', name.replace(/questions\[\d+\]/, `questions[${idx}]`));
                }
            });

            // 更新添加选项按钮的data-index
            form.find('.add-option-btn').attr('data-index', idx);

            // 更新选项容器ID
            form.find('.options-container').attr('id', `options${idx}`);

            // 更新排序值
            form.find('input[name$=".sortOrder"]').val(idx + 1);
        });

        // 更新问题计数
        $('#questionCount').val($('.question-form').length);
    }

    // 删除问题
    function deleteQuestion(questionId, callback) {
        $.ajax({
            url: BASE_API_URL + '/admin/deleteQuestion',
            type: 'DELETE',
            data: { id: questionId },
            success: function(response) {
                console.log('问题已删除');
                if (typeof callback === 'function') {
                    callback();
                }
            },
            error: function(xhr, status, error) {
                console.error("删除问题失败:", error);
                alert("删除问题失败，请重试");
            }
        });
    }

    // 保存测评
    function saveAssessment() {
        const formData = {
            id: parseInt($('#editAssessmentForm input[name="id"]').val()),
            name: $('#assessmentName').val(),
            category_id: parseInt($('#assessmentCategory').val()),
            introduction: $('#assessmentIntro').val(),
            question_count: parseInt($('#questionCount').val()),
            questions: []
        };

        // 收集问题数据
        $('.question-form').each(function(idx) {
            const form = $(this);
            const questionType = form.find('select[name$=".questionType"]').val();

            // 收集选项
            const options = [];
            form.find('.option-input input').each(function() {
                options.push($(this).val());
            });

            const question = {
                topic: form.find('input[name$=".topic"]').val(),
                options: JSON.stringify(options),
                sortOrder: parseInt(form.find('input[name$=".sortOrder"]').val()),
                questionType: questionType
            };

            // 如果有问题ID，添加到数据中
            const questionIdInput = form.find('input[name$=".questionId"]');
            if (questionIdInput.length > 0) {
                question.questionId = parseInt(questionIdInput.val());
            }

            formData.questions.push(question);
        });

        $.ajax({
            url: BASE_API_URL + '/admin/saveAssessment',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                window.adminUtils.closeModal();
                alert('测评已保存');
                loadAssessmentsList(); // 重新加载测评列表
            },
            error: function(xhr, status, error) {
                console.error("保存测评失败:", error);
                alert("保存测评失败，请重试");
            }
        });
    }

    // 显示添加测评模态框
    function showAddAssessmentModal() {
        const modalContent = `
            <form id="addAssessmentForm">
                <div class="form-group">
                    <label for="assessmentName">测评名称:</label>
                    <input type="text" id="assessmentName" name="name" required>
                </div>
                <div class="form-group">
                    <label for="assessmentCategory">测评分类:</label>
                    <select id="assessmentCategory" name="category_id" required>
                        <option value="1">学习</option>
                        <option value="2">就业</option>
                        <option value="3">心理</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="assessmentIntro">测评介绍:</label>
                    <textarea id="assessmentIntro" name="introduction" required></textarea>
                </div>
                
                <h3>测评题目</h3>
                <div id="questionsContainer">
                    <!-- 初始没有题目 -->
                </div>
                
                <div class="form-actions">
                    <button type="button" id="addQuestionBtn" class="btn btn-primary">添加题目</button>
                    <input type="hidden" id="questionCount" name="question_count" value="0">
                    <button type="submit" class="btn btn-success">创建测评</button>
                </div>
            </form>
        `;

        window.adminUtils.showModal('添加测评', modalContent);

        // 绑定添加题目按钮事件
        $('#addQuestionBtn').on('click', function() {
            addNewQuestion();
        });

        // 绑定表单提交事件
        $('#addAssessmentForm').on('submit', function(e) {
            e.preventDefault();
            addAssessment();
        });
    }

    // 添加测评
    function addAssessment() {
        const formData = {
            name: $('#assessmentName').val(),
            category_id: parseInt($('#assessmentCategory').val()),
            introduction: $('#assessmentIntro').val(),
            question_count: parseInt($('#questionCount').val()),
            questions: []
        };

        // 收集问题数据
        $('.question-form').each(function(idx) {
            const form = $(this);
            const questionType = form.find('select[name$=".questionType"]').val();

            // 收集选项
            const options = [];
            form.find('.option-input input').each(function() {
                options.push($(this).val());
            });

            const question = {
                topic: form.find('input[name$=".topic"]').val(),
                options: JSON.stringify(options),
                sortOrder: parseInt(form.find('input[name$=".sortOrder"]').val()),
                questionType: questionType
            };

            formData.questions.push(question);
        });

        $.ajax({
            url: BASE_API_URL + '/admin/addAssessment',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                window.adminUtils.closeModal();
                alert('测评已创建');
                loadAssessmentsList(); // 重新加载测评列表
            },
            error: function(xhr, status, error) {
                console.error("创建测评失败:", error);
                alert("创建测评失败，请重试");
            }
        });
    }

    // 确认删除测评
    function confirmDeleteAssessment(assessmentId) {
        window.confirmAction('确定要删除该测评吗？此操作不可撤销。', function() {
            deleteAssessment(assessmentId);
        });
    }

    // 删除测评
    function deleteAssessment(assessmentId) {
        const id = parseInt(assessmentId);
        $.ajax({
            url: BASE_API_URL + '/admin/deleteAssessment?id=' + id,
            type: 'DELETE',
            success: function(response) {
                alert('测评已删除');
                loadAssessmentsList(); // 重新加载测评列表
            },
            error: function(xhr, status, error) {
                console.error("删除测评失败:", error);
                alert("删除测评失败，请重试");
            }
        });
    }
}); 