package com.zr.uniSoul.mapper;

import com.zr.uniSoul.pojo.dto.AssessmentDTO;
import com.zr.uniSoul.pojo.dto.QuestionDTO;
import com.zr.uniSoul.pojo.dto.WordDTO;
import com.zr.uniSoul.pojo.vo.AssessmentVO;
import com.zr.uniSoul.pojo.vo.QuestionsVo;
import com.zr.uniSoul.pojo.vo.UserVO;
import com.zr.uniSoul.pojo.vo.WordVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminMapper {

    int getIsAdmin(int userId);

    List<UserVO> getAllUsersList();

    int bannedUser(int userId, int status);

    int deleteUser(int id);

    int setArticle(int articleId, int status);

    int deleteArticleComment(int id);

    int addAssessment(AssessmentDTO assessmentDTO);

    int addQuestions(@Param("questions") QuestionDTO[] questions, @Param("assessmentId") int assessmentId);

    int getAssessmentId(String name);

    int saveAssessment(AssessmentDTO assessmentDTO);

    int updateQuestions(@Param("questions")QuestionDTO[] questions, String assessmentId);

    int insertQuestions(@Param("questions")QuestionDTO[] questions, String assessmentId);

    int deleteQuestion(int id);

    AssessmentVO getAssessment(int id);

    QuestionsVo[] getQuestions(int id);

    int deleteAssessment(int id);

    void deleteAssessmentSession(int id);

    void deleteQuestions(int id);

    List<WordVO> getAllWords();

    int addWords(String word);

    int deleteWords(Integer ids);

    int setWordsStatus(WordDTO wordDTO);
}
