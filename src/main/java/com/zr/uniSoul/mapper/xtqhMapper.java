package com.zr.uniSoul.mapper;

import com.zr.uniSoul.pojo.entity.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;

@Mapper
public interface xtqhMapper {
    User findByPasswordAndUsername(@Param("password") String password, @Param("username") String username);

    @Insert("insert into user(username,password,email,created_at,name,avatarUrl) values(#{username},#{password},#{email},#{createTime},#{name},#{avatarUrl})")
    int insert(String username, String password, String email, LocalDateTime createTime, String name, String avatarUrl);

    User findByUsername(String username);

    int update(User user);
}
