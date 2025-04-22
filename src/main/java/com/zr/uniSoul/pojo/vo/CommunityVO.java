package com.zr.uniSoul.pojo.vo;

import lombok.Data;

@Data
public class CommunityVO {

    private Integer id; // 主键id
    private String name; // 社区名称
    private String describe; // 对于该圈子的描述
    private Integer categoryId; // 分类id

}
