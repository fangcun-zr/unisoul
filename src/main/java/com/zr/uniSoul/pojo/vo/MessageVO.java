package com.zr.uniSoul.pojo.vo;

import lombok.Data;

@Data
public class MessageVO {
    private long id;
    private String senderName;
    private String receiverName;
    private String content;
    private String createdTime;
    private String messageType;
    private String status;
}
