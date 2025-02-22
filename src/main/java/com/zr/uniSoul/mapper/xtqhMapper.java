package com.zr.uniSoul.mapper;

import com.zr.uniSoul.pojo.entity.UserDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;

@Mapper
public interface xtqhMapper {
    UserDTO findByPasswordAndUsername(@Param("password") String password, @Param("username") String username);

    @Insert("insert into user(username,password,email,created_at,name,avatarUrl) values(#{username},#{password},#{email},#{createTime},#{name},#{avatarUrl})")
    int insert(String username, String password, String email, LocalDateTime createTime, String name, String avatarUrl);

    UserDTO findByUsername(String username);

    int update(UserDTO user);

    int follow(int user_id, int role_id);

    Integer findIdByUsername(String role_name);

    @Select("select count(*) from follow where follower_id = #{userId} and following_id = #{followingId}")
    int findFollow(int userId, Integer followingId);
}
