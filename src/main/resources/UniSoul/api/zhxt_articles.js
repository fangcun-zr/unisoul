const API_BASE_URL = 'http://localhost:8080';

// API配置
const API_CONFIG = {
    BASE_URL: API_BASE_URL,
    COMMENTS_URL: '/zhxt/comments',
    COMMENT_ADD_URL: '/zhxt/add',
    COMMENT_REPLY_URL: '/zhxt/reply',
    ARTICLE_DETAIL_URL: '/zhxt/detail',
    AUTHOR_INFO_URL: '/zhxt/author_info',
    TIMEOUT: 8000,
    DEBUG: true // 开启调试日志
};

// 调试日志函数
function logDebug(message, data) {
    if (API_CONFIG.DEBUG) {
        console.log(`[API] ${message}`, data || '');
    }
}

// 文章相关的API请求
const article = {

    /**
     * 获取点赞状态
     * @param articleId
     * @returns {*}
     */
    getLikesStatus: function (articleId) {
        return $.ajax({
                url: `${API_BASE_URL}/xtqh/getLikesStatus?articleId=${articleId}`,
                type: 'GET',
                contentType: 'application/json',
            }
        );
    },

    /**
     * 获取收藏状态
     * @param articleId
     * @returns {*}
     */
    getFavoritesStatus: function (articleId) {
        return $.ajax({
                url: `${API_BASE_URL}/xtqh/isCollect?articleId=${articleId}`,
                type: 'GET',
                contentType: 'application/json',
            }
        );
    },

    /**
     * 点赞文章
     * @param articleId
     * @returns {*}
     */
    like: function(articleId, likesCount, isLike) {
        return $.ajax({
            url: `${API_BASE_URL}/xtqh/likes?ArticleId=${articleId}&LikesCount=${likesCount}&isLike=${isLike}`,
            type: 'GET',
            contentType: 'application/json',
            data: {}
        });
    },

    /**
     * 收藏文章
     * @param {number} articleId - 文章ID
     * @returns {Promise} 包含收藏状态的Promise对象
     */
    collect: function(articleId) {
        return $.ajax({
            url: `${API_BASE_URL}/xtqh/collect`,
            type: 'GET',
            data: {
                articleId: articleId
            }
        });
    },

    /**
     * 关注作者
     * @param username 作者用户名
     * @returns {*}
     */
    follow: function(username) {
        return $.ajax({
            url: `${API_BASE_URL}/xtqh/follow?username=${username}`,
            type: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            contentType: 'application/json'
        });
    },

    /**
     * 检查关注状态
     * @param authorId 作者ID
     * @returns {*}
     */
    checkFollowStatus: function(authorId) {
        // 添加调试日志
        console.log('正在检查关注状态，作者ID:', authorId);

        return $.ajax({
            url: `${API_BASE_URL}/zhxt/check-follow-status?authorId=${authorId}`,
            type: 'GET',
            contentType: 'application/json'
        });
    },

    /**
     * 获取文章摘要
     * @param id 文章ID
     * @param ratio 摘要比率
     * @returns {*}
     */
    generateSummary: function(id, ratio) {
        return $.ajax({
            url: `${API_BASE_URL}/zhxt/generate-summary`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                id: id,
                ratio: ratio
            })
        });
    },

    // 文章基础操作
    publish: function (articleData) {
        const formData = new FormData();
        formData.append('title', articleData.title);
        formData.append('content', articleData.content);
        if (articleData.file) {
            formData.append('file', articleData.file);
        }

        return $.ajax({
            url: `${API_BASE_URL}/zhxt/publish`,
            type: 'POST',
            processData: false,
            contentType: false,
            data: formData
        });
    },

    // 更新文章
    update: function (articleId, articleData) {
        return $.ajax({
            url: `${API_BASE_URL}/article/update/${articleId}`,
            type: 'PUT',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            contentType: 'application/json',
            data: JSON.stringify(articleData)
        });
    },

    // 删除文章
    delete: function (articleId) {
        return $.ajax({
            url: `${API_BASE_URL}/zhxt/deleteArticle?articleId=${articleId}`,
            type: 'DELETE',

            // headers: {
            //     'Authorization': localStorage.getItem('token')
            // }
        });
    },

    // 获取文章列表(分页)

    getArticleList: function(page = 1, pageSize = 5, category_id = '') {
        return $.ajax({
            url: `${API_BASE_URL}/zhxt/list`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                page: page,
                pageSize: pageSize,
                category_id: category_id
            })
        });
    },

    //获取我的信息
    getMyData: function() {
        return $.ajax({
                url: `${API_BASE_URL}/zhxt/getMyData`,
                type: 'GET',
            }
        );

    },

    // 获取我的文章列表
    getMyArticles: function() {
        return $.ajax({
            url: `${API_BASE_URL}/xtqh/getMyArticles`,
            type: 'GET',
        });
    },

    // 获取文章详情
    getArticleDetail: function(articleId) {
        return $.ajax({
            url: `${API_BASE_URL}/zhxt/detail?id=${articleId}`,
            type: 'GET',
            // headers: {
            //     'Authorization': localStorage.getItem('token')
            // }
        });
    },

    //获取作者详情信息
    getAuthor_info: function(articleId) {
        return $.ajax({
            url: `${API_BASE_URL}/zhxt/author_info?id=${articleId}`,
            type: 'GET',
            // headers: {
            //     'Authorization': localStorage.getItem('token')
            // }
        });
    },

    // 获取文章分类列表
    getCategories: function() {
        return $.ajax({
            url: `${API_BASE_URL}/article/list`,
            type: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });
    },

    // 文章交互操作
    action: {
        // 取消点赞
        unlike: function(articleId) {
            return $.ajax({
                url: `${API_BASE_URL}/article/unlike/${articleId}`,
                type: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        },

        // 取消收藏
        unfavorite: function(articleId) {
            return $.ajax({
                url: `${API_BASE_URL}/article/unfavorite/${articleId}`,
                type: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        },

        // 分享文章
        share: function(articleId) {
            return $.ajax({
                url: `${API_BASE_URL}/article/share/${articleId}`,
                type: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        },

        // 获取文章点赞列表
        getLikes: function(articleId, page = 1, limit = 10) {
            return $.ajax({
                url: `${API_BASE_URL}/article/likes/${articleId}`,
                type: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('token')
                },
                data: {
                    page: page,
                    limit: limit
                }
            });
        },

        // 获取文章收藏列表
        getFavorites: function(articleId, page = 1, limit = 10) {
            return $.ajax({
                url: `${API_BASE_URL}/article/favorites/${articleId}`,
                type: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('token')
                },
                data: {
                    page: page,
                    limit: limit
                }
            });
        }
    },
    // 文章基础操作

    // 评论相关API
    comments: {
        // 获取评论列表
        getList: function(articleId, page, pageSize) {
            console.log(`原始评论API调用: articleId=${articleId}, page=${page}, pageSize=${pageSize}`);

            // 构建请求数据
            const requestData = {
                articleId: articleId,
                page: page,
                pageSize: pageSize
            };

            // 记录原始请求
            console.log('原始请求URL:', `${API_BASE_URL}/zhxt/comments`);
            console.log('原始请求数据:', JSON.stringify(requestData));

            return $.ajax({
                url: `${API_BASE_URL}/zhxt/comments`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(requestData)
            });
        },

        // 添加评论
        add: function(articleId, content) {
            return $.ajax({
                url: `${API_BASE_URL}/zhxt/add`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    article_id: articleId,
                    content: content
                })
            });
        },

        // 点赞评论
        like: function(commentId) {
            return $.ajax({
                url: `${API_BASE_URL}/zhxt/like`,
                type: 'GET',
                contentType: 'application/json',
                data: {
                    articleCommentId: commentId
                }
            });
        },

        // 获取评论点赞状态
        getLikeStatus: function(commentId) {
            return $.ajax({
                url: `${API_BASE_URL}/article/comment/like/status`,
                type: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('token')
                },
                data: {
                    comment_id: commentId
                }
            });
        },

        // 删除评论
        delete: function(commentId) {
            return $.ajax({
                url: `${API_BASE_URL}/article/comment/delete/${commentId}`,
                type: 'DELETE',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        },

        // 获取我的评论列表
        getMyComments: function(page = 1, limit = 10) {
            return $.ajax({
                url: `${API_BASE_URL}/article/comment/my/list`,
                type: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('token')
                },
                data: {
                    page: page,
                    limit: limit
                }
            });
        },

        // 获取评论者详情信息
        getCommenterInfo: function(commenterId) {
            if (!commenterId) return Promise.resolve({});

            return $.ajax({
                url: `${API_BASE_URL}/zhxt/author_info?id=${commenterId}`,
                type: 'GET',
                contentType: 'application/json'
            });
        }
    },
};

// 全局API对象，简化访问
const zhxtArticlesAPI = {
    // 获取评论列表
    getList: function(articleId, page, pageSize) {
        console.log(`评论API调用: articleId=${articleId}, page=${page}, pageSize=${pageSize}`);

        // 构建请求数据
        const requestData = {
            articleId: articleId,
            page: page,
            pageSize: pageSize
        };

        // 尝试多个可能的API端点
        function tryCommentsEndpoint(url) {
            console.log('尝试评论API端点:', url);

            return $.ajax({
                url: url,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                timeout: API_CONFIG.TIMEOUT || 5000
            });
        }

        // 确保参数都是数字
        articleId = parseInt(articleId) || 1;
        page = parseInt(page) || 1;
        pageSize = parseInt(pageSize) || 10;

        // 尝试第一个端点（使用配置选项）
        const primaryUrl = API_CONFIG.BASE_URL + API_CONFIG.COMMENTS_URL;
        return tryCommentsEndpoint(primaryUrl)
            .catch(error => {
                console.warn('第一个评论API端点失败:', error);

                // 尝试第二个端点
                return tryCommentsEndpoint(`${API_BASE_URL}/zhxt/comments`);
            })
            .catch(error => {
                console.warn('第二个评论API端点失败:', error);

                // 尝试第三个端点
                return tryCommentsEndpoint(`${API_BASE_URL}/zhxt/comment/list`);
            })
            .catch(error => {
                console.warn('所有评论API端点都失败:', error);

                // 模拟响应作为fallback
                return {
                    code: 1,
                    message: "模拟评论数据",
                    data: [
                        {
                            id: 1,
                            psychology_post_id: articleId,
                            user_id: 1,
                            psychology_content: "这是一条测试评论，实际API请求失败 (可能是服务器未启动或API地址不正确)",
                            create_time: new Date().toISOString(),
                            userName: "系统用户",
                            avatar: "./images/default-avatar.png"
                        }
                    ]
                };
            });
    },

    // 添加评论
    add: function(articleId, content) {
        return article.comments.add(articleId, content);
    },

    // 获取文章详情
    getArticleDetail: function(articleId) {
        return article.getArticleDetail(articleId);
    },

    // 获取评论者信息
    getCommenterInfo: function(commenterId) {
        return article.comments.getCommenterInfo(commenterId);
    }
};



// ... 保持现有的文章交互操作不变 ...