package com.zr.uniSoul.service;

import com.zr.uniSoul.pojo.entity.ChatMessage;
import com.zr.uniSoul.pojo.entity.User;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 聊天服务接口
 * 定义聊天相关的业务操作
 */
public interface ChatService {
    /**
     * 更新用户在线状态
     *
     * @param userId 用户ID
     * @param isOnline 是否在线
     */
    void updateUserStatus(String userId, boolean isOnline);

    /**
     * 处理接收到的消息
     * 包括消息的保存、状态更新等操作
     *
     * @param message 聊天消息对象
     */
    void handleMessage(ChatMessage message);

    /**
     * 更新消息状态
     * 主要用于将消息标记为已读
     *
     * @param messageId 消息ID
     * @param isRead 是否已读
     */
    void updateMessageStatus(Long messageId, boolean isRead);

    /**
     * 发送未读消息
     * 当用户上线时，发送所有未读消息
     *
     * @param userId 用户ID
     */
    void sendUnreadMessages(String userId);

    /**
     * 获取聊天列表
     * 返回所有可聊天的用户，在线用户优先显示
     *
     * @param userId 当前用户ID
     * @return 用户列表
     */
    List<User> getChatList(String userId, Integer category);

    /**
     * 获取与指定用户的聊天记录
     *
     * @param userId 当前用户ID
     * @param targetUserId 目标用户ID
     * @return 聊天消息列表
     */
    List<ChatMessage> getChatHistory(String userId, String targetUserId);

    /**
     * 获取未读消息数
     *
     * @param userId 用户ID
     * @return 未读消息数量
     */
    int getUnreadCount(String userId);

    /**
     * 获取用户头像
     * @param userId
     * @return
     */
    String getAvatar(Long userId);
}
