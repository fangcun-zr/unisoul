// DoctorController.java
package generator.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.zr.uniSoul.common.R;
import com.zr.uniSoul.utils.CheckCode;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import java.util.Random;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import generator.common.BaseResponse;
import generator.common.ErrorCode;
import generator.common.ResultUtils;
import generator.domain.Doctor;
import generator.exception.BusinessException;
import generator.service.DoctorService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.redis.core.RedisTemplate;
import java.util.concurrent.TimeUnit;


import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/doctor")
public class DoctorController {

    @Resource
    private DoctorService doctorService;
    @Resource
    private RedisTemplate<String, String> redisTemplate;
    // 验证码有效期（5分钟）
    private static final long CODE_EXPIRE = 5 * 60;
    private static final Logger log = LoggerFactory.getLogger(DoctorController.class);

    // 注册医生（带文件上传）
    @PostMapping("/register")
    public BaseResponse<Boolean> registerDoctor(
            @RequestPart Doctor doctor,
            @RequestPart(value = "photo", required = false) MultipartFile photo,
            @RequestPart(value = "certificate", required = false) MultipartFile certificate) {
        try {
            boolean result = doctorService.registerDoctor(doctor, photo, certificate);
            return ResultUtils.success(result);
        } catch (BusinessException e) {
            return ResultUtils.error(e.getCode(), e.getMessage());
        }
    }

    // 添加医生（基础信息）
    @PostMapping("/add")
    public BaseResponse<Boolean> addDoctor(@RequestBody Doctor doctor) {
        try {
            boolean result = doctorService.registerDoctor(doctor, null, null);
            return ResultUtils.success(result);
        } catch (BusinessException e) {
            return ResultUtils.error(e.getCode(), e.getMessage());
        }
    }

    @GetMapping("/list")
    public BaseResponse<Page<Doctor>> getDoctorList(
            @RequestParam(defaultValue = "1") int current,
            @RequestParam(defaultValue = "10") int pageSize) {
        Page<Doctor> doctors = doctorService.listDoctors(current, pageSize);
        return ResultUtils.success(doctors);
    }

    @GetMapping("/{id}")
    public BaseResponse<Doctor> getDoctorDetail(@PathVariable Integer id) {
        Doctor doctor = doctorService.getDoctorWithSchedule(id);
        return ResultUtils.success(doctor);
    }

    //添加验证码
    @GetMapping("send")
    @ApiOperation("发送验证码")
    public R<String> sendCheckCode(HttpServletRequest request, @RequestParam String email){
        log.info("发送验证码");
        //获取验证码
        String Code = CheckCode.generateVerificationCode();
        //发送验证码
        Boolean flag = doctorService.sendCheckCode(email,Code);
        if (flag){
            log.info("验证码发送成功");
            return R.success(Code);
        }
        log.info("验证码发送失败");
        return R.error("验证码发送失败，请检查邮箱是否正确");
    }

}