package com.zr.uniSoul.pojo.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class WordVO {

    private String word;

    private int id;

    //启用状态
    private int status;

    //创建时间
    private LocalDateTime createTime;

    //更新时间

    private LocalDateTime updateTime;




}

