const API_BASE_URL = 'http://localhost:8080';
// 文章相关的API请求
const article = {





    // 文章基础操作
    // 发布文章
    publish: function (articleData) {
        return $.ajax({
            url: `${API_BASE_URL}/article/publish`,
            type: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            contentType: 'application/json',
            data: JSON.stringify(articleData)
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
            url: `${API_BASE_URL}/article/delete/${articleId}`,
            type: 'DELETE',
            headers: {
                'Authorization': localStorage.getItem('token')
            }
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

    // 评论相关API
    comment: {
        // 获取评论列表
        getList: function(articleId, page = 1, limit = 10) {
            return $.ajax({
                url: `${API_BASE_URL}/article/comment/list/${articleId}`,
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

        // 添加评论
        add: function(articleId, content) {
            return $.ajax({
                url: `${API_BASE_URL}/article/comment/add`,
                type: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('token')
                },
                contentType: 'application/json',
                data: JSON.stringify({
                    article_id: articleId,
                    content: content
                })
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
        }
    },

    // 文章交互操作
    action: {
        // 点赞文章
        like: function(articleId) {
            return $.ajax({
                url: `${API_BASE_URL}/article/like/${articleId}`,
                type: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
        },

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

        // 收藏文章
        favorite: function(articleId) {
            return $.ajax({
                url: `${API_BASE_URL}/article/favorite/${articleId}`,
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
    // ... 保持现有的文章基础操作不变 ...

    // 评论相关API
    comments: {
        // 获取评论列表
        getList: function(articleId, page = 1, limit = 10) {
            return $.ajax({
                url: `${API_BASE_URL}/article/comment/list/${articleId}`,
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

        // 添加评论
        add: function(articleId, content) {
            return $.ajax({
                url: `${API_BASE_URL}/article/comment/add`,
                type: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('token')
                },
                contentType: 'application/json',
                data: JSON.stringify({
                    article_id: articleId,
                    content: content
                })
            });
        },

        // 回复评论
        reply: function(articleId, commentId, content) {
            return $.ajax({
                url: `${API_BASE_URL}/article/comment/reply`,
                type: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('token')
                },
                contentType: 'application/json',
                data: JSON.stringify({
                    article_id: articleId,
                    comment_id: commentId,
                    content: content
                })
            });
        },

        // 点赞评论
        like: function(commentId) {
            return $.ajax({
                url: `${API_BASE_URL}/article/comment/like`,
                type: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('token')
                },
                contentType: 'application/json',
                data: JSON.stringify({
                    comment_id: commentId
                })
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
        }
    },
};



    // ... 保持现有的文章交互操作不变 ...