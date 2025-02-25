package com.zr.uniSoul.mapper;

import com.zr.uniSoul.pojo.entity.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface xtqhMapper {
    User findByPasswordAndUsername(@Param("password") String password, @Param("username") String username);

    @Insert("insert into user(username,password,email,created_at,name,avatarUrl) values(#{username},#{password},#{email},#{createTime},#{name},#{avatarUrl})")
    int insert(String username, String password, String email, LocalDateTime createTime, String name, String avatarUrl);

    User findByUsername(String username);

    int update(User user);

    int follow(int user_id, int role_id);

    Integer findIdByUsername(String role_name);

    @Select("select count(*) from follow where follower_id = #{userId} and following_id = #{followingId}")
    int findFollow(int userId, Integer followingId);
    /**
     * 文章点赞
     * @Param("article_id") int article_id
     * @Param("user_id") int user_id
     */
    void likes(int article_id, int user_id);

    int updateAvatar(String username, String filePath);

    /**
     * 根据用户名获取粉丝
     * @param username
     * @return
     */
    List<String> getFollowersByUsername(String username);
}
