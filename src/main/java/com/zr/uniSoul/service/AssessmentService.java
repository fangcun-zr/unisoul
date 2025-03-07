package com.zr.uniSoul.service;

import com.zr.uniSoul.pojo.vo.AssessmentVO;

/**
 * 测评服务接口
 */
public interface AssessmentService {
    AssessmentVO getAssessments(int categoryId);

    String startAssessment(int id, int userId);
}
