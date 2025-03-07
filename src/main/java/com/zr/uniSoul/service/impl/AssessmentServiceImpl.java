package com.zr.uniSoul.service.impl;

import com.zr.uniSoul.mapper.AssessmentMapper;
import com.zr.uniSoul.pojo.vo.AssessmentSessionVo;
import com.zr.uniSoul.pojo.vo.AssessmentVO;
import com.zr.uniSoul.service.AssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * 测评服务实现类
 * @Author: zr
 * @Date: 2020/12/30  14:16
 */
@Service
public class AssessmentServiceImpl implements AssessmentService {

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
}
