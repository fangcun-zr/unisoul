package com.zr.uniSoul.service;

import com.zr.uniSoul.common.PageResult;
import com.zr.uniSoul.pojo.dto.CommentsPageDTO;
import com.zr.uniSoul.pojo.dto.PageQueryDTO;
import com.zr.uniSoul.pojo.dto.addCommentsDTO;
import com.zr.uniSoul.pojo.entity.Article;
import com.zr.uniSoul.pojo.entity.UserDTO;

public interface zhxtService {
    int findIdByUsername(String username);

    Integer publish(Article article);

    PageResult pageQuery(PageQueryDTO pageQueryDTO);

    PageResult getComments(CommentsPageDTO articleId);

    int addComments(addCommentsDTO addcommentsDTO, int userId);

    int likeComments(String articleCommentId, int userId);

    int checkArticle(Article article);

    Article getArticleDetail(String id);

    UserDTO getUserByArticleId(String articleId);

    int checkFollowStatus(int follow_id, int following_id);
}
