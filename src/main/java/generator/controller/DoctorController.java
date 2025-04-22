// DoctorController.java
package generator.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.zr.uniSoul.common.R;
import com.zr.uniSoul.utils.CheckCode;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import generator.common.BaseResponse;
import generator.common.ErrorCode;
import generator.common.ResultUtils;
import generator.domain.Doctor;
import generator.exception.BusinessException;
import generator.service.DoctorService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.redis.core.RedisTemplate;
import java.util.concurrent.TimeUnit;


import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.validation.constraints.NotBlank;

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
    @PostMapping(value = "/register")
    public BaseResponse<Boolean> registerDoctor(
            @RequestBody Doctor doctor) {
        try {
            boolean result = doctorService.registerDoctor(doctor);
            return ResultUtils.success(result);
        } catch (BusinessException e) {
            return ResultUtils.error(e.getCode(), e.getMessage());
        }
    }

    // 添加医生（基础信息）
    @PostMapping("/add")
    public BaseResponse<Boolean> addDoctor(@RequestBody Doctor doctor) {
        try {
            boolean result = doctorService.registerDoctor(doctor);
            return ResultUtils.success(result);
        } catch (BusinessException e) {
            return ResultUtils.error(e.getCode(), e.getMessage());
        }
    }


    @GetMapping("/list")
    public BaseResponse<Map<String, Object>> getDoctorList(
            @RequestParam(defaultValue = "1") int current,
            @RequestParam(defaultValue = "10") int pageSize) {
        Page<Doctor> page = doctorService.listDoctors(current, pageSize);
        Map<String, Object> result = new HashMap<>();
        result.put("doctors", page.getRecords());
        result.put("total", page.getTotal());
        return ResultUtils.success(result);
    }

    @GetMapping("/{id}")
    public BaseResponse<Doctor> getDoctorDetail(@PathVariable Integer id) {
        Doctor doctor = doctorService.getDoctorWithSchedule(id);
        return ResultUtils.success(doctor);
    }

    //添加验证码
    @GetMapping("sendVerificationCode")
    @ApiOperation("发送邮箱验证码")
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

    @PostMapping("/verifyCode")
    @ApiOperation("校验邮箱验证码")
    public R<String> verifyCode(
            @RequestParam("email") @NotBlank(message = "邮箱不能为空") String email,
            @RequestParam @NotBlank(message = "验证码不能为空") String code
    ) {
        // 从Redis获取验证码
        String storedCode = redisTemplate.opsForValue().get("verification_code:" + email);

        // 验证码不存在或已过期
        if (storedCode == null) {
            log.warn("验证码不存在或已过期，邮箱：{}", email);
            return R.error("验证码已过期，请重新获取");
        }

        // 验证码不匹配
        if (!storedCode.equals(code)) {
            log.warn("验证码不匹配，邮箱：{}，输入：{}，实际：{}", email, code, storedCode);
            return R.error("验证码错误");
        }

        // 验证通过后删除Redis中的验证码（防止重复使用）
        redisTemplate.delete("verification_code:" + email);

        log.info("邮箱验证码校验成功：{}", email);
        return R.success("验证码校验成功");
    }

}