package generator.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import generator.domain.Appointment;
import generator.domain.Doctor;
import generator.exception.BusinessException;
import generator.mapper.AppointmentMapper;
import generator.mapper.DoctorMapper;
import generator.service.AppointmentService;
import generator.common.ErrorCode;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl extends ServiceImpl<AppointmentMapper, Appointment> implements AppointmentService {

    @Resource
    private DoctorMapper doctorMapper;

    @Override
    public boolean createAppointment(Appointment appointment) throws BusinessException {
        // 校验必填字段
        if (StringUtils.isEmpty(appointment.getPatientName())) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "患者姓名不能为空");
        }

        // 校验医生是否存在
        Doctor doctor = doctorMapper.selectOne(new QueryWrapper<Doctor>()
                .eq("full_name", appointment.getDoctorName()));
        if (doctor == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "医生不存在");
        }

        // 校验时间冲突
        Long count = baseMapper.selectCount(new QueryWrapper<Appointment>()
                .eq("doctor_name", appointment.getDoctorName())
                .eq("appointment_date", appointment.getAppointmentDate())
                .eq("appointment_time", appointment.getAppointmentTime()));
        if (count > 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "该时间段已被预约");
        }

        // 设置系统时间
        Date now = new Date();
        appointment.setCreatedAt(now);
        appointment.setUpdatedAt(now);

        return this.save(appointment);
    }

    @Override
    public boolean cancelAppointment(Integer id) {
        return this.removeById(id);
    }

    @Override
    public Page<Appointment> listAppointments(String patientName, int current, int pageSize) {
        QueryWrapper<Appointment> queryWrapper = new QueryWrapper<>();
        if (StringUtils.hasText(patientName)) {
            queryWrapper.eq("patient_name", patientName);
        }
        return this.page(new Page<>(current, pageSize), queryWrapper);
    }

    @Override
    public boolean updateStatus(Integer id, String status) throws BusinessException {
        Appointment appointment = this.getById(id);
        if (appointment == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "预约记录不存在");
        }

        // 状态有效性校验
        if (!Arrays.asList("CONFIRMED", "COMPLETED", "CANCELLED").contains(status)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "无效的状态值");
        }

        appointment.setStatus(status);
        appointment.setUpdatedAt(new Date());
        return this.updateById(appointment);
    }

    @Override
    public List<String> getAvailableTimeSlots(Integer doctorId, Date date) throws BusinessException {
        // 获取医生信息
        Doctor doctor = doctorMapper.selectById(doctorId);
        if (doctor == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "医生不存在");
        }

        // 查询当天已有预约
        List<Appointment> appointments = baseMapper.selectList(new QueryWrapper<Appointment>()
                .eq("doctor_name", doctor.getFullName())
                .eq("appointment_date", date)
                .select("appointment_time"));

        // 生成可用时间段（示例逻辑）
        List<String> allSlots = generateTimeSlots();
        Set<String> bookedSlots = appointments.stream()
                .map(a -> formatTime(a.getAppointmentTime()))
                .collect(Collectors.toSet());

        return allSlots.stream()
                .filter(slot -> !bookedSlots.contains(slot))
                .collect(Collectors.toList());
    }

    @Override
    public Page<Appointment> getPatientHistory(String patientName, String patientPhone, int current, int pageSize) {
        QueryWrapper<Appointment> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("patient_name", patientName)
                .eq("patient_phone", patientPhone)
                .orderByDesc("appointment_date");
        return this.page(new Page<>(current, pageSize), queryWrapper);
    }

    @Override
    public void exportAppointments(HttpServletResponse response, String doctorName, Date startDate, Date endDate) throws IOException {
        QueryWrapper<Appointment> queryWrapper = new QueryWrapper<>();
        if (StringUtils.hasText(doctorName)) {
            queryWrapper.like("doctor_name", doctorName);
        }
        if (startDate != null) {
            queryWrapper.ge("appointment_date", startDate);
        }
        if (endDate != null) {
            queryWrapper.le("appointment_date", endDate);
        }

        List<Appointment> data = this.list(queryWrapper);

        // 生成Excel
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("预约记录");
            // 创建表头...
            // 填充数据...

            // 设置响应头
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=appointments.xlsx");
            workbook.write(response.getOutputStream());
        }
    }

    private List<String> generateTimeSlots() {
        // 示例时间段生成逻辑（8:00-18:00 每30分钟）
        List<String> slots = new ArrayList<>();
        LocalTime start = LocalTime.of(8, 0);
        LocalTime end = LocalTime.of(18, 0);
        while (start.isBefore(end)) {
            slots.add(start.toString());
            start = start.plusMinutes(30);
        }
        return slots;
    }

    private String formatTime(LocalTime time) {
        return time.toString();
    }

}