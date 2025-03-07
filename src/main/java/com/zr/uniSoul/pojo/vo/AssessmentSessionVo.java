package com.zr.uniSoul.pojo.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AssessmentSessionVo {
    private Integer session_id;
    private Integer userId;
    private Integer assessmentId;
    private LocalDateTime startTime;
    // getters and setters
}
