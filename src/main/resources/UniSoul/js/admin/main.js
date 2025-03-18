// 定义API基础URL
const BASE_API_URL = "http://localhost:8080";

// 等待页面加载完成
$(document).ready(function() {
    console.log("心旅坊后台管理系统初始化");

    // 导航切换
    $('.nav-link').on('click', function(e) {
        e.preventDefault();

        const targetSection = $(this).data('section');

        // 高亮当前选中的导航项
        $('.nav-link').removeClass('active');
        $(this).addClass('active');

        // 显示对应的内容区域
        $('.section').removeClass('active');
        $(`#${targetSection}`).addClass('active');

        // 可选：记录当前选中的区域到本地存储
        localStorage.setItem('activeSection', targetSection);
    });

    // 从本地存储恢复上次选中的区域
    const activeSection = localStorage.getItem('activeSection');
    if (activeSection) {
        $(`.nav-link[data-section="${activeSection}"]`).trigger('click');
    }

    // 退出登录
    $('#logoutBtn').on('click', function() {
        console.log("退出登录");

        // 这里可以添加退出登录的逻辑
        // 例如清除localStorage中的token，然后跳转到登录页面
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

    // 格式化日期时间的工具函数
    window.formatDate = function(dateStr) {
        if (!dateStr) return '-';

        try {
            const date = new Date(dateStr);
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            console.error("日期格式化错误", e);
            return dateStr;
        }
    };

    // 格式化API时间的工具函数
    window.formatApiTime = function(timeValue) {
        if (!timeValue) return '-';

        try {
            // 处理不同类型的时间值
            let date;

            if (typeof timeValue === 'number') {
                // 处理时间戳
                date = new Date(timeValue);
            } else if (typeof timeValue === 'string') {
                // 处理ISO格式字符串
                date = new Date(timeValue);
            } else {
                return String(timeValue);
            }

            // 格式化为本地时间
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            console.error("API时间格式化错误", e);
            return String(timeValue);
        }
    };

    // 工具函数集合
    window.adminUtils = {
        // 显示模态框
        showModal: function(title, content) {
            $('#modalTitle').text(title);
            $('#modalBody').html(content);

            // 使用Bootstrap的模态框API
            const modalElement = document.getElementById('modal');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();

            // 保存模态框实例，以便后续关闭
            this.currentModal = modal;
        },

        // 关闭模态框
        closeModal: function() {
            if (this.currentModal) {
                this.currentModal.hide();
                this.currentModal = null;
            }
        },

        // 显示加载指示器
        showLoading: function(selector) {
            const container = $(selector);
            container.html('<div class="text-center py-5"><div class="loading mx-auto"></div><p class="mt-3 text-muted">数据加载中...</p></div>');
        },

        // 显示错误信息
        showError: function(selector, message) {
            const container = $(selector);
            container.html(`<div class="alert alert-danger mt-3 mb-3" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>${message || '操作失败，请重试'}
            </div>`);
        }
    };

    // 确认操作函数
    window.confirmAction = function(message, onConfirm) {
        $('#confirmMessage').text(message);

        // 绑定确认按钮事件
        $('#confirmActionBtn').off('click').on('click', function() {
            // 隐藏确认框
            const confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
            confirmModal.hide();

            // 执行确认后的回调
            if (typeof onConfirm === 'function') {
                onConfirm();
            }
        });

        // 显示确认模态框
        const confirmModalElement = document.getElementById('confirmModal');
        const confirmModal = new bootstrap.Modal(confirmModalElement);
        confirmModal.show();
    };

    // 添加全局的Ajax错误处理
    $(document).ajaxError(function(event, jqXHR, settings, error) {
        console.error("Ajax请求失败:", error);
        console.error("请求URL:", settings.url);
        console.error("状态码:", jqXHR.status);

        // 处理特定的错误状态
        if (jqXHR.status === 401) {
            // 未授权，跳转到登录页面
            alert("您的登录已过期，请重新登录");
            window.location.href = 'login.html';
        } else if (jqXHR.status === 403) {
            alert("您没有权限执行此操作");
        } else if (jqXHR.status === 0) {
            alert("网络连接失败，请检查您的网络连接");
        }
    });

    // 确保模态框背景正确移除
    $(document).on('hidden.bs.modal', '.modal', function () {
        if($('.modal.show').length > 0) {
            $('body').addClass('modal-open');
        } else {
            // 确保模态框关闭后，任何残留的模态框背景都被清理
            setTimeout(function() {
                if($('.modal.show').length === 0 && $('.modal-backdrop').length > 0) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    $('body').css('overflow', '');
                    $('body').css('padding-right', '');
                }
            }, 200);
        }
    });
}); 