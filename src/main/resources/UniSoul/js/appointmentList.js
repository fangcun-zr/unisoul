$(document).ready(function() {
    initializePage();
    bindEvents();
    loadUserInfo();
});

let currentUserRole = '';
let currentUserId = '';

function loadUserInfo() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    currentUserRole = userInfo.role;
    currentUserId = userInfo.id;
    updateUIByRole();
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
}

function initializeFilters() {
    $('#dateFilter').flatpickr({
        dateFormat: "Y-m-d",
        locale: "zh"
    });

    const statusOptions = [
        {value: '', text: '全部状态'},
        {value: 'pending', text: '待确认'},
        {value: 'confirmed', text: '已确认'},
        {value: 'completed', text: '已完成'},
        {value: 'cancelled', text: '已取消'}
    ];

    const $statusFilter = $('#statusFilter');
    Object.entries(statusOptions).forEach(([value, text]) => {
        $statusFilter.append(`<option value="${value}">${text}</option>`);
    });
}

function bindEvents() {
    $('#statusFilter, #dateFilter').on('change', function() {
        loadAppointments(1);
    });

    $(document).on('click', '.pagination .page-link', function(e) {
        e.preventDefault();
        const page = $(this).data('page');
        loadAppointments(page);
    });

    $(document).on('click', '.btn-cancel-appointment', function() {
        const appointmentId = $(this).data('id');
        cancelAppointment(appointmentId);
    });

    $('#exportBtn').on('click', exportAppointments);
}

function loadAppointments(page) {
    const filters = {
        status: $('#statusFilter').val(),
        date: $('#dateFilter').val(),
        role: currentUserRole,
        userId: currentUserId
    };

    showLoading();
    AppointmentAPI.getList(page, filters)
        .then(response => {
            renderAppointments(response.content);
            renderPagination(response);
        })
        .catch(error => {
            showError('加载预约列表失败');
            console.error('Failed to load appointments:', error);
        })
}

function renderAppointments(appointments) {
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
                <div class="header-right">
                    ${formatDateTime(appointment.createdAt)}
                </div>
            </div>
            <div class="appointment-body">
                ${currentUserRole === 'doctor' ?
        renderPatientInfo(appointment) :
        renderDoctorInfo(appointment)}
                <div class="appointment-time">
                    <i class="far fa-clock"></i>
                    预约时间：${formatDateTime(appointment.appointmentTime)}
                </div>
            </div>
            <div class="appointment-footer">
                ${renderActionButtons(appointment)}
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
        'pending': '待确认',
        'confirmed': '已确认',
        'completed': '已完成',
        'cancelled': '已取消'
    };
    return statusMap[status] || status;
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

function renderPagination(data) {
    const $pagination = $('.pagination');
    $pagination.empty();

    let html = '';
    for (let i = 1; i <= data.totalPages; i++) {
        html += `
            <li class="page-item ${i === data.number + 1 ? 'active' : ''}">
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
    $('#loadingSpinner').show();
}

function hideLoading() {
    $('#loadingSpinner').hide();
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
    const $container = $('#appointmentList');
    $container.html(`
        <div class="empty-state">
            <i class="fas fa-calendar-times"></i>
            <p id="emptyStateText">暂无预约记录</p>
        </div>
    `);
}

function exportAppointments() {
    const filters = {
        status: $('#statusFilter').val(),
        date: $('#dateFilter').val(),
        role: currentUserRole,
        userId: currentUserId
    };

    AppointmentAPI.exportList(filters)
        .then(response => {
            const blob = new Blob([response], { type: 'application/vnd.ms-excel' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '预约记录.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(() => {
            showError('导出失败');
        });
}