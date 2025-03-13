package com.zr.uniSoul.pojo.vo;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class TopicLikesVO {
    private long topicId;
    private long likesCount;
    private String username;
    private boolean isLike;//是否点赞
}
