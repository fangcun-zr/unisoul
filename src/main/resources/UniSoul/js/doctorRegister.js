function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            $('#avatarPreview').attr('src', event.target.result);
        };
        reader.readAsDataURL(file);
    }
}

function initializePage() {
    // 初始化表单验证
    initializeFormValidation();
    // 初始化富文本编辑器
    initializeEditor();
    // 初始化日期选择器
    initializeDatePicker();
    bindEvents(); // 事件绑定放在最后
}

// 绑定事件
function bindEvents() {
    // 表单提交
    $('#doctorRegisterForm').on('submit', handleFormSubmit);


    // 发送验证码
    $('#sendVerificationCode').on('click', handleSendVerificationCode);
}

$(document).ready(function() {
    initializePage();

});
function initializeDatePicker() {
    flatpickr.localize(flatpickr.l10ns.zh);
    $('#birthDate').flatpickr({
        dateFormat: "Y-m-d",
        maxDate: new Date().fp_incr(-365 * 18), // 最小年龄18岁
        locale: "zh",
        disableMobile: true,    // 禁用移动端原生控件
        allowInput: false,     // 禁止手动输入
        defaultDate: "1990-01-01", // 默认日期
        onChange: function(selectedDates, dateStr) {
            console.log("选择的日期:", dateStr);
        }
    });
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
                minlength: 4,
                maxlength: 4
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
                minlength: "验证码必须是4位",
                maxlength: "验证码必须是4位"
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
    });
}

function resetForm() {
    // 重置表单字段
    $('#doctorRegisterForm')[0].reset();

    // 重置特殊字段
    $('#gender').val('MALE').trigger('change'); // 重置性别为默认值
    $('#birthDate').flatpickr().setDate('1990-01-01'); // 重置日期选择器
    $('#yearsOfExperience').val('0'); // 重置工作经验

    // 重置富文本编辑器
    $('#introduction').summernote('code', '');

    // 重置头像预览
    $('#avatarPreview').attr('src', '/images/default-avatar.png');
    $('#avatarUpload').val(''); // 清空文件输入

    // 重置验证码相关
    $('#verificationCode').val('');
    $('#sendVerificationCode').prop('disabled', false).text('发送验证码');

    // 清除验证错误状态
    const validator = $('#doctorRegisterForm').validate();
    validator.resetForm();
    $('.is-invalid').removeClass('is-invalid');

    // 重置成功后焦点回到第一个输入框
    $('#doctorName').focus();
}

// 处理表单提交
async function handleFormSubmit(e) {
    e.preventDefault();
    if (!$('#doctorRegisterForm').valid()) return;

    const doctorData = {
        full_name: $('#fullName').val().trim(),
        gender: $('#gender').val(),
        phone_number: $('#phoneNumber').val().trim(),
        email: $('#email').val().trim(),
        birth_date: $('#birthDate').val(),
        department: $('#department').val(),
        license_number: $('#licenseNumber').val().trim(),
        years_of_experience: parseInt($('#yearsOfExperience').val()) || 0,
        introduction: $('#introduction').summernote('code')
    };

    try {
        showLoading('正在提交...');
        const response = await DoctorAPI.register(JSON.stringify(doctorData));
        if (response.code === 0) {
            showSuccess('注册成功');
            resetForm();
        }
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}


// 处理验证码发送
async function handleSendVerificationCode() {
    const email = $('#email').val().trim();

    // 检查邮箱格式
    if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)) {
        showError('邮箱格式不正确');
        return;
    }

    try {
        // 对邮箱进行编码
        const encodedEmail = encodeURIComponent(email);
        const response = await fetch(`/doctor/sendVerificationCode?email=${encodedEmail}`);

        if (!response.ok) throw new Error('发送失败');
        const result = await response.json();

        if (result.code === 200) {
            showSuccess('验证码已发送');
            // 倒计时逻辑...
        } else {
            showError(result.msg || '发送失败');
        }
    } catch (error) {
        showError(error.message);
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