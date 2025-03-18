import * as api from '../api/my_columns';

// 当前页面状态管理
const state = {
    columns: [],
    selectedColumnId: null,
    isLoading: false
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    bindEvents();
});

// 初始化页面
async function initializePage() {
    showLoading();
    try {
        await loadColumns();
        initializeTooltips();
        initializeSortable();
    } catch (error) {
        showError('初始化页面失败');
    } finally {
        hideLoading();
    }
}

// 加载专栏列表
async function loadColumns() {
    try {
        const response = await api.getMyColumns();
        state.columns = response.data;
        alert(state.columns)
        renderColumns();
        updatePagination();
    } catch (error) {
        showError('加载专栏列表失败');
    }
}

// 渲染专栏列表
function renderColumns() {
    const columnsContainer = document.querySelector('.columns-grid');
    columnsContainer.innerHTML = state.columns.map(column => `
        <div class="column-card" data-id="${column.id}">
            <div class="column-cover">
                <img src="${column.coverUrl}" alt="${column.title}">
                <div class="column-actions">
                    <button class="btn btn-light btn-sm edit-column" data-bs-toggle="tooltip" title="编辑专栏">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-light btn-sm manage-articles" data-bs-toggle="tooltip" title="管理文章">
                        <i class="fas fa-list"></i>
                    </button>
                    <button class="btn btn-danger btn-sm delete-column" data-bs-toggle="tooltip" title="删除专栏">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="column-info">
                <h3 class="column-title">${column.title}</h3>
                <p class="column-description">${column.description}</p>
                <div class="column-stats">
                    <span><i class="fas fa-book-reader"></i> ${column.articleCount} 篇文章</span>
                    <span><i class="fas fa-eye"></i> ${column.viewCount} 次阅读</span>
                </div>
            </div>
        </div>
    `).join('');
}

// 绑定事件处理
function bindEvents() {
    // 创建专栏
    document.getElementById('createColumnBtn').addEventListener('click', () => {
        $('#createColumnModal').modal('show');
    });

    // 提交创建专栏表单
    document.getElementById('createColumnForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            await api.createColumn(Object.fromEntries(formData));
            $('#createColumnModal').modal('hide');
            showSuccess('专栏创建成功');
            await loadColumns();
        } catch (error) {
            showError('创建专栏失败');
        }
    });

    // 删除专栏
    document.addEventListener('click', async (e) => {
        if (e.target.closest('.delete-column')) {
            const card = e.target.closest('.column-card');
            const columnId = card.dataset.id;
            if (await confirmDelete('确定要删除这个专栏吗？')) {
                try {
                    await api.deleteColumn(columnId);
                    showSuccess('专栏删除成功');
                    await loadColumns();
                } catch (error) {
                    showError('删除专栏失败');
                }
            }
        }
    });

    // 编辑专栏
    document.addEventListener('click', (e) => {
        if (e.target.closest('.edit-column')) {
            const card = e.target.closest('.column-card');
            const columnId = card.dataset.id;
            const column = state.columns.find(c => c.id === columnId);
            openEditModal(column);
        }
    });

    // 管理文章
    document.addEventListener('click', (e) => {
        if (e.target.closest('.manage-articles')) {
            const card = e.target.closest('.column-card');
            const columnId = card.dataset.id;
            openManageArticlesModal(columnId);
        }
    });
}

// 初始化工具提示
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

// 初始化拖拽排序
function initializeSortable() {
    const articlesList = document.querySelector('.articles-list');
    if (articlesList) {
        new Sortable(articlesList, {
            animation: 150,
            onEnd: async (evt) => {
                const articleIds = Array.from(evt.to.children).map(el => el.dataset.id);
                try {
                    await api.updateArticlesOrder(state.selectedColumnId, articleIds);
                    showSuccess('文章排序更新成功');
                } catch (error) {
                    showError('更新文章排序失败');
                }
            }
        });
    }
}

// 显示/隐藏加载状态
function showLoading() {
    state.isLoading = true;
    document.querySelector('.loading-overlay').style.display = 'flex';
}

function hideLoading() {
    state.isLoading = false;
    document.querySelector('.loading-overlay').style.display = 'none';
}

// 显示成功/错误提示
function showSuccess(message) {
    showToast(message, 'success');
}

function showError(message) {
    showToast(message, 'error');
}

function showToast(message, type = 'info') {
    const toast = new bootstrap.Toast(document.getElementById('toast'));
    const toastBody = document.querySelector('.toast-body');
    toastBody.textContent = message;
    document.getElementById('toast').className = `toast ${type}`;
    toast.show();
}

// 确认删除
function confirmDelete(message) {
    return new Promise(resolve => {
        if (confirm(message)) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
}

// 更新分页
function updatePagination() {
    const pagination = document.querySelector('.pagination');
    if (pagination) {
        pagination.innerHTML = generatePaginationHTML();
    }
}

// 生成分页HTML
function generatePaginationHTML() {
    let html = '';
    for (let i = 1; i <= state.totalPages; i++) {
        html += `
            <li class="page-item ${i === state.currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }
    return html;
}