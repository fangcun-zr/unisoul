package com.zr.uniSoul.pojo.entity;

import lombok.Data;

import java.io.Serializable;

@Data
public class Replies implements Serializable {
    private long id;
    private long topicId;
    private String username;
    private String nickName;
    private String content;
    private boolean anonymous;
    private boolean isLike;
    private long likeCount;
    private String createTime;
    private String avatarUrl;
    private int status;
}
