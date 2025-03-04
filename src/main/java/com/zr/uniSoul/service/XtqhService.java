package com.zr.uniSoul.service;

import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.pojo.vo.ArticleLikesVO;
import com.zr.uniSoul.pojo.vo.ArticleVO;

import java.util.List;

public interface XtqhService {
    User login(User user);

    Boolean sendCheckCode(String email, String code);

    int register(User user);

    User findByUsername(String username);

    int editUserInfo(User user);


    int follow(int myUsername, String role_name);
    /**
     * 点赞情况
     * @param articleLikes
     * @return
     */
    ArticleLikesVO likes(ArticleLikesVO articleLikes);

    int editUserAvatar(String username, String filePath);

    /**
     * 获取粉丝昵称
     * @param username
     * @return
     */
    List<String> getFollowersByUsername(String username);
    List<ArticleVO> getMyArticles(int userId);
    boolean inquireLikeStatus(Long userId, int articleId);
}
