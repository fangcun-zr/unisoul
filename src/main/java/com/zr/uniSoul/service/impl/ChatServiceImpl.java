package com.zr.uniSoul.service.impl;

import com.zr.uniSoul.mapper.ChatMessageMapper;
import com.zr.uniSoul.pojo.entity.ChatMessage;
import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.service.ChatService;
import generator.mapper.UserMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.ArrayList;
import java.util.Random;

/**
 * 聊天服务实现类
 * 实现ChatService接口定义的所有业务方法
 * 负责处理消息的存储、状态更新、用户状态管理等核心业务逻辑
 */
@Service
@Slf4j
public class ChatServiceImpl implements ChatService {

    /**
     * 聊天消息数据访问对象
     * 用于处理聊天消息的数据库操作
     */
    @Autowired
    private ChatMessageMapper chatMessageMapper;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserMapper userMapper;

    /**
     * 更新用户在线状态
     * 当用户连接或断开WebSocket时调用此方法
     *
     * @param userId 用户ID
     * @param isOnline 是否在线
     */
    @Override
    @Transactional
    public void updateUserStatus(String userId, boolean isOnline) {
        chatMessageMapper.updateOnlineStatus(userId, isOnline);
    }

    /**
     * 处理接收到的消息
     * 设置消息的基本信息并保存到数据库
     * 包括：生成消息ID、设置创建时间、设置初始状态等
     *
     * @param message 聊天消息对象
     */
    @Override
    @Transactional
    public void handleMessage(ChatMessage message) {
        try {
            // 生成更短的ID
            Long messageId = generateMessageId();
            message.setId(messageId);

            // 设置消息状态
            message.setStatus("SENT");
            message.setIsRead(false);

            // 保存消息
            chatMessageMapper.insert(message);

            // 发送消息给接收者
            messagingTemplate.convertAndSendToUser(
                    message.getReceiverId(),
                    "/topic/messages",
                    message
            );
        } catch (Exception e) {
            log.error("处理消息失败", e);
            throw new RuntimeException("Failed to handle message", e);
        }
    }

    /**
     * 生成消息ID
     * 使用时间戳后6位 + 3位随机数
     */
    private Long generateMessageId() {
        // 使用时间戳后6位 + 3位随机数
        long timestamp = System.currentTimeMillis();
        String timestampStr = String.valueOf(timestamp).substring(7); // 取后6位
        String randomStr = String.format("%03d", new Random().nextInt(1000)); // 生成3位随机数
        return Long.parseLong(timestampStr + randomStr);
    }

    /**
     * 更新消息状态
     * 主要用于将消息标记为已读
     *
     * @param messageId 消息ID
     * @param isRead 是否已读
     */
    @Override
    @Transactional
    public void updateMessageStatus(Long messageId, boolean isRead) {
        chatMessageMapper.updateStatus(messageId, isRead);
    }

    /**
     * 发送未读消息
     * 当用户上线时，获取并发送所有未读消息
     * 发送后自动将消息标记为已读
     *
     * @param userId 用户ID
     */
    @Override
    public void sendUnreadMessages(String userId) {
        try {
            // 获取所有未读消息
            List<ChatMessage> unreadMessages = chatMessageMapper.getUnreadMessages(userId);
            for (ChatMessage message : unreadMessages) {
                // 发送未读消息
                messagingTemplate.convertAndSendToUser(
                        userId,
                        "/topic/messages",
                        message
                );
                // 更新消息状态为已读
                updateMessageStatus(message.getId(), true);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send unread messages", e);
        }
    }

    /**
     * 获取聊天列表
     * 返回所有可聊天的用户，在线用户优先显示
     * 通过SQL查询实现用户排序
     *
     * @param userId 当前用户ID
     * @param category 用户类别（1: 咨询师, 0: 普通用户）
     * @return 用户列表
     */
    @Override
    public List<User> getChatList(String userId, Integer category) {
        try {
            category = chatMessageMapper.getCategoryById(userId);
            log.info("获取用户列表, userId: {}, category: {}", userId, category);

            // 使用ChatMessageMapper中的实现
            // 如果没有userId，根据category获取用户列表
            return chatMessageMapper.selectByCategory(Long.parseLong(userId) , category);

        } catch (Exception e) {
            log.error("获取用户列表失败, userId: {}, category: {}", userId, category, e);
            throw new RuntimeException("获取用户列表失败: " + e.getMessage());
        }
    }

    /**
     * 获取与指定用户的聊天记录
     * 返回两个用户之间的所有聊天消息
     *
     * @param userId 当前用户ID
     * @param targetUserId 目标用户ID
     * @return 聊天消息列表
     */
    @Override
    public List<ChatMessage> getChatHistory(String userId, String targetUserId) {
//        List<ChatMessage> chatHistory = chatMessageMapper.getChatHistory(userId, targetUserId);
//        chatHistory.forEach(message -> {
//            message.setSenderAvatar(chatMessageMapper.selectAvatarById(message.getSenderId()));
//        });
//        return chatHistory;
        return chatMessageMapper.getChatHistory(userId, targetUserId);
    }

    /**
     * 获取未读消息数
     * 统计指定用户的所有未读消息数量
     *
     * @param userId 用户ID
     * @return 未读消息数量
     */
    @Override
    public int getUnreadCount(String userId) {
        return chatMessageMapper.getUnreadCount(userId);
    }

    @Override
    public String getAvatar(Long userId) {
        return chatMessageMapper.selectAvatarById(Long.toString(userId));
    }
}