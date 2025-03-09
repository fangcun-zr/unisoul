package generator.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import generator.common.BaseResponse;
import generator.common.ErrorCode;
import generator.common.PageRequest;
import generator.common.ResultUtils;
import generator.domain.Appointment;
import generator.service.AppointmentService;
import io.swagger.annotations.Api;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@RestController
@RequestMapping("/appointment")
@Api(tags = "预约服务")
public class AppointmentController {

    @Resource
    private AppointmentService appointmentService;

    // 创建预约
    @PostMapping("/book")
    public BaseResponse<Boolean> bookAppointment(@RequestBody Appointment appointment) {
        try {
            boolean result = appointmentService.bookAppointment(appointment);
            return ResultUtils.success(result);
        } catch (RuntimeException e) {
            return ResultUtils.error(ErrorCode.OPERATION_ERROR, e.getMessage());
        }
    }

    // 取消预约
    @PostMapping("/cancel/{id}")
    public BaseResponse<Boolean> cancelAppointment(@PathVariable Integer id) {
        boolean result = appointmentService.cancelAppointment(id);
        return ResultUtils.success(result);
    }

    // 分页查询患者预约
    @GetMapping("/list")
    public BaseResponse<Page<Appointment>> listAppointments(
            @RequestParam String patientName,
            PageRequest pageRequest) {
        Page<Appointment> page = new Page<>(pageRequest.getCurrent(), pageRequest.getPageSize());
        QueryWrapper<Appointment> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("patient_name", patientName);
        Page<Appointment> result = appointmentService.page(page, queryWrapper);
        return ResultUtils.success(result);
    }
}