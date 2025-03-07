package com.zr.uniSoul.pojo.vo;

import com.zr.uniSoul.pojo.entity.ReportContent;
import lombok.Data;

import java.time.LocalDateTime;

@Data

public class ReportVO {
    private String sessionUuid;
    private String assessmentSessionId;
    private Integer status;          // 200=成功，500=失败
    private LocalDateTime createdAt;
    private ReportContent content;    // 报告内容结构体
    private String errorMessage;      // 失败时的错误信息
}

