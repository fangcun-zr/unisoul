package com.zr.uniSoul.mapper;

import com.zr.uniSoul.pojo.vo.AssessmentSessionVo;
import com.zr.uniSoul.pojo.vo.AssessmentVO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;

@Mapper
public interface AssessmentMapper {

    AssessmentVO getAssessments(int categoryId);


    @Insert("INSERT INTO assessment_session (user_id, assessment_id, start_time,sessionUuid) VALUES (#{userId}, #{assessmentId}, #{startTime},#{sessionUuid})")
    int startAssessment(int userId, int assessmentId, LocalDateTime startTime,  String sessionUuid);
}


