package com.zr.uniSoul.controller.xtqh;

import com.zr.uniSoul.common.R;
import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.service.xtqhService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

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
            return R.success(loginUser);
        }
        return R.error("用户名或密码错误");
    }

}
