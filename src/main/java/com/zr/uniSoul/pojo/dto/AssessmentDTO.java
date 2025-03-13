package com.zr.uniSoul.pojo.dto;


import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

import java.util.List;

/**
 * 测试的 dto
 */
@Data
public class AssessmentDTO {
    @JsonProperty("name")
    private String name;

    @JsonProperty("id")
    private String id;

    @JsonProperty("category_id")
    private Integer categoryId;

    private String introduction;

    @JsonProperty("question_count")
    private Integer questionCount;

    private List<QuestionDTO> questions;


}
