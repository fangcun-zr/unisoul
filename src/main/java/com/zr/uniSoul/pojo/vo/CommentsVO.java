package com.zr.uniSoul.pojo.vo;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 评论的返回类
 */

@Data
@Builder
public class CommentsVO {
    private int id;
    private int articleId;
    private int userId;
    private String content;
    LocalDateTime createTime;
    private String name;
    private String avatarUrl;
}
