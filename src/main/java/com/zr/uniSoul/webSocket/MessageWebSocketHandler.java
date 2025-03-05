package com.zr.uniSoul.webSocket;

import com.zr.uniSoul.service.MessageConsultService;
import com.zr.uniSoul.service.impl.MessageConsultServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.concurrent.ConcurrentHashMap;

public class MessageWebSocketHandler extends TextWebSocketHandler {
    private static ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    @Autowired
    private MessageConsultServiceImpl messageConsultServiceImpl;
    /**
     * 建立连接后发送未读取的消息
     * 在每次连接建立后被调用（用户登录的时候）
     * @param session
     * @throws Exception
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String userId = (String) session.getAttributes().get("userId");
        sessions.put(userId, session);
        messageConsultServiceImpl.checkAndSendUnreadMessages(userId);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // 处理传入的数据
    }

    /**
     * 判断对方是否在线，
     * 在线就将消息直接发送并存入数据库
     * 若不在线将消息存入数据库在发送
     * @param userId
     * @param message
     * @return
     */
    public boolean sendMessageToUser(String userId, TextMessage message) {
        WebSocketSession session = sessions.get(userId);
        if (session != null && session.isOpen()) {
            try {
                session.sendMessage(message);
                return true;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return false;
    }
}
