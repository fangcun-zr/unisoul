package com.zr.uniSoul.pojo.vo;

import lombok.Data;

import java.util.List;
@Data
public class FollowersVO {
    private Integer followersCount;
    private List<String> followers;
}
