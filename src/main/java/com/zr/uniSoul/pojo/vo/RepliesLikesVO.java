package com.zr.uniSoul.pojo.vo;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
public class RepliesLikesVO {
    private long repliesId;
    private long likeCount;
    private boolean isLike;
    private String username;
}
