package com.zr.uniSoul.mapper;

import com.github.pagehelper.Page;
import com.zr.uniSoul.pojo.dto.CommentsPageDTO;
import com.zr.uniSoul.pojo.dto.PageQueryDTO;
import com.zr.uniSoul.pojo.dto.ReviewDTO;
import com.zr.uniSoul.pojo.entity.Article;
import com.zr.uniSoul.pojo.entity.CommentLike;
import com.zr.uniSoul.pojo.entity.Comments;
import com.zr.uniSoul.pojo.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface zhxtMapper {

    @Select("select id from user where username = #{username}")
    int findIdByUsername(String username);

    Integer insert(Article article);

    Page<Article> pageQuery(PageQueryDTO pageQueryDTO);

    Page<Comments> getComments(CommentsPageDTO commentsPageDTO);

    int addComments(Comments comments);
    int likeComments(CommentLike commentLike);

    Page<Article> pageQueryAll(PageQueryDTO pageQueryDTO);

    @Select("SELECT COUNT(*) FROM article")
    Long countQueryAll();

    Long countQuery(PageQueryDTO pageQueryDTO);

    Article getArticleDetailById(int articleId);

    int getUserIdByArticleId(String articleId);

    User getUserById(int userId);

    @Select("SELECT COUNT(*) FROM follow WHERE follower_id = #{followId} AND following_id = #{followingId}")
    int checkFollowStatus(int followId, int followingId);

    int deleteArticle(int articleId);
    Page<Article> pageQueryForKeyWords(PageQueryDTO pageQueryDTO);

    Long countQueryForKeyWords(PageQueryDTO pageQueryDTO);

    @Select("SELECT COUNT(*) FROM article WHERE author_id = #{userId}")
    Integer getArticleCount(int userId);

    @Select("SELECT COUNT(*) FROM follow WHERE following_id = #{userId}")
    Integer getFollowCount(int userId);

    @Select("SELECT COUNT(*) FROM follow WHERE follower_id = #{userId}")
    Integer getFollowerCount(int userId);

    String getContent(int id);

    int checkArticle(ReviewDTO reviewDTO);

    String getTagsByArticleId(int articleId);

    String getjsonInput(int userId);

    int updateUserTagScores(int userId, String tagScores);

    void addviewCount(int articleId);

    List<Article> getRecommendArticle(List<String> tagsList);
}
