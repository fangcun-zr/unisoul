package com.zr.uniSoul.service;

import com.zr.uniSoul.pojo.dto.AssessmentDTO;
import com.zr.uniSoul.pojo.dto.WordDTO;
import com.zr.uniSoul.pojo.entity.Topic;
import com.zr.uniSoul.pojo.vo.AssessmentSubmitCountVO;
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

    String userAnalysis();

    List<AssessmentSubmitCountVO> assessmentSubmitCount();


    List<WordVO> getAllWords();

    int addWords(List<String> words);

    int deleteWords(List<Integer> ids);

    int setWordsStatus(WordDTO wordDTO);

    /**
     * 设置话题状态
     * @param topicId
     * @param status
     * @return
     */
    int setTopic(int topicId, int status);

    /**
     * 获取区间内的热门话题
     * @param startTime
     * @param endTime
     * @return
     */
    List<Topic> getHotTopics(String startTime, String endTime);
}
