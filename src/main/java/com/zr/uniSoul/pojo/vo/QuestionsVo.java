package com.zr.uniSoul.pojo.vo;

import lombok.Data;

@Data
public class QuestionsVo {
    //题干
    private String topic ;

    //选项
    private String options ;

    //题号
    private Integer sortOrder ;

    //类型
    private String questionType ;


}
