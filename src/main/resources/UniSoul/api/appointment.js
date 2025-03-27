// 全局Ajax设置
$.ajaxSetup({
    beforeSend: function(xhr) {
        const token = localStorage.getItem('token');
        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
    },
    complete: function(xhr) {
        if (xhr.status === 401) {
            window.location.href = '/login.html';
        }
    }
});

// 统一的错误处理
function handleError(error) {
    if (error.status === 404) {
        return {
            success: false,
            message: '请求的资源不存在'
        };
    }
    return {
        success: false,
        message: error.responseJSON?.error || '服务器错误'
    };
}

// API接口定义
const MedicalAPI = {

    // 预约相关接口
    appointment: {
        create: function(appointmentData) {
            return $.ajax({
                url: '/appointment/book',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(appointmentData)
            }).then(this.handleResponse).catch(handleError);
        },

        cancel: function(appointmentId) {
            return $.ajax({
                url: `/appointment/cancel/${appointmentId}`,
                type: 'POST'
            }).then(this.handleResponse).catch(handleError);
        },

        getList: function(page = 1, size = 10) {
            return $.ajax({
                url: '/appointment/list',
                type: 'GET',
                data: { page, size }
            }).then(this.handleResponse).catch(handleError);
        }
    },

    // 医生相关接口
    doctor: {
        add: function(doctorData) {
            return $.ajax({
                url: '/doctor/add',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(doctorData)
            }).then(this.handleResponse).catch(handleError);
        },

        getList: function(page = 1, size = 10) {
            return $.ajax({
                url: '/doctor/list',
                type: 'GET',
                data: {
                    page: page,
                    size: size,
                }
            }).then(this.handleResponse).catch(handleError);
        }
    },

    // 响应处理
    handleResponse: function(response) {
        if (response.success === false) {
            throw new Error(response.message);
        }
        return response;
    }
};