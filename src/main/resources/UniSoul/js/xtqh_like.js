$(document).ready(function() {
    // 检查登录状态
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }

    let currentPage = 1;
    const pageSize = 10;
    let hasMore = true;

    // 加载点赞列表
    function loadLikes(page = 1) {
        if (!hasMore && page > 1) return;

        like.getLikeList(page, pageSize)
            .then(response => {
                if (response.code === 200) {
                    const likeList = $('.like-list');
                    const likes = response.data.list || [];

                    // 判断是否还有更多数据
                    hasMore = likes.length === pageSize;
                    $('#loadMore').toggle(hasMore);

                    // 如果是第一页，清空列表
                    if (page === 1) {
                        likeList.empty();
                    }

                    // 添加点赞项
                    likes.forEach(item => {
                        const likeHtml = `
                            <div class="like-item">
                                <img src="${item.avatar || '../image/default-avatar.png'}" 
                                     class="like-avatar" alt="头像">
                                <div class="like-content">
                                    <div class="like-text">
                                        ${item.content}
                                    </div>
                                    <div class="like-meta">
                                        <span class="like-author">${item.author}</span>
                                        <span class="like-time">${item.createTime}</span>
                                    </div>
                                </div>
                                <button class="btn btn-like active" data-id="${item.id}">
                                    <i class="fas fa-heart"></i>
                                    <span class="like-count">${item.likeCount}</span>
                                </button>
                            </div>
                        `;
                        likeList.append(likeHtml);
                    });
                }
            })
            .catch(error => {
                console.error('加载点赞列表失败:', error);
            });
    }

    // 处理点赞/取消点赞
    $(document).on('click', '.btn-like', function() {
        const $btn = $(this);
        const commentId = $btn.data('id');

        // 防止重复点击
        if ($btn.prop('disabled')) return;
        $btn.prop('disabled', true);

        like.likeComment(commentId)
            .then(response => {
                if (response.code === 200) {
                    // 更新点赞状态和数量
                    $btn.toggleClass('active');
                    const $icon = $btn.find('i');
                    $icon.toggleClass('far fas');

                    // 添加动画效果
                    $btn.addClass('animating');
                    setTimeout(() => $btn.removeClass('animating'), 300);

                    // 更新点赞数
                    const $count = $btn.find('.like-count');
                    const currentCount = parseInt($count.text());
                    $count.text($btn.hasClass('active') ? currentCount + 1 : currentCount - 1);
                }
            })
            .catch(error => {
                console.error('点赞操作失败:', error);
            })
            .finally(() => {
                $btn.prop('disabled', false);
            });
    });

    // 加载更多
    $('#loadMore').click(function() {
        currentPage++;
        loadLikes(currentPage);
    });

    // 初始化加载
    loadLikes();
});