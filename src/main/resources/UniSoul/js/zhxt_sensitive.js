$(document).ready(function () {
    // 检查登录状态和管理员权限
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }

    let currentPage = 1;
    const pageSize = 10;
    let totalPages = 0;

    // 加载敏感词列表
    function loadWords(page = 1) {
        sensitive.getList(page, pageSize)
            .then(response => {
                if (response.code === 200) {
                    const wordList = $('#wordList');
                    wordList.empty();

                    response.data.list.forEach(word => {
                        const row = `
                            <tr>
                                <td>${word.id}</td>
                                <td>${word.word}</td>
                                <td>${word.createTime}</td>
                                <td>
                                    <button class="btn btn-danger btn-action delete-btn" 
                                            data-id="${word.id}">
                                        删除
                                    </button>
                                </td>
                            </tr>
                        `;
                        wordList.append(row);
                    });

                    // 更新分页
                    totalPages = Math.ceil(response.data.total / pageSize);
                    updatePagination(page);
                }
            })
            .catch(error => {
                console.error('加载敏感词列表失败:', error);
                alert('加载失败，请重试');
            });
    }

    // 更新分页导航
    function updatePagination(currentPage) {
        const pagination = $('#pagination');
        pagination.empty();

        // 上一页
        pagination.append(`
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">上一页</a>
            </li>
        `);

        // 页码
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || // 第一页
                i === totalPages || // 最后一页
                (i >= currentPage - 2 && i <= currentPage + 2) // 当前页附近的页码
            ) {
                pagination.append(`
                    <li class="page-item ${i === currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a>
                    </li>
                `);
            } else if (
                i === currentPage - 3 || // 当前页前的省略号
                i === currentPage + 3 // 当前页后的省略号
            ) {
                pagination.append(`
                    <li class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>
                `);
            }
        }

        // 下一页
        pagination.append(`
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">下一页</a>
            </li>
        `);
    }

    // 添加敏感词
    $('#addWordBtn').click(function () {
        const word = $('#newWord').val().trim();
        if (!word) {
            $('#newWord').addClass('is-invalid')
                .siblings('.invalid-feedback')
                .text('请输入敏感词');
            return;
        }

        const $btn = $(this);
        const originalText = $btn.text();
        $btn.prop('disabled', true).text('添加中...');

        sensitive.add(word)
            .then(response => {
                if (response.code === 200) {
                    $('#addWordModal').modal('hide');
                    loadWords(currentPage);
                } else {
                    $('#newWord').addClass('is-invalid')
                        .siblings('.invalid-feedback')
                        .text(response.message);
                }
            })
            .catch(error => {
                $('#newWord').addClass('is-invalid')
                    .siblings('.invalid-feedback')
                    .text('添加失败，请重试');
            })
            .finally(() => {
                $btn.prop('disabled', false).text(originalText);
            });
    });

    // 删除敏感词
    $(document).on('click', '.delete-btn', function () {
        if (!confirm('确定要删除这个敏感词吗？')) {
            return;
        }

        const $btn = $(this);
        const wordId = $btn.data('id');
        $btn.prop('disabled', true);

        sensitive.delete(wordId)
            .then(response => {
                if (response.code === 200) {
                    loadWords(currentPage);
                } else {
                    alert(response.message || '删除失败');
                    $btn.prop('disabled', false);
                }
            })
            .catch(error => {
                console.error('删除敏感词失败:', error);
                alert('删除失败，请重试');
                $btn.prop('disabled', false);
            });
    });

    // 批量导入敏感词
    $('#importBtn').click(function () {
        const file = $('#wordFile')[0].files[0];
        if (!file) {
            $('#wordFile').addClass('is-invalid')
                .siblings('.invalid-feedback')
                .text('请选择文件');
            return;
        }

        const $btn = $(this);
        const originalText = $btn.text();
        $btn.prop('disabled', true).text('导入中...');

        sensitive.import(file)
            .then(response => {
                if (response.code === 200) {
                    $('#importModal').modal('hide');
                    loadWords(1);
                    alert(`成功导入 ${response.data.count} 个敏感词`);
                } else {
                    $('#wordFile').addClass('is-invalid')
                        .siblings('.invalid-feedback')
                        .text(response.message);
                }
            })
            .catch(error => {
                $('#wordFile').addClass('is-invalid')
                    .siblings('.invalid-feedback')
                    .text('导入失败，请重试');
            })
            .finally(() => {
                $btn.prop('disabled', false).text(originalText);
            });
    });

    // 分页点击事件
    $(document).on('click', '.pagination .page-link', function (e) {
        e.preventDefault();
        const $this = $(this);
        const page = $this.data('page');

        if (page && page !== currentPage) {
            currentPage = page;
            loadWords(page);
        }
    });

    // 模态框关闭时重置表单
    $('.modal').on('hidden.bs.modal', function () {
        $(this).find('form')[0].reset();
        $(this).find('.is-invalid').removeClass('is-invalid');
    });

    // 初始化加载
    loadWords();
});
