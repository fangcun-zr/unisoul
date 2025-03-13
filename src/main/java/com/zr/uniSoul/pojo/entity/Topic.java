package com.zr.uniSoul.pojo.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.Serializable;
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
    private long views;
    private String username;
    private List<String> tags;
    private List<Replies> replies;
}
