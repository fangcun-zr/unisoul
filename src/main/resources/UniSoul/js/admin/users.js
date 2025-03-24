$(document).ready(function() {
    console.log("用户管理模块初始化");

    // 检查按钮是否存在
    const allBtn = $('#allUsersBtn');
    const normalBtn = $('#normalUsersBtn');
    const bannedBtn = $('#bannedUsersBtn');

    console.log("按钮元素检查:");
    console.log("- 全部用户按钮存在:", allBtn.length > 0);
    console.log("- 正常用户按钮存在:", normalBtn.length > 0);
    console.log("- 已封禁用户按钮存在:", bannedBtn.length > 0);

    // 如果按钮不存在，尝试延迟绑定
    if (allBtn.length === 0 || normalBtn.length === 0 || bannedBtn.length === 0) {
        console.log("有按钮元素未找到，尝试延迟500ms后再次绑定");
        setTimeout(function() {
            bindFilterButtons();
        }, 500);
    } else {
        // 正常绑定事件
        bindFilterButtons();
    }

    // 用户状态筛选变量，默认为-1（全部用户）
    let userStatusFilter = -1; // -1: 全部用户, 1: 正常用户, 0: 已封禁用户

    // 绑定过滤按钮事件
    function bindFilterButtons() {
        // 使用事件委托方式绑定按钮点击事件
        $(document).on('click', '#allUsersBtn', function(e) {
            e.preventDefault();
            console.log("点击了全部用户按钮");
            setUserStatusFilter(-1);
        });

        $(document).on('click', '#normalUsersBtn', function(e) {
            e.preventDefault();
            console.log("点击了正常用户按钮");
            setUserStatusFilter(1);
        });

        $(document).on('click', '#bannedUsersBtn', function(e) {
            e.preventDefault();
            console.log("点击了已封禁用户按钮");
            setUserStatusFilter(0);
        });

        console.log("按钮事件绑定完成 (使用事件委托)");
    }

    // 设置状态筛选并更新按钮状态
    function setUserStatusFilter(status) {
        console.log("设置用户状态筛选为:", status);
        userStatusFilter = status;

        // 更新按钮状态 - 使用更明确的选择器
        $('#allUsersBtn, #normalUsersBtn, #bannedUsersBtn').removeClass('active');

        if (status === -1) {
            $('#allUsersBtn').addClass('active');
        } else if (status === 1) {
            $('#normalUsersBtn').addClass('active');
        } else if (status === 0) {
            $('#bannedUsersBtn').addClass('active');
        }

        // 重新加载用户列表
        loadUsersList();
    }

    // 确保页面加载后执行一次用户列表加载
    loadUsersList();

    function loadUsersList() {
        $.ajax({
            url: BASE_API_URL + '/admin/getUsersList',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                console.log("用户列表API响应:", response);
                if (response && response.code === 1) {
                    renderUsersList(response);
                } else {
                    console.error("加载用户列表返回错误:", response);
                    $('#userTable tbody').html('<tr><td colspan="6" class="text-center">加载失败，服务器返回错误</td></tr>');
                    $('#userCount').text(0); // 更新用户计数
                }
            },
            error: function(xhr, status, error) {
                console.error("加载用户列表失败:", error);
                console.error("错误状态:", status);
                console.error("XHR对象:", xhr);
                // 显示加载失败提示
                $('#userTable tbody').html('<tr><td colspan="6" class="text-center">加载失败，请重试</td></tr>');
                $('#userCount').text(0); // 更新用户计数
            }
        });
    }

    function renderUsersList(response) {
        const tbody = $('#userTable tbody');
        tbody.empty();

        // Check if we received a valid response
        if (!response || response.code !== 1 || !response.data || !Array.isArray(response.data) || response.data.length === 0) {
            tbody.html('<tr><td colspan="6" class="text-center">暂无用户数据</td></tr>');
            $('#userCount').text(0); // 更新用户计数为0
            return;
        }

        // 获取所有用户
        let users = response.data;
        let totalUsers = users.length;

        // 根据筛选条件过滤用户
        if (userStatusFilter !== -1) {
            users = users.filter(user => user.status === userStatusFilter);
        }

        // 更新用户计数显示
        $('#userCount').text(users.length);

        // 如果筛选后没有用户
        if (users.length === 0) {
            let message = '';
            if (userStatusFilter === 1) {
                message = '暂无正常状态的用户';
            } else if (userStatusFilter === 0) {
                message = '暂无被封禁的用户';
            } else {
                message = '暂无用户数据';
            }
            tbody.html(`<tr><td colspan="6" class="text-center">${message}</td></tr>`);
            return;
        }

        // 渲染用户列表
        users.forEach(function(user) {
            // 修正状态逻辑：status=1是正常状态，status=0是封禁状态
            const statusClass = user.status === 1 ? 'status-active' : 'status-banned';
            const statusText = user.status === 1 ? '正常' : '已封禁';

            // Format the created date
            let createdDate = '-';
            if (user.createdAt) {
                createdDate = user.createdAt;
            }

            const row = `
                <tr data-id="${user.id}" data-status="${user.status}">
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.email || '-'}</td>
                    <td>${createdDate}</td>
                    <td><span class="status-label ${statusClass}">${statusText}</span></td>
                    <td class="action-btns">
                        ${user.status === 1 ?
                '<button class="action-btn action-btn-edit ban-user-btn" data-id="' + user.id + '">封禁</button>' :
                '<button class="action-btn action-btn-view unban-user-btn" data-id="' + user.id + '">解封</button>'}
                        <button class="action-btn action-btn-delete delete-user-btn" data-id="${user.id}">删除</button>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });

        // 绑定操作按钮事件
        bindUserActions();
    }

    function bindUserActions() {
        // 封禁用户
        $('.ban-user-btn').off('click').on('click', function() {
            const userId = $(this).data('id');
            const userStatus = $(this).closest('tr').data('status');
            showBanUserModal(userId, userStatus);
        });

        // 解除封禁
        $('.unban-user-btn').off('click').on('click', function() {
            const userId = $(this).data('id');
            const userStatus = $(this).closest('tr').data('status');
            showUnbanUserModal(userId, userStatus);
        });

        // 删除用户
        $('.delete-user-btn').off('click').on('click', function() {
            const userId = $(this).data('id');
            confirmDeleteUser(userId);
        });
    }

    // 显示封禁用户的模态框
    function showBanUserModal(userId, userStatus) {
        const modalContent = `
            <form id="banUserForm">
                <div class="form-group">
                    <label for="banReason">封禁理由:</label>
                    <textarea id="banReason" name="message" required></textarea>
                </div>
                <div class="form-group">
                    <input type="hidden" name="id" value="${userId}">
                    <input type="hidden" name="status" value="${userStatus}">
                    <button type="submit" class="btn btn-danger">确认封禁</button>
                </div>
            </form>
        `;

        window.adminUtils.showModal('封禁用户', modalContent);

        // 绑定表单提交事件
        $('#banUserForm').on('submit', function(e) {
            e.preventDefault();

            const formData = {
                id: parseInt(userId),
                status: parseInt(userStatus),
                message: $('#banReason').val()
            };

            banUser(formData);
        });
    }

    // 显示解除封禁的模态框
    function showUnbanUserModal(userId, userStatus) {
        const modalContent = `
            <form id="unbanUserForm">
                <div class="form-group">
                    <label for="unbanReason">解封理由:</label>
                    <textarea id="unbanReason" name="message" required></textarea>
                </div>
                <div class="form-group">
                    <input type="hidden" name="id" value="${userId}">
                    <input type="hidden" name="status" value="${userStatus}">
                    <button type="submit" class="btn btn-success">确认解封</button>
                </div>
            </form>
        `;

        window.adminUtils.showModal('解除封禁', modalContent);

        // 绑定表单提交事件
        $('#unbanUserForm').on('submit', function(e) {
            e.preventDefault();

            const formData = {
                id: parseInt(userId),
                status: parseInt(userStatus),
                message: $('#unbanReason').val()
            };

            banUser(formData);
        });
    }

    // 封禁/解封用户的 AJAX 请求
    function banUser(data) {
        console.log("发送的封禁/解封请求数据:", data);

        $.ajax({
            url: BASE_API_URL + '/admin/bannedUser',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                console.log("封禁/解封响应:", response);
                window.adminUtils.closeModal();

                // 修正状态逻辑：如果设置status=0为封禁，status=1为解封
                if (data.status === 0) {
                    alert('用户已封禁');
                } else if (data.status === 1) {
                    alert('用户已解封');
                }

                loadUsersList(); // 重新加载用户列表
            },
            error: function(xhr, status, error) {
                console.error("操作失败:", error);
                console.error("错误状态:", status);
                console.error("XHR对象:", xhr);
                alert("操作失败，请重试");
            }
        });
    }

    // 确认删除用户
    function confirmDeleteUser(userId) {
        window.confirmAction('确定要删除该用户吗？此操作不可撤销。', function() {
            deleteUser(userId);
        });
    }

    // 删除用户的 AJAX 请求
    function deleteUser(userId) {
        $.ajax({
            url: BASE_API_URL + '/admin/deleteUser',
            type: 'GET',
            data: { id: userId },
            success: function(response) {
                alert('用户已删除');
                loadUsersList(); // 重新加载用户列表
            },
            error: function(xhr, status, error) {
                console.error("删除失败:", error);
                alert("删除失败，请重试");
            }
        });
    }
}); 