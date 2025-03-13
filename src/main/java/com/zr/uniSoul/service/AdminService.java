package com.zr.uniSoul.service;

import com.zr.uniSoul.pojo.vo.UserVO;

import java.util.List;

/**
 * 管理员相关操作的service接口
 */
public interface AdminService {
    Boolean judgeAdmin(int userId);

    List<UserVO> getUsersList();     //获取用户列表

    int bannedUser(int userId, int status);

    int deleteUser(int id);

    int setArticle(int articleId, int status);

    /**
     * 删除评论
     * @param id
     * @return
     */
    int deleteArticleComment(int id);
}
