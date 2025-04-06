package com.zr.uniSoul.pojo.entity;

import lombok.Data;
import java.time.LocalDateTime;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.IdType;

/**
 * 聊天消息实体类
 * 用于存储聊天消息的相关信息
 */
@Data
@TableName("chat_message")
public class ChatMessage {
    /**
     * 消息ID
     */
    @TableId(type = IdType.INPUT)
    private Long id;

    /**
     * 发送者ID
     */
    private String senderId;

    /**
     * 接收者ID
     */
    private String receiverId;

    /**
     * 消息内容
     */
    private String content;

    /**
     * 消息创建时间
     */
    private LocalDateTime createTime;

    /**
     * 消息是否已读
     */
    private Boolean isRead;

    /**
     * 消息类型
     * TEXT: 文本消息
     * IMAGE: 图片消息
     * FILE: 文件消息
     */
    private String messageType;

    /**
     * 消息状态
     * SENT: 已发送
     * DELIVERED: 已送达
     * READ: 已读
     */
    private String status;
    /**
     * 接收消息的用户的头像
     */
    private String receiverAvatar;
}