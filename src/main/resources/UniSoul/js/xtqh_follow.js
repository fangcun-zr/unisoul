$(document).ready(function() {
    // 检查登录状态
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }

    // 加载关注列表
    function loadFollowList() {
        user.getFollowing()
            .then(response => {
                if (response.code === 200) {
                    const followList = $('.follow-list');
                    followList.empty();

                    response.data.forEach(user => {
                        const followHtml = `
                            <div class="follow-item">
                                <img src="${user.avatar || '../image/default-avatar.png'}" 
                                     class="follow-avatar" alt="头像">
                                <div class="follow-info">
                                    <div class="follow-name">${user.username}</div>
                                    <div class="follow-meta">
                                        ${user.school || '未设置学校'}
                                    </div>
                                </div>
                                <button class="btn btn-follow following" data-id="${user.id}">
                                    <span class="follow-text">已关注</span>
                                    <span class="unfollow-text">取消关注</span>
                                </button>
                            </div>
                        `;
                        followList.append(followHtml);
                    });
                }
            })
            .catch(error => {
                console.error('加载关注列表失败:', error);
            });
    }

    // 处理关注/取消关注
    $(document).on('click', '.btn-follow', function() {
        const $btn = $(this);
        const userId = $btn.data('id');

        // 防止重复点击
        if ($btn.prop('disabled')) return;
        $btn.prop('disabled', true);

        const isFollowing = $btn.hasClass('following');
        const api = isFollowing ? follow.unfollowUser : follow.followUser;

        api(userId)
            .then(response => {
                if (response.code === 200) {
                    if (isFollowing) {
                        $btn.closest('.follow-item').fadeOut(() => {
                            $(this).remove();
                        });
                    }
                }
            })
            .catch(error => {
                console.error('关注操作失败:', error);
            })
            .finally(() => {
                $btn.prop('disabled', false);
            });
    });

    // 初始化加载
    loadFollowList();
});