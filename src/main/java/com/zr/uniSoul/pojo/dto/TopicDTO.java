package com.zr.uniSoul.pojo.dto;

import com.zr.uniSoul.pojo.entity.Tags;
import lombok.Data;

import java.util.List;

@Data
public class TopicDTO {
    private long id;
    private String title;
    private String content;
    private boolean anonymous;
    private long likes;
    private long views;
    private String username;
    private List<String> tags;
}
