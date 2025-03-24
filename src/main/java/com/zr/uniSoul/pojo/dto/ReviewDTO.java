package com.zr.uniSoul.pojo.dto;

import lombok.Data;

/**审核文章的dto
 * @Description:
 * @Author: zr
 */
@Data
public class ReviewDTO {

    private Integer article_id;
    private Integer status;//目前的状态
    private String review_message;

}
