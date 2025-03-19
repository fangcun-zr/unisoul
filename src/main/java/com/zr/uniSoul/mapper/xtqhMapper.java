package com.zr.uniSoul.mapper;

import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.pojo.vo.ArticleVO;
import org.apache.ibatis.annotations.*;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface xtqhMapper {
    User findByPasswordAndUsername(@Param("password") String password, @Param("username") String username);

    @Insert("insert into user(username,password,email,created_at,name,avatarUrl) values(#{username},#{password},#{email},#{createTime},#{name},#{avatarUrl})")
    int insert(String username, String password, String email, LocalDateTime createTime, String name, String avatarUrl);

    User findByUsername(String username);

    int update(User user);

    int follow(int follower_id, int following_id);

    Integer findIdByUsername(String role_name);

    @Select("select count(*) from follow where follower_id = #{follower_id} and following_id = #{followingId}")
    int findFollow(int follower_id, Integer followingId);
    /**
     * 文章点赞，修改文章的点赞数量
     * @Param("article_id") int article_id
     * @Param("user_id") int user_id
     */
    void likes(int article_id, int likesCount);

    /**
     * 添加对文章点赞的信息
     * @param userId
     * @param articleId
     * @param createTime
     */
    void likesArticle(long userId, int articleId , LocalDateTime createTime);

    int updateAvatar(String username, String filePath);

    /**
     * 根据用户名获取粉丝
     * @param username
     * @return
     */
    List<String> getFollowersByUsername(String username);

    List<ArticleVO> getMyArticles(int authorId);

    /**
     * 查询点赞情况
     * @param articleId
     * @param userId
     * @return
     */
    @Select("select id from likes_article where article_id = #{articleId} and user_id = #{userId} ")
    Integer inquireLikeStatus(Long userId,int articleId);

    /**
     * 取消点赞
     * @param userId
     * @param articleId
     */
    void deleteLikesArticle(Long userId, Integer articleId);

    @Select("select count(*) from user_collect_articles where article_id = #{articleId} and user_id = #{userId}")
    int isCollect(int userId, int articleId);

    @Insert("insert into user_collect_articles(user_id,article_id) values(#{userId},#{articleId})")
    int collectArticle(int userId, int articleId);

    @Delete("delete from user_collect_articles where user_id = #{userId} and article_id = #{articleId}")
    int cancelCollect(int userId, int articleId);

    void reduceFavoriteCount(int articleId);

    @Update("update article set favoriteCount = favoriteCount + 1 where id = #{articleId}")
    void addFavoriteCount(int articleId);
}
