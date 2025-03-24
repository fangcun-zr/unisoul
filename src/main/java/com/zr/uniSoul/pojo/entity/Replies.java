package com.zr.uniSoul.pojo.entity;

import lombok.Data;

@Data
public class Replies {
    private long id;
    private long topicId;
    private String username;
    private String content;
    private boolean anonymous;
    private boolean isLike;
    private long likeCount;
    private String createTime;
    private String avatarUrl;
}
