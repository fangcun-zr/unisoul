package com.zr.uniSoul.pojo.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Data;

import java.io.Serializable;


// 嵌套的问题DTO
@Data
public  class QuestionDTO implements Serializable {

    private String questionId;
    private String topic;
    private String options;

    @JsonProperty("sortOrder")
    private Integer sortOrder;

    @JsonProperty("questionType")
    private QuestionTypeEnum questionType;

    // 修改后的枚举定义
    public enum QuestionTypeEnum {
        SINGLE_CHOICE("single_choice"),
        MULTIPLE_CHOICE("multiple_choice"),
        SCALE("scale");

        private final String jsonValue;

        QuestionTypeEnum(String jsonValue) {
            this.jsonValue = jsonValue;
        }

        // 添加反序列化注解
        @JsonCreator
        public static QuestionTypeEnum fromJsonValue(String jsonValue) {
            for (QuestionTypeEnum type : values()) {
                if (type.jsonValue.equalsIgnoreCase(jsonValue)) {
                    return type;
                }
            }
            throw new IllegalArgumentException("未知的问题类型: " + jsonValue);
        }

        // 添加序列化注解
        @JsonValue
        public String getJsonValue() {
            return this.jsonValue;
        }
    }
}
