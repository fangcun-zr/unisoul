package com.zr.uniSoul.pojo.vo;

import lombok.Data;

import java.io.Serializable;
import java.util.List;
@Data
public class TopicVO implements Serializable {
    private long id;
    private String title;
    private String content;
    private boolean anonymous;
    private long likes;
    private boolean isLike;
    private long views;
    private String username;
    private String nickName;
    private String avatarUrl;
    private long repliesCount;
    private List<String> tags;
    private String createTime;

}
