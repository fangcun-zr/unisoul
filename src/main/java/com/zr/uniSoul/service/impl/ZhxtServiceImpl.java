package com.zr.uniSoul.service.impl;

import com.github.pagehelper.PageHelper;
import com.zr.uniSoul.common.PageResult;
import com.zr.uniSoul.pojo.dto.CommentsPageDTO;
import com.zr.uniSoul.pojo.dto.PageQueryDTO;
import com.zr.uniSoul.pojo.dto.AddCommentsDTO;
import com.zr.uniSoul.pojo.dto.ReviewDTO;
import com.zr.uniSoul.pojo.entity.Article;
import com.zr.uniSoul.pojo.entity.CommentLike;
import com.zr.uniSoul.pojo.entity.Comments;
import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.pojo.vo.CommentsVO;
import com.zr.uniSoul.pojo.vo.MyDataVO;
import com.zr.uniSoul.service.ZhxtService;
import com.zr.uniSoul.utils.TextSummarizerUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.zr.uniSoul.mapper.zhxtMapper;
import com.github.pagehelper.Page;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class ZhxtServiceImpl implements ZhxtService {

    @Autowired
    private zhxtMapper zhxtMapper;
    @Autowired
    private TextSummarizerUtil textSummarizerUtil;
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
        article.setUpdate_time();
        return zhxtMapper.insert(article);
    }

    /**
     * 文章分页展示
     * @param pageQueryDTO
     * @return
     */
    @Override
    public PageResult pageQuery(PageQueryDTO pageQueryDTO) {
        // 启动分页
        PageHelper.startPage(pageQueryDTO.getPage(), pageQueryDTO.getPageSize());

        // 根据条件选择不同的查询方法
        if (pageQueryDTO.getCategory_id() == null) {
            if(pageQueryDTO.getKeyWords() == null) {
                // 查询所有数据
                Page<Article> page = zhxtMapper.pageQueryAll(pageQueryDTO);

                // 手动获取总记录数
                Long total = zhxtMapper.countQueryAll();

                // 返回封装结果
                return new PageResult(total, page.getResult());
            }
            // 查询带条件的数据
            Page<Article> page = zhxtMapper.pageQueryForKeyWords(pageQueryDTO);
            // 手动获取总记录数
            Long total = zhxtMapper.countQueryForKeyWords(pageQueryDTO);
            // 返回封装结果
            return new PageResult(total, page.getResult());

        } else {
            if(pageQueryDTO.getKeyWords() == null) {
                // 查询带所有的的数据
                Page<Article> page = zhxtMapper.pageQuery(pageQueryDTO);

                // 手动获取总记录数
                Long total = zhxtMapper.countQuery(pageQueryDTO);

                // 返回封装结果
                return new PageResult(total, page.getResult());
            }
            // 查询带条件的数据
            Page<Article> page = zhxtMapper.pageQueryForKeyWords(pageQueryDTO);
            // 手动获取总记录数
            Long total = zhxtMapper.countQueryForKeyWords(pageQueryDTO);
            // 返回封装结果
            return new PageResult(total, page.getResult());

        }
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

        //手动封装返回的数据，包含评论者信息
        List<Comments> comments = page.getResult();
        List<User> users = new ArrayList<>();
        for (Comments comment : comments) {
            users.add(zhxtMapper.getUserById(comment.getUserId()));
        }
        List<CommentsVO> result = new ArrayList<>();
        for (Comments comment : comments) {
            result.add(CommentsVO.builder()
                    .id(comment.getId())
                    .content(comment.getContent())
                    .createTime(comment.getCreateTime())
                    .userId(comment.getUserId())
                    .avatarUrl(users.get(comments.indexOf(comment)).getAvatarUrl())
                    .name(users.get(comments.indexOf(comment)).getName())
                    .build());

        }




        return new PageResult(page.getTotal(), result);
    }

    /**
     * 添加评论
     *
     * @param addcommentsDTO
     * @param userId
     * @return
     */
    @Override
    public int addComments(AddCommentsDTO addcommentsDTO, int userId) {

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

    @Override
    public int checkArticle(ReviewDTO reviewDTO) {
        return zhxtMapper.checkArticle(reviewDTO);
    }

    @Override
    public Article getArticleDetail(String id) {
        int articleId = Integer.parseInt(id);
        return zhxtMapper.getArticleDetailById(articleId);
    }

    @Override
    public User getUserByArticleId(String articleId) {
        int userId = zhxtMapper.getUserIdByArticleId(articleId);
        return zhxtMapper.getUserById(userId);
    }

    @Override
    public int checkFollowStatus(int follow_id, int following_id) {
        log.info("被关注者followerId:{},关注者following_id{}",follow_id,following_id);
        return zhxtMapper.checkFollowStatus(follow_id, following_id);
    }

    @Override
    public int deleteArticle(int articleId) {
        return zhxtMapper.deleteArticle(articleId);
    }

    @Override
    public MyDataVO getMyData(int userId) {
        MyDataVO myDataVO = new MyDataVO();
        myDataVO.setArticlesCount(zhxtMapper.getArticleCount(userId));
        myDataVO.setFollowsCount(zhxtMapper.getFollowCount(userId));
        myDataVO.setFansCount(zhxtMapper.getFollowerCount(userId));
        return myDataVO;

    }

    /**
     * 返回概括后的文本
     * @param id
     * @param ratio
     * @return
     */
    @Override
    public String generateSummary(int id,float ratio) {
        String content = zhxtMapper.getContent(id);
        return textSummarizerUtil.summarize(content, ratio);
    }


}
