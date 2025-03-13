package com.zr.uniSoul.pojo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PageQueryDTO {
    //页码
    @JsonProperty("page")
    private Integer page;

    //每页记录数
    @JsonProperty("pageSize")
    private Integer pageSize;

    //文章分类
    @JsonProperty("category_id")
    private Integer category_id;

    //关键词
    @JsonProperty("keyWords")
    private String keyWords;

}
