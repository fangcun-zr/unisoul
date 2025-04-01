package com.zr.uniSoul.service;

import com.zr.uniSoul.pojo.dto.AssessmentDTO;
import com.zr.uniSoul.pojo.dto.WordDTO;
import com.zr.uniSoul.pojo.vo.AssessmentVO;
import com.zr.uniSoul.pojo.vo.UserVO;
import com.zr.uniSoul.pojo.vo.WordVO;

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

    /**
     * 添加测评
     * @param assessmentDTO
     * @return
     */
    int addAssessment(AssessmentDTO assessmentDTO);

    /**
     * 修改测评
     * @param assessmentDTO
     * @return
     */
    int saveAssessment(AssessmentDTO assessmentDTO);

    int deleteQuestion(int id);

    AssessmentVO changeAssessment(int id);

    int deleteAssessment(int id);

    List<WordVO> getAllWords();

    int addWords(List<String> words);

    int deleteWords(List<Integer> ids);

    int setWordsStatus(WordDTO wordDTO);
}
