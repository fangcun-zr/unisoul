package com.zr.uniSoul.pojo.vo;


import lombok.Data;

@Data
public class AssessmentVO {
    // 评估id
    private Integer id;
    // 评估分类id
    private Integer categoryId;
    // 评估分类名称
    private String name;
    // 评估分类简介
    private String introduction;
    // 评估分类封面
    private String CoverImgUrl;
    // 该评测的评测次数
    private Integer csCount;
    //该测评问题的数量
    private Integer questionsCount;

    private QuestionsVo[] questionsVo;
}
