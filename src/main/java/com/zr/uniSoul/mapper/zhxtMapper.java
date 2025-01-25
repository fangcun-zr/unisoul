package com.zr.uniSoul.mapper;

import com.zr.uniSoul.pojo.entity.Article;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface zhxtMapper {

    @Select("select id from user where username = #{username}")
    int findIdByUsername(String username);

    Integer insert(Article article);
}
