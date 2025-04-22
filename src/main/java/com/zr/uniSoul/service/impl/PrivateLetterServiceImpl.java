package com.zr.uniSoul.service.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.zr.uniSoul.common.PageResult;
import com.zr.uniSoul.mapper.PrivateLetterMapper;
import com.zr.uniSoul.pojo.dto.PageQueryDTO;
import com.zr.uniSoul.pojo.vo.MessageVO;
import com.zr.uniSoul.pojo.vo.UserVO;
import com.zr.uniSoul.service.PrivateLetterService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;

@Service
@Slf4j
public class PrivateLetterServiceImpl implements PrivateLetterService {
    @Autowired
    private PrivateLetterMapper privateLetterMapper;

    @Override
    public PageResult pageQueryFollow(PageQueryDTO pageQueryDTO) {
        PageHelper.startPage(pageQueryDTO.getPage(), pageQueryDTO.getPageSize());
        Page<UserVO> page = privateLetterMapper.getFollowList(pageQueryDTO);
        log.info("page={}", page);
        if (page == null) {
            // 返回一个空的PageResult或者抛出自定义异常
            return new PageResult(0, new ArrayList<>()); // 假设PageResult的构造函数接受total和result列表作为参数
            // 或者
            // throw new CustomException("No comments found");
        }
        log.info("page.getResult={}", page.getResult());
        return new PageResult(page.getTotal(), page.getResult());
    }

    /**
     * 将消息存入数据库
     * @param username
     * @param toName
     * @param data
     */
    @Override
    public void storeMessage(String username, String toName, String data) {
        privateLetterMapper.storeMessage(username,toName,data);
    }

    @Override
    public PageResult getChatHistory(PageQueryDTO pageQueryDTO) {
        PageHelper.startPage(pageQueryDTO.getPage(), pageQueryDTO.getPageSize());
        Page<MessageVO> page = privateLetterMapper.getChatHistory(pageQueryDTO);
        log.info("page={}", page);
        if (page == null) {
            // 返回一个空的PageResult或者抛出自定义异常
            return new PageResult(0, new ArrayList<>()); // 假设PageResult的构造函数接受total和result列表作为参数
            // 或者
            // throw new CustomException("No comments found");
        }
        log.info("page.getResult={}", page.getResult());
        return new PageResult(page.getTotal(), page.getResult());
    }
}
