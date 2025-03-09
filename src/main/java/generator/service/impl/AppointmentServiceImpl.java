package generator.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import generator.common.ErrorCode;
import generator.domain.Appointment;
import generator.domain.Doctor;
import generator.mapper.DoctorMapper;
import generator.service.AppointmentService;
import generator.mapper.AppointmentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
* @author ztb
* @description 针对表【appointment】的数据库操作Service实现
* @createDate 2025-03-05 23:49:29
*/
@Service
public class AppointmentServiceImpl extends ServiceImpl<AppointmentMapper, Appointment>
    implements AppointmentService{

    @Autowired
    private DoctorMapper doctorMapper;
    @Override
    public boolean bookAppointment(Appointment appointment) {
        // 1. 检查医生是否存在
        Doctor doctor = doctorMapper.selectById(appointment.getDoctorId());
        if (doctor == null) {
            throw new RuntimeException(ErrorCode.PARAMS_ERROR.getMessage() + ": 医生不存在");
        }

        // 2. 检查时间冲突
        QueryWrapper<Appointment> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("doctor_id", appointment.getDoctorId())
                .eq("appointment_date", appointment.getAppointmentDate())
                .eq("appointment_time", appointment.getAppointmentTime());
        Long count = baseMapper.selectCount(queryWrapper);
        if (count > 0) {
            throw new RuntimeException(ErrorCode.PARAMS_ERROR.getMessage() + ": 该时间段已被预约");
        }

        // 3. 保存预约
        return this.save(appointment);
    }

    @Override
    public boolean cancelAppointment(Integer id) {
        return this.removeById(id);
    }
}




