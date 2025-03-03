package com.zr.uniSoul.pojo.dto;

import lombok.Data;

@Data
public class AddCommentsDTO {

    private Integer article_id;//文章id

    private String content;//评论内容

    private Integer psychology_parent_id;//父评论id


}
