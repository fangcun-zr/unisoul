package com.zr.uniSoul.listener;

import com.zr.uniSoul.event.MessageEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHandler;

//@Component
//public class MessageEventListener implements ApplicationListener<MessageEvent> {
//
//    @Autowired
//    private WebSocketHandler webSocketHandler;
//
//    @Override
//    public void onApplicationEvent(MessageEvent event) {
//        webSocketHandler.sendMessageToUser(event.getMessage().getReceiverId(), new TextMessage(event.getMessage().getContent()));
//    }
//}
