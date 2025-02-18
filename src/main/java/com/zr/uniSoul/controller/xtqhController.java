package com.zr.uniSoul.controller;

import com.zr.uniSoul.common.R;
import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.service.xtqhService;
import com.zr.uniSoul.utils.checkCode;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/xtqh")
@Api(tags = "学途启航")
@Slf4j
public class xtqhController {

    @Autowired
    private xtqhService xtqhService;



    /**
     * 用户登录
     * @param request
     * @param user
     * @return
     */
    @PostMapping("/login")
    @ApiOperation("用户登录接口")
    public R<User> login(HttpServletRequest request, @RequestBody User user){
        log.info("用户登录接口");
        //TODO:添加JWT或MD5加密处理

        User loginUser = xtqhService.login(user);
        if (loginUser != null){
            log.info("用户登录成功");
            //将用户的用户名存入session
            request.getSession().setAttribute("username",user.getUsername());
            return R.success(loginUser);
        }
        return R.error("用户名或密码错误");
    }
    @GetMapping("sendCheckCode")
    @ApiOperation("发送验证码")
    public R<String> sendCheckCode(HttpServletRequest request, @RequestParam String email){
        log.info("发送验证码");
        //获取验证码
        String Code = checkCode.generateVerificationCode();
        //发送验证码
        Boolean flag = xtqhService.sendCheckCode(email,Code);
        if (flag){
            log.info("验证码发送成功");
            return R.success(Code);
        }
        log.info("验证码发送失败");
        return R.error("验证码发送失败，请检查邮箱是否正确");
    }
    @PostMapping("register")
    @ApiOperation("用户注册接口")
    public R<String> register(HttpServletRequest request, @RequestBody User user){
        log.info("用户注册接口");
        //TODO:添加JWT或MD5加密处理
        //先判断用户名是否已经存在
        User user1 = xtqhService.findByUsername(user.getUsername());
        if (user1 != null){
            log.info("用户名已存在");
            return R.error("用户名已存在");
        }
        int ret = xtqhService.register(user);
        if (ret != 0){
            log.info("用户注册成功");
            //将用户的用户名存入session
            request.getSession().setAttribute("username",user.getUsername());
            return R.success("注册成功");
        }
        return R.error("用户注册失败");
    }
    /**
     * 编辑个人信息
     */
    @PostMapping("/information")
    @ApiOperation("编辑个人信息")
    public R<String> editUserInfo(HttpServletRequest request, @RequestBody User user){
        log.info("编辑个人信息接口");
        HttpSession session =  request.getSession();
        user.setUsername(session.getAttribute("username").toString());
        //保存个人信息
        int ret = xtqhService.editUserInfo(user);
        if (ret != 0){
            log.info("编辑个人信息成功");
            return R.success("编辑个人信息成功");
        }
        return R.error("编辑个人信息失败");
    }
//    @PostMapping("likes")
//    @ApiOperation("点赞")
//    public R<String> likes(HttpServletRequest request, @RequestParam String username){
//        log.info("点赞接口");
//        int ret = xtqhService.likes(username);
//    }

}
