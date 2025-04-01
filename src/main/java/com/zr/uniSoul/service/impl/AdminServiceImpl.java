package com.zr.uniSoul.service.impl;


import com.zr.uniSoul.mapper.AdminMapper;
import com.zr.uniSoul.pojo.dto.AssessmentDTO;
import com.zr.uniSoul.pojo.dto.QuestionDTO;
import com.zr.uniSoul.pojo.dto.WordDTO;
import com.zr.uniSoul.pojo.vo.*;
import com.zr.uniSoul.service.AdminService;
import com.zr.uniSoul.utils.AnalysisUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


/**
 * 后台管理service实现
 */
@Service
@Slf4j
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminMapper adminMapper;

    /**
     * 判断登录者是不是管理员
     * @param userId
     * @return
     */
    @Override

    public Boolean judgeAdmin(int userId) {
        int isAdmin = adminMapper.getIsAdmin(userId);
        log.info("userId: {}, isAdmin: {}", userId, isAdmin);
        return isAdmin==1;
    }

    /**
     * 获取所有用户列表
     * @return
     */
    @Override
    public List<UserVO> getUsersList() {

        return adminMapper.getAllUsersList();
    }

    /**
     * 封禁/解除封禁用户
     *
     * @param userId
     * @param status
     * @return
     */
    @Override
    public int bannedUser(int userId, int status) {
        if(status==1){
            status=0;
        }
        else {
            status=1;
        }

        return adminMapper.bannedUser(userId,status);
    }

    /**
     * 删除用户
     * @param id
     * @return
     */
    @Override
    public int deleteUser(int id) {
        return adminMapper.deleteUser(id);
    }

    /**
     * 对文章的封禁状态进行设置
     * @param articleId
     * @param status
     * @return
     */
    @Override
    public int setArticle(int articleId, int status) {
        if(status==1){
            status=0;
        }
        else {
            status=1;
        }
        return adminMapper.setArticle(articleId,status);
    }

    /**
     * 删除评论
     * @param id
     * @return
     */
    @Override
    public int deleteArticleComment(int id) {
        return adminMapper.deleteArticleComment(id);
    }

    @Override
    public int addAssessment(AssessmentDTO assessmentDTO) {
        int ret1 = adminMapper.addAssessment(assessmentDTO);
        int assessmentId = adminMapper.getAssessmentId(assessmentDTO.getName());
        if (ret1>0){
            List<QuestionDTO> questionDTOList = assessmentDTO.getQuestions();
            log.info(questionDTOList.toString());
            QuestionDTO[] questionArray = questionDTOList.toArray(new QuestionDTO[0]);
            log.info(Arrays.toString(questionArray));
            return adminMapper.addQuestions(questionArray ,assessmentId);
        }
        return 0;
    }

    /**
     * 保存测评
     * @param assessmentDTO
     * @return
     */
    @Override
    @Transactional
    public int saveAssessment(AssessmentDTO assessmentDTO) {
        //先修改测评表
        int ret1 = adminMapper.saveAssessment(assessmentDTO);
        if(ret1==0){
            return 0;
        }
        List<QuestionDTO> questionDTOList = assessmentDTO.getQuestions();
        List<QuestionDTO> toUpdate = questionDTOList.stream()
                .filter(q -> q.getQuestionId() != null)
                .collect(Collectors.toList());

        List<QuestionDTO> toInsert = questionDTOList.stream()
                .filter(q -> q.getQuestionId() == null)
                .collect(Collectors.toList());

        int ret2 = 0;
        int ret3 = 0;
        if (!toUpdate.isEmpty()) {
            adminMapper.updateQuestions(toUpdate.toArray(new QuestionDTO[0]), assessmentDTO.getId());
        }
        if (!toInsert.isEmpty()) {
            adminMapper.insertQuestions(toInsert.toArray(new QuestionDTO[0]), assessmentDTO.getId());
        }
        //再修改问题表
        return ret1+ret2+ret3;
    }

    /**
     * 删除问题
     * @param id
     * @return
     */
    @Override
    public int deleteQuestion(int id) {
        return adminMapper.deleteQuestion(id);

    }

    @Override
    public AssessmentVO changeAssessment(int id) {
        //先封装assessment
        AssessmentVO assessmentVO = adminMapper.getAssessment(id);
        //封装问题
        QuestionsVo[] questionVOList = adminMapper.getQuestions(id);
        assessmentVO.setQuestionsVo(questionVOList);
        return assessmentVO;
    }

    /**
     * 删除测评
     * @param id
     * @return
     */
    @Override
    public int deleteAssessment(int id) {
        //        -- 先删除与 assessment 关联的 assessment_session 记录
        //        DELETE FROM assessment_session WHERE assessment_id = #{id};
        adminMapper.deleteAssessmentSession(id);

        //删除问题
        adminMapper.deleteQuestions(id);
        return adminMapper.deleteAssessment(id);
    }

    @Override
    public List<WordVO> getAllWords() {
        return adminMapper.getAllWords();
    }

    /**
     * 添加敏感词
     * @param words
     * @return
     */
    @Override
    public int addWords(List<String> words) {
        log.info("addWords:{}", words);
        int count = 0;
        for (String word : words) {
            if (word != null || !word.trim().isEmpty()) {
                adminMapper.addWords(word);
                count++;
            }
        }

        return  count;
    }

    /**
     * 删除敏感词
     * @param ids
     * @return
     */
    @Override
    public int deleteWords(List<Integer> ids) {
        int count = 0;

        for (Integer id : ids) {
            adminMapper.deleteWords(id);
            count++;
        }
        return count;
    }

    @Override
    public int setWordsStatus(WordDTO wordDTO) {

        //先设置状态
        if(wordDTO.getStatus()==1){
            wordDTO.setStatus(0);
        }
        else{
            wordDTO.setStatus(1);
        }
        int ret = adminMapper.setWordsStatus(wordDTO);
        if(ret!=0){
            return wordDTO.getStatus();
        }
        return 0;

    }

    /**
     * 用户分析接口方法
     *
     * <p>该方法用于执行用户分析操作，并返回一个包含用户分析信息的列表。</p>
     *
     * @return 返回包含用户分析信息的列表，如果分析失败或没有数据则返回null。
     * @throws Exception 如果在执行分析过程中发生异常，将抛出此异常。
     */
    @Override
    public String userAnalysis() {

        //获取信息
        List<String> tagsList = adminMapper.getUserTags();

        return  AnalysisUtil.calculateAverages(tagsList);
    }

    /**
     * 获取评估提交次数的统计信息
     *
     * @return 评估提交次数的统计信息列表，每个元素为 {@link AssessmentSubmitCountVO} 对象。
     *         目前此方法返回值为 null，表示尚未实现功能。
     */
    @Override
    public List<AssessmentSubmitCountVO> assessmentSubmitCount() {
        return adminMapper.assessmentSubmitCount();
    }

    //TODO 后台管理
}
