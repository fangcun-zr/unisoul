package com.zr.uniSoul.pojo.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class MessageConsultDTO implements Serializable {
    private int id;
    private String senderId;
    private String receiverId;
    private String content;
    private boolean isRead;
}
