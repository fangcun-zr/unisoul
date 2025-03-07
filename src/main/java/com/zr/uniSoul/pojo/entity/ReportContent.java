package com.zr.uniSoul.pojo.entity;

import lombok.Data;

@Data
public class ReportContent {

    private String conclusion;    // 分析结论
    private String suggestions;   // 专业建议
    private String rawContent;    // 原始响应内容
}
