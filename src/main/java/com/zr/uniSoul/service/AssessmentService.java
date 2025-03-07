package com.zr.uniSoul.service;

import com.zr.uniSoul.pojo.dto.AnswerDTO;
import com.zr.uniSoul.pojo.dto.ReportDTO;
import com.zr.uniSoul.pojo.vo.AssessmentVO;
import com.zr.uniSoul.pojo.vo.QuestionsVo;
import com.zr.uniSoul.pojo.vo.ReportVO;

import java.util.List;

/**
 * 测评服务接口
 */
public interface AssessmentService {
    AssessmentVO getAssessments(int categoryId);

    String startAssessment(int id, int userId);

    List<QuestionsVo> getQuestions(Integer id);

    ReportVO getReport(AnswerDTO answerDTO);

    int save(ReportDTO reportDTO, int userId);

    List<ReportVO> getMyReport(int userId);
}
