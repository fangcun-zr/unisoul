package com.zr.uniSoul.pojo.vo;

import lombok.Data;

@Data
public class RepliesVO {
    private long id;
    private long topicId;
    private String username;
    private String content;
    private boolean anonymous;
}
