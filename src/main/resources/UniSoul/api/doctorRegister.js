const DoctorAPI = {
    // 注册医生
    register: function(jsonData) {
        return $.ajax({
            url: '/doctor/register',
            type: 'POST',
            contentType: 'application/json', // 必须明确指定
            data: jsonData,
            processData: false
        });
    },

    // 验证医生信息
    validateInfo: function(field, value) {
        return $.ajax({
            url: '/doctor/validate',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                field: field,
                value: value
            })
        });
    },

    // 上传证书
    uploadCertificate: function(formData) {
        return $.ajax({
            url: '/api/doctor/certificate/upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false
        });
    },

    // 获取科室列表
    getDepartments: function() {
        return $.ajax({
            url: '/api/departments',
            type: 'GET'
        });
    },

    // 获取专业方向列表
    getSpecializations: function(departmentId) {
        return $.ajax({
            url: `/api/specializations/${departmentId}`,
            type: 'GET'
        });
    },

    // 发送验证码
    sendVerificationCode: function(phone) {
        return $.ajax({
            url: '/doctor/sendVerificationCode',
            type: 'GET',
            contentType: 'application/json',
            data: JSON.stringify({ phone: phone })
        });
    },

    // 验证验证码
    verifyCode: function(phone, code) {
        return $.ajax({
            url: '/doctor/verifyCode',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                phone: phone,
                code: code
            })
        });
    }
};