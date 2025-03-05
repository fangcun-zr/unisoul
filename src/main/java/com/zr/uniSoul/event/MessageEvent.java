package com.zr.uniSoul.event;

import com.zr.uniSoul.pojo.dto.MessageConsultDTO;
import org.springframework.context.ApplicationEvent;

public class MessageEvent extends ApplicationEvent {
    private MessageConsultDTO message;

    public MessageEvent(Object source, MessageConsultDTO message) {
        super(source);
        this.message = message;
    }

    public MessageConsultDTO getMessage() {
        return message;
    }
}
