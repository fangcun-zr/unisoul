// AppointmentController.java
package generator.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import generator.common.BaseResponse;
import generator.common.ErrorCode;
import generator.common.ResultUtils;
import generator.domain.Appointment;
import generator.exception.BusinessException;
import generator.service.AppointmentService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/appointment")
public class AppointmentController {

    @Resource
    private AppointmentService appointmentService;

    @PostMapping("/book")
    public BaseResponse<Boolean> bookAppointment(@RequestBody Appointment appointment) {
        System.out.println("Received appointment booking request: " + appointment);
        try {
            boolean result = appointmentService.createAppointment(appointment);
            return ResultUtils.success(result);
        } catch (BusinessException e) {
            return ResultUtils.error(e.getCode(), e.getMessage());
        }
    }

    @PostMapping("/cancel/{id}")
    public BaseResponse<Boolean> cancelAppointment(@PathVariable Integer id) {
        if (id == null || id <= 0) {
            return ResultUtils.error(ErrorCode.PARAMS_ERROR, "无效的预约ID");
        }
        boolean result = appointmentService.cancelAppointment(id);
        return ResultUtils.success(result);
    }

    @GetMapping("/list")
    public BaseResponse<Page<Appointment>> getAppointmentList(
            @RequestParam(required = false) String patientName,
            @RequestParam(defaultValue = "1") int current,
            @RequestParam(defaultValue = "10") int pageSize) {
        Page<Appointment> appointments = appointmentService.listAppointments(patientName, current, pageSize);
        return ResultUtils.success(appointments);
    }

    @PutMapping("/{id}/status")
    public BaseResponse<Boolean> updateAppointmentStatus(@PathVariable Integer id, @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            boolean result = appointmentService.updateStatus(id, status);
            return ResultUtils.success(result);
        } catch (BusinessException e) {
            return ResultUtils.error(e.getCode(), e.getMessage());
        }
    }

    @GetMapping("/doctor/{doctorId}/schedule")
    public BaseResponse<List<String>> getDoctorSchedule(
            @PathVariable Integer doctorId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date date) {
        try {
            List<String> timeSlots = appointmentService.getAvailableTimeSlots(doctorId, date);
            return ResultUtils.success(timeSlots);
        } catch (BusinessException e) {
            return ResultUtils.error(e.getCode(), e.getMessage());
        }
    }

    @GetMapping("/patient/history")
    public BaseResponse<Page<Appointment>> getPatientHistory(
            @RequestParam String patientName,
            @RequestParam String patientPhone,
            @RequestParam(defaultValue = "1") int current,
            @RequestParam(defaultValue = "10") int pageSize) {
        Page<Appointment> history = appointmentService.getPatientHistory(patientName, patientPhone, current, pageSize);
        return ResultUtils.success(history);
    }

    @GetMapping("/export")
    public void exportAppointments(HttpServletResponse response,
                                   @RequestParam(required = false) String doctorName,
                                   @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
                                   @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        try {
            appointmentService.exportAppointments(response, doctorName, startDate, endDate);
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "导出失败");
        }
    }
}
