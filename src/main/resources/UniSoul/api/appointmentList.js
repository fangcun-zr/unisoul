const AppointmentAPI = {
    // 获取预约列表
    getList: function(params) {
        return $.ajax({
            url: '/appointment/list',
            method: 'GET', getList: function(params) {
                return $.ajax({
                    url: '/appointment/list',
                    method: 'GET',
                    data: {
                        current: params.current,    // ✅ 确保参数名与后端一致
                        pageSize: params.pageSize,  // 使用后端接受的参数名
                        status: params.status,
                        appointmentDate: params.appointmentDate
                    }
                });
            },
            data: {
                current: params.current,    // ✅ 确保参数名与后端一致
                pageSize: params.pageSize,  // 使用后端接受的参数名
                status: params.status,
                appointmentDate: params.appointmentDate
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
            url: `/appointment/${appointmentId}/status`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ status: status })
        });
    },

    // 取消预约
    cancel: function(appointmentId) {
        return $.ajax({
            url: `/appointment/cancel/${appointmentId}`,
            type: 'POST'
        });
    },

    // 获取医生可预约时间段
    getDoctorSchedule: function(doctorId, date) {
        return $.ajax({
            url: `/appointment/doctor/${doctorId}/schedule`,
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
    getPatientHistory: function() {
        return $.ajax({
            url: '/appointment/patient/history',
            type: 'GET',
            data: {
                patientName: currentUserName // 直接使用当前登录用户姓名
            }
        });
    },

    // 导出预约记录
    exportList: function(filters) {
        return $.ajax({
            url: '/appointment/export',
            method: 'GET',
            data: filters,
            xhrFields: {
                responseType: 'blob'
            }
        });
    }
};