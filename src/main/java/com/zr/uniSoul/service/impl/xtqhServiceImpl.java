package com.zr.uniSoul.service.impl;

import com.zr.uniSoul.mapper.xtqhMapper;
import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.service.xtqhService;
import com.zr.uniSoul.utils.AliOssUtil;
import com.zr.uniSoul.utils.MailUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;


@Slf4j
@Service
public class xtqhServiceImpl implements xtqhService {

    @Autowired
    private xtqhMapper xtqhmapper;

    @Autowired
    private AliOssUtil aliOssUtil;
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
        //设置默认用户昵称
        user.setName("用户"+user.getUsername());
        //设置默认头像
        File file = new File("img/AvatarImg.jpg");
        //将项目中的默认头像上传至阿里云
        log.info("头像上传:{}",file);
        try {
            //原始文件名
            String originalFilename = file.getName();
            //截取原始文件后缀  xxx.png
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            //生成新的文件名
            String objectName = UUID.randomUUID().toString() + extension;
            //上传文件
            byte[] fileBytes = Files.readAllBytes(Paths.get(ClassLoader.getSystemResource("img/AvatarImg.jpg").toURI()));

            String filePath = aliOssUtil.upload(fileBytes, objectName);
            //将上传后的文件路径存入数据库
            user.setAvatarUrl(filePath);
            log.info("上传成功:{}",filePath);
        } catch (IOException e) {
            log.error("文件上传失败:{}",e);
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
        return xtqhmapper.insert(user.getUsername(),user.getPassword(),user.getEmail(),user.getCreateTime(),user.getName(),user.getAvatarUrl());
    }

    @Override
    public User findByUsername(String username) {
        return xtqhmapper.findByUsername(username);
    }

    @Override
    public int editUserInfo(User user) {
        return xtqhmapper.update(user);
    }
}
