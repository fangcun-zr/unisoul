package com.zr.uniSoul.service.impl;

import com.zr.uniSoul.mapper.xtqhMapper;
import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.service.xtqhService;
import com.zr.uniSoul.utils.MailUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
public class xtqhServiceImpl implements xtqhService {

    @Autowired
    private xtqhMapper xtqhmapper;
    @Override
    public User login(User user) {

        return  xtqhmapper.findByPasswordAndUsername(user.getPassword(), user.getUsername());
    }

    /**
     * 发送验证码
     *
     * @param code
     * @param
     * @return
     */
    @Override
    public Boolean sendCheckCode(String email, String code) {
        log.info("验证码为：{}",code);
        return MailUtils.sendMail(email,"你好,欢迎注册学途心绘坊，您的验证码为"+code,"注册验证码");
    }

    /**
     * 用户注册
     * @param user
     * @return
     */
    @Override
    public int register(User user) {
        user.setCreateTime(LocalDateTime.now());
        return xtqhmapper.insert(user.getUsername(),user.getPassword(),user.getEmail(),user.getCreateTime());
    }

    @Override
    public User findByUsername(String username) {
        return xtqhmapper.findByUsername(username);
    }
}
