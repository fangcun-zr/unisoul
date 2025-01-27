package com.zr.uniSoul.pojo.dto;

import lombok.Data;

@Data
public class PageQueryDTO {

    //页码
    private int page;

    //每页记录数
    private int pageSize;

    //文章分类
    private Integer category_id;

}
