package com.zr.uniSoul.mapper;

import com.github.pagehelper.Page;
import com.zr.uniSoul.pojo.dto.CommentsPageDTO;
import com.zr.uniSoul.pojo.dto.PageQueryDTO;
import com.zr.uniSoul.pojo.entity.Article;
import com.zr.uniSoul.pojo.entity.CommentLike;
import com.zr.uniSoul.pojo.entity.Comments;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

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
}
