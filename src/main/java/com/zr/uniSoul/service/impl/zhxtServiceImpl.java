package com.zr.uniSoul.service.impl;

import com.github.pagehelper.PageHelper;
import com.zr.uniSoul.common.PageResult;
import com.zr.uniSoul.pojo.dto.CommentsPageDTO;
import com.zr.uniSoul.pojo.dto.PageQueryDTO;
import com.zr.uniSoul.pojo.dto.addCommentsDTO;
import com.zr.uniSoul.pojo.entity.Article;
import com.zr.uniSoul.pojo.entity.CommentLike;
import com.zr.uniSoul.pojo.entity.Comments;
import com.zr.uniSoul.service.zhxtService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.zr.uniSoul.mapper.zhxtMapper;
import com.github.pagehelper.Page;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
@Slf4j
public class zhxtServiceImpl implements zhxtService {

    @Autowired
    private zhxtMapper zhxtMapper;
    @Override
    public int findIdByUsername(String username) {
        return zhxtMapper.findIdByUsername(username);
    }

    /**
     * 将文章信息存入数据库
     * @param article
     * @return
     */
    @Override
    public Integer publish(Article article) {
        article.setCreateTime();
        article.setUpdateTime();
        return zhxtMapper.insert(article);
    }

    /**
     * 文章分页展示
     * @param pageQueryDTO
     * @return
     */
    @Override
    public PageResult pageQuery(PageQueryDTO pageQueryDTO) {
        PageHelper.startPage(pageQueryDTO.getPage(),pageQueryDTO.getPageSize());
        //下一条sql进行分页，自动加入limit关键字分页
        Page<Article> page = zhxtMapper.pageQuery(pageQueryDTO);
        return new PageResult(page.getTotal(), page.getResult());
    }

    /**
     * 评论分页展示
     * @param commentsPageDTO
     * @return
     */
    public PageResult getComments(CommentsPageDTO commentsPageDTO) {
        PageHelper.startPage(commentsPageDTO.getPage(), commentsPageDTO.getPageSize());
        Page<Comments> page = zhxtMapper.getComments(commentsPageDTO);

        if (page == null) {
            // 返回一个空的PageResult或者抛出自定义异常
            return new PageResult(0, new ArrayList<>()); // 假设PageResult的构造函数接受total和result列表作为参数
            // 或者
            // throw new CustomException("No comments found");
        }

        return new PageResult(page.getTotal(), page.getResult());
    }

    /**
     * 添加评论
     *
     * @param addcommentsDTO
     * @param userId
     * @return
     */
    @Override
    public int addComments(addCommentsDTO addcommentsDTO, int userId) {

        Comments comments = Comments.builder()
                .articleId(addcommentsDTO.getArticle_id())
                .content(addcommentsDTO.getContent())
                .userId(userId)
                .createTime(LocalDateTime.now())
                .updateTime(LocalDateTime.now())
                .build();
        return zhxtMapper.addComments(comments);
    }

    @Override
    public int likeComments(String articleCommentId, int userId) {
        CommentLike commentLike = CommentLike.builder()
                        .userId(userId)
                        .articleCommentId(Integer.valueOf(articleCommentId))
                        .createTime(LocalDateTime.now())
                        .updateTime(LocalDateTime.now())
                        .build();

        return zhxtMapper.likeComments(commentLike);
    }

}
