package com.zr.uniSoul.mapper;

import com.zr.uniSoul.pojo.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface xtqhMapper {
    User findByPasswordAndUsername(@Param("password") String password, @Param("username") String username);
}
