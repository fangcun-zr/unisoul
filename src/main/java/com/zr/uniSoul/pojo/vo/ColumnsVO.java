package com.zr.uniSoul.pojo.vo;


import lombok.Data;

@Data
public class ColumnsVO {

    private int id;
    private int userId;// 专栏作者的id
    private String title;
    private int categoryId;
    private String coverUrl;
    private int articleCount;
    private int subscribers;//订阅的人数
    private double rating;//评分
    private String createdAt;
    private String updatedAt;
    private String description;//专栏描述
}
