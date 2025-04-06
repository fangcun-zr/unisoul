
const Utils = {
    // 日期时间处理
    date: {
        formatDateTime: function(dateTimeStr) {
            const date = new Date(dateTimeStr);
            return `${date.getFullYear()}-${this.padZero(date.getMonth() + 1)}-${this.padZero(date.getDate())} ${this.padZero(date.getHours())}:${this.padZero(date.getMinutes())}`;
        },

        padZero: function(num) {
            return num < 10 ? `0${num}` : num;
        },

        isValidDate: function(dateString) {
            const date = new Date(dateString);
            return date instanceof Date && !isNaN(date);
        },

        isFutureDate: function(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            return date > now;
        }
    },

    // 缓存处理
    cache: {
        set: function(key, data, expirationInMinutes = 5) {
            const item = {
                data: data,
                timestamp: new Date().getTime(),
                expirationInMinutes: expirationInMinutes
            };
            localStorage.setItem(key, JSON.stringify(item));
        },

        get: function(key) {
            const item = localStorage.getItem(key);
            if (!item) return null;

            const parsedItem = JSON.parse(item);
            const now = new Date().getTime();
            const expirationTime = parsedItem.timestamp + (parsedItem.expirationInMinutes * 60 * 1000);

            if (!parsedItem.data || !parsedItem.timestamp) {
                localStorage.removeItem(key);
                return null;
            }

            if (now > expirationTime) {
                localStorage.removeItem(key);
                return null;
            }

            return parsedItem.data;
        }
    },

    // 防抖和节流
    debounce: function(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};


// 页面初始化
$(document).ready(function() {
    initPage();
    bindEvents();
    if (typeof $ === 'undefined') {
        console.error('jQuery 未加载！');
    }
});



// 初始化页面
function initPage() {
    if (!sessionStorage.getItem('initialPage')) {
        sessionStorage.setItem('initialPage', window.location.href);
    }
    loadDoctorList();
    loadAppointmentList();

}

// 表单验证
function validateAppointmentForm() {
    const data = {
        patientName: $('#patientName').val()?.trim() || '',
        licenseNumber: $('#doctorSelect').val(),
        patientPhone: $('#patientPhone').val()?.trim() || '',
        consultationType: $('#consultationType').val(),
        conditionDescription: $('#conditionDescription').val(),
        appointmentDate: $('#appointmentDate').val(),
        appointmentTime: $('#appointmentTime').val()
    };

    if (!data.patientName) {
        showError('请输入患者姓名');
        return false;
    }
    if (!data.licenseNumber) {
        showError('请选择医生');
        return false;
    }
    if (!data.appointmentDate) {
        showError('请选择预约日期');
        return false;
    }
    if (!data.appointmentTime) {
        showError('请选择预约时间');
        return false;
    }
    if (!Utils.date.isFutureDate(data.appointmentDate)) {
        showError('预约日期必须是将来的日期');
        return false;
    }

    return data;
}

// 加载医生列表
function loadDoctorList(page = 1) {
    const cacheKey = `doctors_page_${page}`;
    const cachedData = Utils.cache.get(cacheKey);


    MedicalAPI.doctor.getList(page, 10) // 明确传递size参数
        .then(response => {
            Utils.cache.set(cacheKey, response);
            renderDoctorList(response);
            renderDoctorOptions(response.content); // 可能需要调整数据结构
        })
}

// 渲染医生列表
function renderDoctorList(data) {
    const $doctorList = $('#doctorList');
    $doctorList.empty();

    if (!data?.data?.doctors || !Array.isArray(data.data.doctors)) {
        console.error('Invalid doctor data:', data);
        showError('医生数据加载异常');
        return;
    }

    data.content.forEach(doctor => {
        $doctorList.append(`
            <div class="doctor-item">
                <div class="doctor-info">
                    <h5>${doctor.name}</h5>
                    <p>专业：${doctor.specialization}</p>
                </div>
            </div>
        `);
    });

    updatePagination(data, 'doctor');
}

// 加载预约列表
function loadAppointmentList(page = 1) {
    MedicalAPI.appointment.getList(page)
        .then(response => {
            renderAppointmentList(response);
        })
        .catch(error => {
            console.error('Failed to load appointments:', error);
            showError('加载预约列表失败');
        });
}

// 渲染预约列表
function renderAppointmentList(data) {
    const $appointmentList = $('#appointmentList');
    $appointmentList.empty();

    if (!data?.data?.records || !Array.isArray(data.data.records)) {
        console.error('Invalid appointment data:', data);
        showError('预约数据加载异常');
        return;
    }

    data.data.records.forEach(appointment => {
        $appointmentList.append(`
            <div class="appointment-item" data-id="${appointment.id}">
                <div class="appointment-info">
                    <h5>预约时间：${Utils.date.formatDateTime(appointment.appointmentTime)}</h5>
                    <p>患者姓名：${appointment.patientName}</p>
                    <p>医生：${appointment.doctorName}</p>
                </div>
                <div class="appointment-actions">
                    <button class="btn btn-danger btn-sm cancel-appointment" data-id="${appointment.id}">
                        取消预约
                    </button>
                </div>
            </div>
        `);
    });

    updatePagination(data, 'appointment');
}

// 绑定事件
function bindEvents() {
    // 预约表单提交
    $('#appointmentForm').on('submit', function(e) {
        e.preventDefault();
        const data = validateAppointmentForm();
        if (data) {
            submitAppointment(data);
        }
    });

    // 医生表单提交
    $('#doctorForm').on('submit', function(e) {
        e.preventDefault();
        submitDoctor();
    });

    // 取消预约
    $(document).on('click', '.cancel-appointment', function() {
        const appointmentId = $(this).data('id');
        cancelAppointment(appointmentId);
    });

    // 分页点击 - 使用节流
    $(document).on('click', '.pagination .page-link', Utils.throttle(function(e) {
        e.preventDefault();
        const page = $(this).data('page');
        const type = $(this).closest('.pagination').data('type');

        if (type === 'doctor') {
            loadDoctorList(page);
        } else {
            loadAppointmentList(page);
        }
    }, 1000));

    // 搜索框输入 - 使用防抖
    $('#searchInput').on('input', Utils.debounce(function() {
        const searchTerm = $(this).val().trim();
        if (searchTerm) {
            loadDoctorList(1, searchTerm);
        }
    }, 500));
}

// 提交预约
function submitAppointment(appointmentData) {
    MedicalAPI.appointment.create(appointmentData)
        .then(response => {
            showSuccess('预约成功');
            $('#appointmentModal').modal('hide');
            loadAppointmentList();

            // 添加重定向逻辑
            const initialPage = sessionStorage.getItem('initialPage') || '/';  // 默认首页
            window.location.href = initialPage;
        })
        .catch(error => {
            console.error('Appointment failed:', error);
            showError('预约失败');
        });
}

// 提交医生信息
function submitDoctor() {
    const doctorData = {
        name: $('#doctorName').val(),
        specialization: $('#specialization').val()
    };

    MedicalAPI.doctor.add(doctorData)
        .then(response => {
            showSuccess('添加医生成功');
            $('#doctorModal').modal('hide');
            loadDoctorList();
        })
        .catch(error => {
            console.error('Add doctor failed:', error);
            showError('添加医生失败');
        });
}

// 取消预约
function cancelAppointment(appointmentId) {
    if (confirm('确定要取消这个预约吗？')) {
        MedicalAPI.appointment.cancel(appointmentId)
            .then(response => {
                showSuccess('取消预约成功');
                loadAppointmentList();
            })
            .catch(error => {
                console.error('Cancel failed:', error);
                showError('取消预约失败');
            });
    }
}

// 更新分页
function updatePagination(data, type) {
    const $pagination = $(`.pagination[data-type="${type}"]`);
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

// 消息提示
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