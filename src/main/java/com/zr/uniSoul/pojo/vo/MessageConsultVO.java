package com.zr.uniSoul.pojo.vo;

import com.zr.uniSoul.pojo.entity.ConsultMessage;
import lombok.Data;

import java.util.List;
@Data
public class MessageConsultVO {
    private String senderId;
    private String receiverId;
    private List<ConsultMessage> messageList;
}
