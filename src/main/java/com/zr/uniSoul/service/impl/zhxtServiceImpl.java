package com.zr.uniSoul.service.impl;

import com.zr.uniSoul.pojo.entity.Article;
import com.zr.uniSoul.service.zhxtService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.zr.uniSoul.mapper.zhxtMapper;

import java.time.LocalDateTime;
import java.util.Date;

@Service
@Slf4j
public class zhxtServiceImpl implements zhxtService {

    @Autowired
    private zhxtMapper zhxtMapper;
    @Override
    public int findIdByUsername(String username) {
        return zhxtMapper.findIdByUsername(username);
    }

    /**
     * 将文章信息存入数据库
     * @param article
     * @return
     */
    @Override
    public Integer publish(Article article) {
        article.setCreateTime();
        article.setUpdateTime();
        return zhxtMapper.insert(article);
    }
}
