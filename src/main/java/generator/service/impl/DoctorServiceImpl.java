package generator.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zr.uniSoul.utils.MailUtils;
import generator.common.ErrorCode;
import generator.domain.Appointment;
import generator.domain.Doctor;
import generator.exception.BusinessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import generator.mapper.DoctorMapper;
import generator.service.DoctorService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import javax.transaction.Transactional;
import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Service
public class DoctorServiceImpl extends ServiceImpl<DoctorMapper, Doctor> implements DoctorService {

    private static final Logger log = LoggerFactory.getLogger(DoctorServiceImpl.class);

    @Transactional
    @Override
    public boolean registerDoctor(Doctor doctor) throws BusinessException {
        // 预处理字段：去除前后空格
        preProcessDoctorFields(doctor);
        // 校验必填字段
        validateRequiredFields(doctor);
        // 唯一性校验
        checkUniqueConstraints(doctor);

        // 设置系统时间
        Date now = new Date();
        doctor.setCreatedAt(now);
        doctor.setUpdatedAt(now);

        try {
            return this.save(doctor);
        } catch (DuplicateKeyException e) {
            handleDuplicateKeyException(e);
            return false; // 实际会抛出异常，不会执行到此处
        }
    }


    private void preProcessDoctorFields(Doctor doctor) {
        if (doctor.getPhoneNumber() != null) {
            doctor.setPhoneNumber(doctor.getPhoneNumber().trim());
        }
        if (doctor.getEmail() != null) {
            doctor.setEmail(doctor.getEmail().trim());
        }
        if (doctor.getLicenseNumber() != null) {
            doctor.setLicenseNumber(doctor.getLicenseNumber().trim());
        }
    }


    private void validateRequiredFields(Doctor doctor) throws BusinessException {
        if (StringUtils.isBlank(doctor.getFullName())) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "姓名不能为空");
        }
        if (doctor.getGender() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "性别不能为空");
        }
        if (StringUtils.isBlank(doctor.getPhoneNumber())) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "手机号不能为空");
        }
        if (StringUtils.isBlank(doctor.getLicenseNumber())) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "执业证号不能为空");
        }

    }

    private void handleDuplicateKeyException(DuplicateKeyException e) {
        String message = e.getCause().getMessage();
        if (message.contains("phone_number")) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "手机号已存在");
        } else if (message.contains("email")) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "邮箱已存在");
        } else if (message.contains("license_number")) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "执业证号已存在");
        } else {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "数据重复，请检查输入信息");
        }
    }


    private void checkUniqueConstraints(Doctor doctor) throws BusinessException {
        // 校验手机号
        if (this.baseMapper.exists(new QueryWrapper<Doctor>().eq("phone_number", doctor.getPhoneNumber()))) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "手机号已存在");
        }

        // 校验邮箱
        if (StringUtils.isNotBlank(doctor.getEmail()) &&
                this.baseMapper.exists(new QueryWrapper<Doctor>().eq("email", doctor.getEmail()))) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "邮箱已存在");
        }

        // 校验执业证号
        if (this.baseMapper.exists(new QueryWrapper<Doctor>().eq("license_number", doctor.getLicenseNumber()))) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "执业证号已存在");
        }
    }


    @Transactional
    @Override
    public Page<Doctor> listDoctors(int current, int pageSize) {
        return this.page(new Page<>(current, pageSize),
                new QueryWrapper<Doctor>().orderByDesc("created_at"));
    }

    @Transactional
    @Override
    public Doctor getDoctorWithSchedule(Integer id) {
        Doctor doctor = this.getById(id);
        if (doctor != null) {
            // 获取最近3天的排班信息
            Date startDate = new Date();
            Date endDate = Date.from(LocalDate.now().plusDays(3).atStartOfDay(ZoneId.systemDefault()).toInstant());

            List<Appointment> appointments = baseMapper.selectDoctorSchedule(
                    doctor.getFullName(),
                    startDate,
                    endDate
            );
            doctor.setRecentSchedule(appointments);
        }
        return doctor;
    }
    /**
     * 发送验证码
     *
     * @param code
     * @param
     * @return
     */
    @Transactional
    @Override
    public Boolean sendCheckCode(String email, String code) {
        log.info("验证码为：{}",code);
        return MailUtils.sendMail(email,"你好,欢迎注册医生，您的验证码为"+code,"注册验证码");
    }
}