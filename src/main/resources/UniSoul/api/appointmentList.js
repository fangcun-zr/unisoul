const AppointmentAPI = {
    // 获取预约列表
    getList: function(page = 1, filters = {}) {
        return $.ajax({
            url: 'api/appointments',
            type: 'GET',
            data: {
                page: page,
                size: 10,
                ...filters
            }
        });
    },

    // 创建新预约
    create: function(appointmentData) {
        return $.ajax({
            url: '/appointment/book',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(appointmentData)
        });
    },

    // 更新预约状态
    updateStatus: function(appointmentId, status) {
        return $.ajax({
            url: `/appointments/${appointmentId}/status`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ status: status })
        });
    },

    // 取消预约
    cancel: function(appointmentId) {
        return $.ajax({
            url: `/appointments/${appointmentId}/cancel`,
            type: 'PUT'
        });
    },

    // 获取医生可预约时间段
    getDoctorSchedule: function(doctorId, date) {
        return $.ajax({
            url: `/appointments/doctor/${doctorId}/schedule`,
            type: 'GET',
            data: { date: date }
        });
    },

    // 获取医生详细信息
    getDoctorInfo: function(doctorId) {
        return $.ajax({
            url: `/doctors/${doctorId}`,
            type: 'GET'
        });
    },

    // 获取患者预约历史
    getPatientHistory: function(patientId) {
        return $.ajax({
            url: `/api/appointments/patient/${patientId}/history`,
            type: 'GET'
        });
    },

    // 导出预约记录
    exportList: function(filters) {
        return $.ajax({
            url: '/api/appointments/export',
            type: 'GET',
            data: filters,
            responseType: 'blob'
        });
    }
};