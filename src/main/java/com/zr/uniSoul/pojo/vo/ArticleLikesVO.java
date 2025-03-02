package com.zr.uniSoul.pojo.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ArticleLikesVO {
    private Integer articleId;
    private Integer likesCount;
    private Long userId;
    private LocalDateTime createTime;//创建时间
    private Boolean isLike;//是否点赞,默认是没有点赞的
}
