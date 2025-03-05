package com.zr.uniSoul.listener;

import com.zr.uniSoul.event.MessageEvent;
import com.zr.uniSoul.webSocket.MessageWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;

@Component
public class MessageEventListener implements ApplicationListener<MessageEvent> {

    @Autowired
    private MessageWebSocketHandler messageWebSocketHandler;

    @Override
    public void onApplicationEvent(MessageEvent event) {
        messageWebSocketHandler.sendMessageToUser(event.getMessage().getReceiverId(), new TextMessage(event.getMessage().getContent()));
    }
}
