package com.zr.uniSoul.pojo.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 文章评论对应的Javabean
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comments {
    //评论id
    private Integer id;

    //文章id
    private Integer article_id;

    //用户id
    private Integer user_id;

    //评论内容
    private String content;

    //发布时间
    private String create_time;

}
