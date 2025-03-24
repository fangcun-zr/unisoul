$(document).ready(function() {
    initializePage();
    bindEvents();
    initializeValidation();
});

// 页面初始化
function initializePage() {
    // 初始化表单验证
    initializeFormValidation();
    // 初始化图片上传预览
    initializeImagePreview();
    // 初始化科室下拉框
    initializeDepartments();
    // 初始化富文本编辑器
    initializeEditor();
    // 初始化日期选择器
    initializeDatePicker();
}

// 绑定事件
function bindEvents() {
    // 表单提交
    $('#doctorRegisterForm').on('submit', handleFormSubmit);

    // 图片上传预览
    $('#doctorAvatar').on('change', handleAvatarUpload);
    $('#certificateFile').on('change', handleCertificateUpload);

    // 科室选择联动
    $('#department').on('change', handleDepartmentChange);

    // 发送验证码
    $('#sendVerificationCode').on('click', handleSendVerificationCode);

    // 实时字段验证
    bindFieldValidation();
}

// 初始化表单验证
function initializeFormValidation() {
    $('#doctorRegisterForm').validate({
        rules: {
            doctorName: {
                required: true,
                minlength: 2
            },
            phone: {
                required: true,
                pattern: /^1[3456789]\d{9}$/
            },
            email: {
                required: true,
                email: true
            },
            licenseNumber: {
                required: true,
                pattern: /^\d{6}$/
            },
            verificationCode: {
                required: true,
                digits: true,
                minlength: 6,
                maxlength: 6
            }
        },
        messages: {
            doctorName: {
                required: "请输入姓名",
                minlength: "姓名至少2个字符"
            },
            phone: {
                required: "请输入手机号",
                pattern: "请输入正确的手机号格式"
            },
            email: {
                required: "请输入邮箱",
                email: "请输入正确的邮箱格式"
            },
            licenseNumber: {
                required: "请输入执业证号",
                pattern: "请输入正确的执业证号格式"
            },
            verificationCode: {
                required: "请输入验证码",
                digits: "验证码必须是数字",
                minlength: "验证码必须是6位",
                maxlength: "验证码必须是6位"
            }
        },
        errorElement: 'span',
        errorPlacement: function(error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function(element) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function(element) {
            $(element).removeClass('is-invalid');
        }
    });
}

// 初始化图片预览
function initializeImagePreview() {
    const avatarPreview = new FileReader();
    avatarPreview.onload = function(e) {
        $('#avatarPreview').attr('src', e.target.result);
    };

    const certificatePreview = new FileReader();
    certificatePreview.onload = function(e) {
        $('#certificatePreview').attr('src', e.target.result);
    };
}

// 初始化富文本编辑器
function initializeEditor() {
    $('#introduction').summernote({
        height: 200,
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough']],
            ['para', ['ul', 'ol']]
        ],
        placeholder: '请输入个人简介...',
        callbacks: {
            onImageUpload: function(files) {
                // 处理图片上传
                handleImageUpload(files[0], this);
            }
        }
    });
}

// 处理表单提交
async function handleFormSubmit(e) {
    e.preventDefault();

    if (!$('#doctorRegisterForm').valid()) {
        return;
    }

    const formData = new FormData($('#doctorRegisterForm')[0]);

    try {
        showLoading('正在提交注册信息...');
        const response = await DoctorAPI.register(formData);
        showSuccess('注册成功！');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } catch (error) {
        showError('注册失败：' + (error.responseJSON?.message || '请稍后重试'));
    } finally {
        hideLoading();
    }
}

// 处理验证码发送
async function handleSendVerificationCode() {
    const phone = $('#phone').val().trim();
    if (!phone || !/^1[3456789]\d{9}$/.test(phone)) {
        showError('请输入正确的手机号');
        return;
    }

    const $btn = $('#sendVerificationCode');
    $btn.prop('disabled', true);
    let countdown = 60;

    try {
        await DoctorAPI.sendVerificationCode(phone);
        showSuccess('验证码已发送');

        const timer = setInterval(() => {
            $btn.text(`重新发送(${countdown}s)`);
            countdown--;
            if (countdown < 0) {
                clearInterval(timer);
                $btn.prop('disabled', false).text('发送验证码');
            }
        }, 1000);
    } catch (error) {
        showError('发送失败：' + (error.responseJSON?.message || '请稍后重试'));
        $btn.prop('disabled', false);
    }
}

// UI提示函数
function showLoading(message) {
    $('#loadingSpinner').find('.loading-text').text(message);
    $('#loadingSpinner').fadeIn();
}

function hideLoading() {
    $('#loadingSpinner').fadeOut();
}

function showSuccess(message) {
    $.notify({
        message: message
    }, {
        type: 'success',
        placement: {
            from: 'top',
            align: 'center'
        }
    });
}

function showError(message) {
    $.notify({
        message: message
    }, {
        type: 'danger',
        placement: {
            from: 'top',
            align: 'center'
        }
    });
}