$(document).ready(function() {
    // 检查登录状态
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }

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

    // 加载粉丝列表
    function loadFans() {
        user.getInformation()
            .then(response => {
                if (response.code === 200 && response.data.fans) {
                    const fansList = $('.fans-list');
                    fansList.empty();

                    response.data.fans.forEach(fan => {
                        const fanHtml = `
                            <div class="fan-item">
                                <img src="${fan.avatar || '../image/default-avatar.png'}" 
                                     class="fan-avatar" alt="头像">
                                <div class="fan-info">
                                    <div class="fan-name">${fan.username}</div>
                                    <div class="fan-nickname">昵称：${fan.nickname || '未设置'}</div>
                                </div>
                                <button class="btn btn-outline-primary btn-edit-nickname" 
                                        data-fan-id="${fan.id}">
                                    修改昵称
                                </button>
                            </div>
                        `;
                        fansList.append(fanHtml);
                    });
                }
            })
            .catch(error => {
                console.error('加载粉丝列表失败:', error);
            });
    }

    // 打开修改昵称模态框
    $(document).on('click', '.btn-edit-nickname', function() {
        const fanId = $(this).data('fan-id');
        $('#fanId').val(fanId);
        $('#nicknameModal').modal('show');
    });

    // 保存昵称
    $('#saveNickname').click(function() {
        const nickname = $('#nickname').val().trim();
        const fanId = $('#fanId').val();

        if (!nickname) {
            showError('nickname', '请输入昵称');
            return;
        }

        const fanData = {
            fan_id: fanId,
            nickname: nickname
        };

        user.setFanNickname(fanData)
            .then(response => {
                if (response.code === 1) {
                    $('#nicknameModal').modal('hide');
                    loadFans(); // 重新加载粉丝列表
                } else {
                    showError('nickname', response.message);
                }
            })
            .catch(error => {
                showError('nickname', '设置昵称失败，请稍后重试');
            });
    });

    // 输入框事件处理
    $('#nickname').on('input', function() {
        clearError('nickname');
    });

    // 模态框关闭时重置表单
    $('#nicknameModal').on('hidden.bs.modal', function() {
        $('#nicknameForm')[0].reset();
        clearError('nickname');
    });

    // 初始化加载
    loadFans();
});