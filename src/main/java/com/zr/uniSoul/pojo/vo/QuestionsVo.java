package com.zr.uniSoul.pojo.vo;

import lombok.Data;

@Data
public class QuestionsVo {

    //id
    private Integer questionId ;
    //题干
    private String topic ;

    //选项
    private String options ;

    //题号
    private Integer sortOrder ;

    //类型
    private String questionType ;

    /**
     * question_id,topic,question_type,options,sort_order
     */


}
