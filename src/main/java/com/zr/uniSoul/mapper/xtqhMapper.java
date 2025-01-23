package com.zr.uniSoul.mapper;

import com.zr.uniSoul.pojo.entity.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;

@Mapper
public interface xtqhMapper {
    User findByPasswordAndUsername(@Param("password") String password, @Param("username") String username);

    @Insert("insert into user(username,password,email,created_at) values(#{username},#{password},#{email},#{createTime})")
    int insert(String username, String password, String email, LocalDateTime createTime);

    User findByUsername(String username);

    int update(User user);
}
