package com.zr.uniSoul.service;

import com.zr.uniSoul.pojo.dto.UserDTO;
import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.pojo.vo.ArticleLikesVO;
import com.zr.uniSoul.pojo.vo.ArticleVO;
import com.zr.uniSoul.pojo.vo.UserVO;

import java.util.List;

public interface XtqhService {
    User login(User user);

    Boolean sendCheckCode(String email, String code);

    int register(User user);

    User findByUsername(String username);

    int editUserInfo(User user);


    int follow(int user_Id, String role_name);
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

    int collectArticle(int userId, int articleId);

    int isCollect(int userId, int articleId);

    /**
     * 取消点赞
     * @param userId
     * @param articleId
     * @return
     */
    int cancelCollect(int userId, int articleId);

    /**
     * 获取粉丝列表
     * @param userId
     * @return
     */
    List<UserVO> getFollowersList(Integer userId);

    /**
     * 获取关注列表
     * @param userId
     * @return
     */
    List<UserVO> getFollowList(Integer userId);

    /**
     * 获取收藏列表
     * @param id
     * @return
     */
    List<ArticleVO> getMyArticleCollect(int id);

    /**
     * 获取我的个人信息
     * @param i
     * @return
     */
    UserVO getinformation(int i);

    /**
     * 找回密码接口
     * @param user
     * @return
     */
    String findPassword(UserDTO user);

    /**
     * 修改密码
     * @param username
     * @param password
     * @return
     */
    int changePassWord(String username, String password);

    /**
     * 反馈接口
     *
     * @param userId
     * @param text
     * @return
     */
    int feedback(int userId, String text);
}
