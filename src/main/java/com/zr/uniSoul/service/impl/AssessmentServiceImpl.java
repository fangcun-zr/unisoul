package com.zr.uniSoul.service.impl;

import com.zr.uniSoul.mapper.AssessmentMapper;
import com.zr.uniSoul.pojo.dto.AnswerDTO;
import com.zr.uniSoul.pojo.dto.ReportDTO;
import com.zr.uniSoul.pojo.entity.ReportContent;
import com.zr.uniSoul.pojo.vo.AssessmentVO;
import com.zr.uniSoul.pojo.vo.QuestionsVo;
import com.zr.uniSoul.pojo.vo.ReportVO;
import com.zr.uniSoul.service.AssessmentService;
import com.zr.uniSoul.utils.DeepSeekUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 测评服务实现类
 * @Author: zr
 * @Date: 2020/12/30  14:16
 */
@Service
public class AssessmentServiceImpl implements AssessmentService {

    @Autowired
    private DeepSeekUtil deepSeekUtil;
    @Autowired
    private AssessmentMapper assessmentMapper;

    @Override
    public AssessmentVO getAssessments(int categoryId) {
        //根据id查询不同分类的测评
        return assessmentMapper.getAssessments(categoryId);
    }

    @Override
    public String startAssessment(int id, int userId) {
        //开始测评
        LocalDateTime start_time = LocalDateTime.now();;
        //生成uuid字符串
        String sessionUuid = java.util.UUID.randomUUID().toString();
        int ret = assessmentMapper.startAssessment(userId, id, start_time, sessionUuid);
            if(ret==0){
                return null;
            }
        return sessionUuid;




    }

    /**
     * 获取测试题目
     *
     * @param
     * @return
     */
    @Override
    public List<QuestionsVo> getQuestions(Integer id) {
        return assessmentMapper.getQuestions(id);
    }

    /**
     * 生成测试报告
     * @param answerDTO
     * @return
     */
    @Override
    public ReportVO getReport(AnswerDTO answerDTO) {
        ReportVO reportVO = new ReportVO();
        try {
            // 1. 调用AI生成报告内容
            String aiContent = deepSeekUtil.generateAssessmentReport(answerDTO);

            // 2. 构建返回对象
            reportVO.setAssessmentSessionId(answerDTO.getAssessmentSessionId());
            reportVO.setStatus(200);  // 成功状态码
            reportVO.setCreatedAt(LocalDateTime.now());

            // 3. 解析AI返回内容
            ReportContent content = parseAiContent(aiContent);
            reportVO.setContent(content);


        } catch (DeepSeekUtil.AssessmentException ex) {
            // 异常处理
            reportVO.setStatus(500);  // 失败状态码
            reportVO.setErrorMessage(getFriendlyError(ex));
        }
        return reportVO;
    }

    /**
     * 保存测试报告
     *
     * @param reportDTO
     * @param userId
     * @return
     */
    @Override
    public int save(ReportDTO reportDTO, int userId) {
        reportDTO.setUserId(userId);

        return assessmentMapper.save(reportDTO);
    }

    /**
     * 获取我的测试历史
     * @param userId
     * @return
     */
    @Override
    public List<ReportVO> getMyReport(int userId) {
        return assessmentMapper.getMyReport(userId);
    }

    // 解析AI返回内容
    private ReportContent parseAiContent(String aiContent) {
        ReportContent content = new ReportContent();
        try {
            // 示例解析逻辑（根据实际AI返回格式调整）
            String[] sections = aiContent.split("\n\n");
            content.setConclusion(sections[0].replace("分析结论：", "").trim());
            content.setSuggestions(sections[1].replace("专业建议：", "").trim());
            content.setRawContent(aiContent);  // 保留原始内容
        } catch (Exception e) {
            content.setRawContent(aiContent);
        }
        return content;
    }

    // 友好错误提示
    private String getFriendlyError(Exception ex) {
        if (ex.getMessage().contains("网络")) {
            return "服务暂时不可用，请稍后重试";
        }
        return "报告生成失败，请联系客服人员";
    }

}
