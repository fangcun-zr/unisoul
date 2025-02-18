package com.zr.uniSoul.service;

import com.zr.uniSoul.common.PageResult;
import com.zr.uniSoul.pojo.dto.CommentsPageDTO;
import com.zr.uniSoul.pojo.dto.PageQueryDTO;
import com.zr.uniSoul.pojo.entity.Article;

public interface zhxtService {
    int findIdByUsername(String username);

    Integer publish(Article article);

    PageResult pageQuery(PageQueryDTO pageQueryDTO);

    PageResult getComments(CommentsPageDTO articleId);
}
