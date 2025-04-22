package com.zr.uniSoul.pojo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
//用户间传送的消息
public class ResultMessage {
    private boolean isSystem;
    private String fromName;
    //private String toName;
    private Object message;
}