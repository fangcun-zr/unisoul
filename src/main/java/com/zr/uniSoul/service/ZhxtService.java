package com.zr.uniSoul.service;

import com.zr.uniSoul.common.PageResult;
import com.zr.uniSoul.pojo.dto.CommentsPageDTO;
import com.zr.uniSoul.pojo.dto.PageQueryDTO;
import com.zr.uniSoul.pojo.dto.AddCommentsDTO;
import com.zr.uniSoul.pojo.dto.ReviewDTO;
import com.zr.uniSoul.pojo.entity.Article;
import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.pojo.vo.MyDataVO;

import javax.servlet.http.HttpServletRequest;

public interface ZhxtService {
    int findIdByUsername(String username);

    Integer publish(Article article);

    PageResult pageQuery(PageQueryDTO pageQueryDTO, HttpServletRequest request);

    PageResult getComments(CommentsPageDTO articleId);

    int addComments(AddCommentsDTO addcommentsDTO, int userId);

    int likeComments(String articleCommentId, int userId);

    int checkArticle(ReviewDTO reviewDTO);

    Article getArticleDetail(String id);

    User getUserByArticleId(String articleId);

    int checkFollowStatus(int follow_id, int following_id);

    int deleteArticle(int articleId);

    MyDataVO getMyData(int userId);

    String generateSummary(int id,float ratio);

    /**
     * 对用户的浏览行为进行记录
     * @param id
     * @param userId
     */
    void recordUserAction(String id, int userId,int score);
}
