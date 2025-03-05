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
            $('#age').val(user.age || '');
            $('#n  ame').val(user.name || '');
            // ...渲染其他用户信息
            loadUserStats();
        }
    }

    function loadUserStats() {
        //发送请求获取用户统计信息
        article.getMyData()
            .then(response => {
                    if (response.code === 1 && response.data) {
                        const userStats = response.data;
                        $('#articleCount').text(userStats.articlesCount);
                        $('#followersCount').text(userStats.fansCount);
                        $('#followingCount').text(userStats.followsCount);
                    }
                }
            );
    }

    //加载我的文章列表
    function loadMyArticles() {
        //先判断登录情况
        // 检查localStorage中是否有用户信息
        const userDetails = localStorage.getItem('userDetails');

        if (userDetails) {
            //发送请求获取我的文章
            article.getMyArticles()
                .then(response => {
                    if (response.code === 1) {
                        const articles = response.data;
// 将文章列表渲染到页面上
                        $('#articleList').empty();

                        if (articles === null || articles.length === 0) {
                            $('#articleList').append(`
        <li class="list-group-item">您还未发布文章，快去发布您的第一篇文章吧</li>
    `);
                        } else {
                            articles.forEach(article => {
                                $('#articleList').append(`
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <h5>${article.title}</h5>
                <p>分类ID: ${article.category_id}</p>
                <p>封面图片: <img src="${article.cover_image}" alt="${article.title}" style="width: 100px; height: 100px;"></p>
                <p>标签: ${article.tags}</p>
                <p>状态: ${article.status === 0 ? '待审核' : '已审核'}</p>
                <p>浏览次数: ${article.viewCount}</p>
                <p>点赞数: ${article.likeCount}</p>
                <p>评论数: ${article.commentCount}</p>
                <p>发布时间: ${article.create_time}</p>
                <p>更新时间: ${article.update_time}</p>
            </div>
            <div>
                <button class="btn btn-sm btn-primary mr-2" onclick="editArticle(${article.id})">编辑</button>
                <button class="btn btn-sm btn-danger" value="${article.id}">删除</button>
            </div>
        </li>
    `);
                            });

                        }

                    }
                })
        }
    }

    //删除文章按钮绑定单击事件
    $(document).on('click', '.btn.btn-sm.btn-danger', function() {
        var articleId = $(this).val();
        if (confirm('确认要删除该文章吗？删除后无法恢复。')) {
            article.delete(articleId)
                .then(response => {
                    if (response.code === 1) {
                        alert('删除成功');
                        // 删除成功后，重新加载文章列表
                        loadMyArticles();
                    }

                }, error => {
                    console.error(error);
                }
            );
        }
    });


    // 处理头像上传
    $('#avatarUpload').change(function(e) {
        const file = e.target.files[0];
        if (!file) return;

        // 验证文件类型和大小
        if (!file.type.startsWith('image/')) {
            alert('请选择图片文件');
            return;
        }
        if (file.size > 20 * 1024 * 1024) {
            alert('图片大小不能超过20MB');
            return;
        }

        // 预览图片
        const reader = new FileReader();
        reader.onload = function(e) {
            $('#coverPreview').attr('src', e.target.result);
        };
        reader.readAsDataURL(file);

        // 上传图片
        const formData = new FormData();
        formData.append('avatar', file);

        xtqh_information.uploadAvatar(formData)
            .then(response => {
                if (response.code === 1) {
                    // 更新头像预览
                    $('#avatarPreview').attr('src', response.data);
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
    $('#profileFormSubmitBtn').off('click').on('click', function(e)  {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const userData = {
            name: $('#name').val().trim(),
            gender: $('#gender').val(),
            age: $('#age').val().trim(),
            school: $('#school').val().trim(),
            biography: $('#biography').val().trim()
        };

        // 显示加载状态
        const $submitBtn = $(this).find('button[type="submit"]');
        const originalText = $submitBtn.text();
        $submitBtn.prop('disabled', true).text('保存中...');
        xtqh_information.updateInformation(userData)
            .then(response => {
                if (response.code === 1) {
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

    loadMyArticles();
});