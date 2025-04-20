package com.zr.uniSoul.pojo.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Topic implements Serializable {
    private long id;
    private String title;
    private String content;
    private boolean anonymous;
    private long likes;
    private boolean isLike;
    private long views;
    private String avatarUrl;
    private String username;
    private String nickName;
    private List<String> tags;
    private List<Replies> replies;
    private long repliesNum;
    private String createTime;
}
