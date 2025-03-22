package generator.mapper;

import generator.domain.Appointment;
import generator.domain.Doctor;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.Date;
import java.util.List;

/**
* @author ztb
* @description 针对表【doctor(医疗人员信息表)】的数据库操作Mapper
* @createDate 2025-03-21 20:57:32
* @Entity generator.domain.Doctor
*/
public interface DoctorMapper extends BaseMapper<Doctor> {
    /**
     * 查询医生排班信息
     * @param doctorName 医生姓名（需与数据库字段名一致）
     * @param startDate 开始日期
     * @param endDate 结束日期
     */
    @Select("SELECT * FROM appointment WHERE doctor_name = #{doctorName} " +
            "AND appointment_date BETWEEN #{startDate} AND #{endDate} " +
            "ORDER BY appointment_date, appointment_time")
    List<Appointment> selectDoctorSchedule(
            @Param("doctorName") String doctorName,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate);

}




