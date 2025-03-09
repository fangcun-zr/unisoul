package generator.service;

import generator.domain.Appointment;
import com.baomidou.mybatisplus.extension.service.IService;

/**
* @author ztb
* @description 针对表【appointment】的数据库操作Service
* @createDate 2025-03-05 23:49:29
*/
public interface AppointmentService extends IService<Appointment> {
    boolean bookAppointment(Appointment appointment);
    boolean cancelAppointment(Integer id);
}
