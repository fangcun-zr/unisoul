package generator.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import generator.common.BaseResponse;
import generator.common.ErrorCode;
import generator.common.PageRequest;
import generator.common.ResultUtils;
import generator.domain.Doctor;
import generator.service.DoctorService;
import io.swagger.annotations.Api;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@RestController
@RequestMapping("/doctor")
@Api(tags = "预约服务")
public class DoctorController {

    @Resource
    private DoctorService doctorService;

    // 注册医生
    @PostMapping("/add")
    public BaseResponse<Boolean> addDoctor(@RequestBody Doctor doctor) {
       if (doctor.getName() == null || doctor.getSpecialization() == null) {
            return ResultUtils.error(ErrorCode.PARAMS_ERROR, "参数不能为空");
        }
        boolean result = doctorService.save(doctor);
        return ResultUtils.success(result);
 //       return ResultUtils.success(true);
    }

    // 分页查询医生
    @GetMapping("/list")
    public BaseResponse<Page<Doctor>> listDoctors(PageRequest pageRequest) {
        Page<Doctor> page = new Page<>(pageRequest.getCurrent(), pageRequest.getPageSize());
        QueryWrapper<Doctor> queryWrapper = new QueryWrapper<>();
        Page<Doctor> result = doctorService.page(page, queryWrapper);
        return ResultUtils.success(result);
    }
}