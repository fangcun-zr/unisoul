package com.zr.uniSoul.pojo.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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
    private Integer articleId;

    //用户id
    private Integer userId;

    //评论内容
    private String content;

    //发布时间
    private LocalDateTime createTime;

    //更新时间
    private LocalDateTime updateTime;

}
