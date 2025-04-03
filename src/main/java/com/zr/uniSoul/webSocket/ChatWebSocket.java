package com.zr.uniSoul.webSocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zr.uniSoul.pojo.entity.ChatMessage;
import com.zr.uniSoul.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;

import javax.servlet.http.HttpServletRequest;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Map;

@Controller
public class ChatWebSocket {

    private static final Logger log = LoggerFactory.getLogger(ChatWebSocket.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.sendMessage")
    public void handleMessage(@Payload ChatMessage message, StompHeaderAccessor headerAccessor) {
        try {
            String sessionId = headerAccessor.getSessionId();
            log.info("收到新消息: sessionId={}, senderId={}, receiverId={}",
                    sessionId, message.getSenderId(), message.getReceiverId());

            // 验证消息
            if (message.getSenderId() == null || message.getReceiverId() == null || message.getContent() == null) {
                log.error("消息格式错误: {}", message);
                return;
            }

            // 处理消息（保存到数据库等）
            LocalDateTime dateTime = LocalDateTime.now();
            System.out.println(dateTime);
            message.setCreateTime(dateTime);
            chatService.handleMessage(message);

            // 发送消息给接收者
            messagingTemplate.convertAndSendToUser(
                    message.getReceiverId(),
                    "/topic/messages",
                    message
            );

            log.info("消息处理完成: sessionId={}, messageId={}", sessionId, message.getId());
        } catch (Exception e) {
            log.error("处理消息失败: {}", e.getMessage(), e);
        }
    }

    @MessageMapping("/chat.userStatus")
    public void handleUserStatus(@Payload Map<String, Object> payload, StompHeaderAccessor headerAccessor) {
        try {
            String sessionId = headerAccessor.getSessionId();
            String userId = (String) payload.get("userId");
            Boolean isOnline = (Boolean) payload.get("isOnline");

            log.info("用户状态更新: sessionId={}, userId={}, isOnline={}",
                    sessionId, userId, isOnline);

            // 验证参数
            if (userId == null || isOnline == null) {
                log.error("状态更新参数错误: {}", payload);
                return;
            }

            // 更新用户在线状态
            chatService.updateUserStatus(userId, isOnline);

            // 如果用户上线，发送未读消息
            if (isOnline) {
                chatService.sendUnreadMessages(userId);
            }

            log.info("用户状态更新完成: sessionId={}, userId={}", sessionId, userId);
        } catch (Exception e) {
            log.error("更新用户状态失败: {}", e.getMessage(), e);
        }
    }
}