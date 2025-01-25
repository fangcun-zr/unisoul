package com.zr.uniSoul.service;

import com.zr.uniSoul.pojo.entity.Article;

public interface zhxtService {
    int findIdByUsername(String username);

    Integer publish(Article article);
}
