package com.zr.uniSoul.pojo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PageQueryDTO {
    //发送消息的用户ID
    @JsonProperty("userId")
    private Integer userId;
    //接收消息的用户ID
    @JsonProperty("receiverId")
    private Integer receiverId;
    //话题ID
    @JsonProperty("topicId")
    private Integer topicId;
    //页码
    @JsonProperty("page")
    private Integer page;

    //每页记录数
    @JsonProperty("pageSize")
    private Integer pageSize;

    //分类id
    @JsonProperty("category_id")
    private Integer category_id;

    //关键词
    @JsonProperty("keyWords")
    private String keyWords;

    //是不是精选内容
    @JsonProperty("isFeatured")
    private Integer isFeatured;

}
