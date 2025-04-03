if (typeof Promise.prototype.finally !== 'function') {
    Promise.prototype.finally = function(callback) {
        return this.then(
            value => Promise.resolve(callback()).then(() => value),
            err => Promise.resolve(callback()).then(() => { throw err })
        );
    };
}

$(document).ready(function() {
    initializePage();
    bindEvents();
    loadUserInfo();
});

let currentUserRole = '';
let currentUserId = '';

function loadUserInfo() {
    alert("加载用户信息")
    try {
        const rawUserInfo = localStorage.getItem('userInfo');
        const userInfo = JSON.parse(rawUserInfo || '{}');

        currentUserRole = userInfo.role?.toLowerCase() || '';
        currentUserName = userInfo.doctorName || userInfo.patientName || userInfo.name || '';

        updateUIByRole();
    } catch (e) {
        console.error('解析用户信息失败:', e);
    }
}

function updateUIByRole() {
    if (currentUserRole === 'doctor') {
        $('.page-title').text('我的患者预约');
        $('#emptyStateText').text('暂无患者预约');
    } else {
        $('.page-title').text('我的预约记录');
        $('#emptyStateText').text('暂无预约记录');
    }
}

function initializePage() {
    initializeFilters();
    loadAppointments(1);
    alert("页面初始化")
}

function initializeFilters() {
    $('#dateFilter').flatpickr({
        dateFormat: "Y-m-d",
        locale: "zh"
    });

    const statusOptions = [
        {value: '', text: '全部状态'},
        {value: 'PENDING', text: '待确认'},
        {value: 'confirmed', text: '已确认'},
        {value: 'completed', text: '已完成'},
        {value: 'cancelled', text: '已取消'}
    ];

    const $statusFilter = $('#statusFilter');
    statusOptions.forEach(option => {
        $statusFilter.append(`<option value="${option.value}">${option.text}</option>`);
    });
}

function bindEvents() {
    alert("绑定事件启动")
    $('#statusFilter, #dateFilter').on('change', function() {
        loadAppointments(1);
    });

    $(document).on('click', '.pagination .page-link', function(e) {
        e.preventDefault();
        const page = $(this).data('page');
        loadAppointments(page);
    });

    // 在bindEvents中添加
    $(document).on('click', '.appointment-card', function() {
        const appointmentId = $(this).data('id');
        showAppointmentDetail(appointmentId);
    });

    function showAppointmentDetail(id) {
        AppointmentAPI.getDetail(id).then(res => {
            const detailHTML = `
            <div class="detail-section">
                <h6>基本信息</h6>
                <p>预约号：${res.id}</p>
                <p>状态：${getStatusText(res.status)}</p>
                <p>预约时间：${formatDateTime(res.appointmentDateTime)}</p>
            </div>
            <!-- 其他详细信息 -->
        `;
            $('#appointmentDetailContent').html(detailHTML);
            $('#appointmentDetailModal').modal('show');
        });
    }

    $(document).on('click', '.btn-cancel-appointment', function() {
        const appointmentId = $(this).data('id');
        cancelAppointment(appointmentId);
    });

    $('#exportBtn').on('click', exportAppointments);
}

function loadAppointments(current = 1) {
    const requestParams = {
        current: current,
        pageSize: 10,
        status: $('#statusFilter').val(),
        appointmentDate: $('#dateFilter').val()
    };

    showLoading();
    AppointmentAPI.getList(requestParams)
        .done(function(response) {
            alert(response.code)
            if (response.code === 0) {
                // ✅ 明确解析分页字段
                const {
                    records,  // 数据列表
                    current: currentPage,
                    pages: totalPages,
                    total: totalItems
                } = response.data;

                renderAppointments(records);
                renderPagination({
                    currentPage: currentPage,
                    totalPages: totalPages,
                    totalItems: totalItems
                });
                updateStats(response.data);
            }
        })
        .fail(showError)
        .always(hideLoading);
}
function updateStats(pageData) {
    // ✅ 直接从分页数据解构
    const { records, total } = pageData;
    const today = new Date().toISOString().split('T')[0];

    const stats = records.reduce((acc, appointment) => ({
        todayCount: acc.todayCount + (appointment.appointmentDate === today ? 1 : 0),
        pendingCount: acc.pendingCount + (appointment.status === 'PENDING' ? 1 : 0),
        completedCount: acc.completedCount + (appointment.status === 'COMPLETED' ? 1 : 0)
    }), { todayCount: 0, pendingCount: 0, completedCount: 0 });

    // 更新DOM
    $('#todayCount').text(stats.todayCount);
    $('#pendingCount').text(stats.pendingCount);
    $('#completedCount').text(stats.completedCount);
    $('#totalCount').text(total); // ✅ 使用总记录数
}

function renderAppointments(appointments) {
    alert("渲染预约列表")
    const $container = $('#appointmentList');
    $container.empty();

    if (!appointments.length) {
        renderEmptyState();
        return;
    }

    appointments.forEach(appointment => {
        $container.append(createAppointmentCard(appointment));
    });
}

function createAppointmentCard(appointment) {
    return `
        <div class="appointment-card" data-id="${appointment.id}">
            <div class="appointment-header">
                <div class="header-left">
                    <span class="appointment-id">预约号：${appointment.id}</span>
                    <span class="status-badge ${appointment.status}">
                        ${getStatusText(appointment.status)}
                    </span>
                </div>
            </div>
            <div class="appointment-body">
                ${currentUserRole === 'doctor' ?
        `<div class="patient-info">
                        <span>患者：${appointment.patientName}</span>
                        <span>电话：${appointment.patientPhone || '无'}</span>
                    </div>` :
        `<div class="doctor-info">
                        <span>医生：${appointment.doctorName}</span>
                        <span>科室：${appointment.consultationType}</span>
                    </div>`
    }
            </div>
        </div>
    `;
}

function renderPatientInfo(appointment) {
    return `
        <div class="info-section">
            <div class="info-item">
                <label>患者姓名：</label>
                <span>${appointment.patientName}</span>
            </div>
            <div class="info-item">
                <label>联系电话：</label>
                <span>${appointment.patientPhone || '未提供'}</span>
            </div>
            <div class="info-item">
                <label>预约事项：</label>
                <span>${appointment.description || '未说明'}</span>
            </div>
        </div>
    `;
}

function renderDoctorInfo(appointment) {
    return `
        <div class="info-section">
            <div class="info-item">
                <label>医生姓名：</label>
                <span>${appointment.doctorName}</span>
            </div>
            <div class="info-item">
                <label>科室：</label>
                <span>${appointment.department}</span>
            </div>
            <div class="info-item">
                <label>专长：</label>
                <span>${appointment.specialty || '暂无信息'}</span>
            </div>
        </div>
    `;
}

function renderActionButtons(appointment) {
    const buttons = [];

    if (currentUserRole === 'doctor') {
        if (appointment.status === 'pending') {
            buttons.push(createButton('确认预约', 'success', `confirmAppointment(${appointment.id})`));
        }
        if (appointment.status === 'confirmed') {
            buttons.push(createButton('完成预约', 'primary', `completeAppointment(${appointment.id})`));
        }
    }

    if (canCancel(appointment)) {
        buttons.push(createButton('取消预约', 'danger', `cancelAppointment(${appointment.id})`));
    }

    return buttons.join('');
}

function createButton(text, type, onclick) {
    return `
        <button class="btn btn-${type} btn-sm" onclick="${onclick}">
            ${text}
        </button>
    `;
}

function canCancel(appointment) {
    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
        return false;
    }
    return currentUserRole === 'patient' ||
        (currentUserRole === 'doctor' && appointment.status === 'pending');
}

function getStatusText(status) {
    const statusMap = {
        'PENDING': '待确认',
        'CONFIRMED': '已确认',
        'COMPLETED': '已完成',
        'CANCELLED': '已取消'
    };
    return statusMap[status] || status;
}

function formatAppointmentTime(dateTime) {
    return new Date(dateTime).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function confirmAppointment(appointmentId) {
    if (confirm('确认接受这个预约吗？')) {
        AppointmentAPI.updateStatus(appointmentId, 'confirmed')
            .then(() => {
                showSuccess('预约已确认');
                loadAppointments(1);
            })
            .catch(() => {
                showError('确认预约失败');
            });
    }
}

function completeAppointment(appointmentId) {
    if (confirm('确认完成这个预约吗？')) {
        AppointmentAPI.updateStatus(appointmentId, 'completed')
            .then(() => {
                showSuccess('预约已完成');
                loadAppointments(1);
            })
            .catch(() => {
                showError('完成预约失败');
            });
    }
}

function cancelAppointment(appointmentId) {
    if (confirm('确定要取消这个预约吗？')) {
        AppointmentAPI.cancel(appointmentId)
            .then(() => {
                showSuccess('预约已取消');
                loadAppointments(1);
            })
            .catch(() => {
                showError('取消预约失败');
            });
    }
}

// 分页渲染函数修改
function renderPagination(paginationData) {
    const $pagination = $('.pagination');
    $pagination.empty();

    // ✅ 使用解构并添加默认值
    const {
        currentPage = 1,
        totalPages = 1
    } = paginationData;

    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }
    $pagination.html(html);
}

function formatDateTime(dateTime) {
    return new Date(dateTime).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showLoading() {
    $('#loadingSpinner').fadeIn();
    $('#appointmentList').addClass('blur-content');
}

function hideLoading() {
    $('#loadingSpinner').fadeOut();
    $('#appointmentList').removeClass('blur-content');
}

function showSuccess(message) {
    $.notify({
        message: message
    }, {
        type: 'success',
        placement: {
            from: 'top',
            align: 'center'
        }
    });
}

function showError(message) {
    $.notify({
        message: message
    }, {
        type: 'danger',
        placement: {
            from: 'top',
            align: 'center'
        }
    });
}

function renderEmptyState() {
    const emptyHTML = `
        <div class="empty-state">
            <i class="fas fa-calendar-times fa-3x mb-3"></i>
            <h5>${currentUserRole === 'doctor' ? '暂无患者预约' : '暂无预约记录'}</h5>
            ${currentUserRole === 'patient' ?
        '<button class="btn btn-primary mt-3" onclick="location.href=\'create.html\'">立即预约</button>' : ''}
        </div>
    `;
    $('#appointmentList').html(emptyHTML);
}

function exportAppointments() {
    const dateRange = $('#dateFilter').val().split(' to ');

    const filters = {
        status: $('#statusFilter').val(),
        startDate: dateRange[0] || '',
        endDate: dateRange[1] || dateRange[0] || '',
        consultationType: $('#departmentFilter').val()
    };

    // 清理空参数
    Object.keys(filters).forEach(key => {
        if (!filters[key]) delete filters[key];
    });

    showLoading();
    AppointmentAPI.exportList(filters)
        .then(blob => {
            const filename = `预约记录_${new Date().toLocaleDateString('zh-CN')}.xlsx`;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            showSuccess('导出成功');
        })
        .catch(err => {
            console.error('导出失败:', err);
            showError(`导出失败: ${err.statusText || '服务器错误'}`);
        })
        .then(() => {
            hideLoading();
        }, () => {
            hideLoading();
    });
}