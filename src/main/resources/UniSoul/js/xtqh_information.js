$(document).ready(function() {
    // 检查登录状态
    // if (!localStorage.getItem('token')) {
    //     window.location.href = 'login.html';
    //     return;
    // }

    // 显示错误信息
    function showError(field, message) {
        const $field = $(`#${field}`);
        $field.addClass('is-invalid')
            .siblings('.invalid-feedback')
            .text(message)
            .show();
    }

    // 清除错误信息
    function clearError(field) {
        const $field = $(`#${field}`);
        $field.removeClass('is-invalid')
            .siblings('.invalid-feedback')
            .hide();
    }

    // 加载个人信息
    function loadProfile() {

        // 检查localStorage中是否有用户信息
        const userDetails = localStorage.getItem('userDetails');

        if (userDetails) {
            // 解析用户信息
            const user = JSON.parse(userDetails);
            // 将用户信息渲染到页面上
            $('#username').text(user.username);
            $('#displayUsername').text(user.username);
            $('#gender').val(user.gender || 'male');
            $('#school').val(user.school || '');
            $('#userAvatar').attr('src', user.avatarUrl);
            $('#sidebarUsername').text(user.name);
            $('#displaySchool').text(user.school || '未设置学校');
            $('#biography').val(user.biography || '');
            $('#avatarPreview').attr('src', user.avatarUrl);
            // ...渲染其他用户信息
        }
    }

    // 处理头像上传
    $('#avatarUpload').change(function(e) {
        const file = e.target.files[0];
        if (!file) return;

        // 验证文件类型和大小
        if (!file.type.startsWith('image/')) {
            alert('请选择图片文件');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('图片大小不能超过5MB');
            return;
        }

        // 预览图片
        const reader = new FileReader();
        reader.onload = function(e) {
            $('#avatarPreview').attr('src', e.target.result);
        };
        reader.readAsDataURL(file);

        // 上传图片
        const formData = new FormData();
        formData.append('avatar', file);

        user.uploadAvatar(formData)
            .then(response => {
                if (response.code === 200) {
                    // 更新头像预览
                    $('#avatarPreview').attr('src', response.data.avatarUrl);
                } else {
                    alert('上传头像失败：' + response.message);
                }
            })
            .catch(error => {
                alert('上传头像失败，请稍后重试');
            });
    });

    // 表单验证
    function validateForm() {
        let isValid = true;

        const age = $('#age').val().trim();
        if (age && (age < 1 || age > 120)) {
            showError('age', '请输入有效的年龄');
            isValid = false;
        }

        const school = $('#school').val().trim();
        if (school && school.length > 50) {
            showError('school', '学校名称不能超过50个字符');
            isValid = false;
        }

        const biography = $('#biography').val().trim();
        if (biography && biography.length > 200) {
            showError('biography', '个人简介不能超过200个字符');
            isValid = false;
        }

        return isValid;
    }

    // 处理表单提交
    $('#profileForm').on('submit', function(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const userData = {
            gender: $('#gender').val(),
            age: $('#age').val().trim(),
            school: $('#school').val().trim(),
            biography: $('#biography').val().trim()
        };

        // 显示加载状态
        const $submitBtn = $(this).find('button[type="submit"]');
        const originalText = $submitBtn.text();
        $submitBtn.prop('disabled', true).text('保存中...');

        user.updateInformation(userData)
            .then(response => {
                if (response.code === 200) {
                    alert('保存成功！');
                    loadProfile(); // 重新加载个人信息
                } else {
                    alert('保存失败：' + response.message);
                }
            })
            .catch(error => {
                alert('保存失败，请稍后重试');
            })
            .finally(() => {
                $submitBtn.prop('disabled', false).text(originalText);
            });
    });

    // 输入框事件处理
    $('.form-control').on('input', function() {
        clearError(this.id);
    });

    // 退出登录
    $('#logoutBtn').click(function() {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

    // 初始化加载
    loadProfile();
});