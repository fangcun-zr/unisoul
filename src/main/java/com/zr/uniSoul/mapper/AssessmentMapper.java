package com.zr.uniSoul.mapper;

import com.zr.uniSoul.pojo.dto.ReportDTO;
import com.zr.uniSoul.pojo.vo.AssessmentVO;
import com.zr.uniSoul.pojo.vo.QuestionsVo;
import com.zr.uniSoul.pojo.vo.ReportVO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface AssessmentMapper {

    AssessmentVO getAssessments(int categoryId);


    @Insert("INSERT INTO assessment_session (user_id, assessment_id, start_time,sessionUuid) VALUES (#{userId}, #{assessmentId}, #{startTime},#{sessionUuid})")
    int startAssessment(int userId, int assessmentId, LocalDateTime startTime,  String sessionUuid);

    List<QuestionsVo> getQuestions(Integer id);

    int save(ReportDTO reportDTO);

    List<ReportVO> getMyReport(int userId);
}


