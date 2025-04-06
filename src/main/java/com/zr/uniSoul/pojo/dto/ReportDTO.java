package com.zr.uniSoul.pojo.dto;

import com.zr.uniSoul.pojo.entity.ReportContent;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class ReportDTO {

    private int assessmentId;
    private int userId;
    private String sessionUuid;
    private LocalDateTime generatedTime;
    private ReportContent content;    // 报告内容结构体
}
