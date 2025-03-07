package com.zr.uniSoul.pojo.dto;

import com.zr.uniSoul.pojo.entity.Options;
import lombok.Data;

import java.util.List;

/**
 * 提交答案的接受类
 */
@Data
public class AnswerDTO {

    private String assessmentSessionId;
    private int id;
    private List<Options> answers;
}
