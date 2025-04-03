package com.zr.uniSoul.mapper;

import com.zr.uniSoul.pojo.entity.ChatMessage;
import com.zr.uniSoul.pojo.entity.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ChatMessageMapper {

    @Insert("INSERT INTO chat_message (id, sender_id, receiver_id, content, create_time, is_read, message_type, status) " +
            "VALUES (#{id}, #{senderId}, #{receiverId}, #{content}, #{createTime}, #{isRead}, #{messageType}, #{status})")
    void insert(ChatMessage message);

    @Select("SELECT * FROM chat_message " +
            "WHERE receiver_id = #{userId} AND is_read = false " +
            "ORDER BY create_time ASC")
    List<ChatMessage> getUnreadMessages(@Param("userId") String userId);

    @Select("SELECT cm.*, u.avatarUrl AS senderAvatar\n" +
            "FROM chat_message cm\n" +
            "JOIN `user` u ON (cm.sender_id = u.id)\n" +
            "WHERE (cm.sender_id = #{userId} AND cm.receiver_id = #{targetUserId})\n" +
            "   OR (cm.sender_id = #{targetUserId} AND cm.receiver_id = #{userId})\n" +
            "ORDER BY cm.create_time ASC")
    List<ChatMessage> getChatHistory(@Param("userId") String userId,
                                     @Param("targetUserId") String targetUserId);

    /**
     * 更新消息状态
     *
     * @param messageId 消息ID
     * @param isRead 是否已读
     */
    @Update("UPDATE chat_message SET is_read = #{isRead} WHERE id = #{messageId}")
    void updateStatus(@Param("messageId") Long messageId, @Param("isRead") boolean isRead);

    @Select("SELECT COUNT(*) FROM chat_message WHERE receiver_id = #{userId} AND is_read = false")
    int getUnreadCount(@Param("userId") String userId);

    /**
     * 根据用户类别查询用户列表
     * @param userId 当前用户ID
     * @param category 用户类别（1: 咨询师, 0: 普通用户）
     * @return 用户列表
     */
    @Select("SELECT * FROM user WHERE category = #{category} AND status = 1 AND id != #{userId}")
    List<User> selectByCategory(@Param("userId") Long userId , @Param("category") Integer category);

    /**
     * 更新用户在线状态
     *
     * @param userId 用户ID
     * @param isOnline 是否在线
     */
    @Update("UPDATE user SET is_online = #{isOnline} WHERE id = #{userId}")
    void updateOnlineStatus(@Param("userId") String userId, @Param("isOnline") boolean isOnline);

    /**
     * 获取用户的聊天列表
     * 返回所有可聊天的用户，在线用户优先显示
     *
     * @param userId 当前用户ID
     * @return 用户列表
     */
    @Select("SELECT u.* FROM user u " +
            "LEFT JOIN chat_message m ON (m.sender_id = u.id OR m.receiver_id = u.id) " +
            "WHERE (m.sender_id = #{userId} OR m.receiver_id = #{userId}) " +
            "AND u.id != #{userId} " +
            "GROUP BY u.id " +
            "ORDER BY u.is_online DESC, m.create_time DESC")
    List<User> getChatList(@Param("userId") String userId);
    @Select("SELECT avatarUrl FROM user WHERE id = #{senderId}")
    String selectAvatarById(String senderId);

    /**
     * 获取用户类别
     * @param userId
     * @return
     */
    @Select("SELECT category FROM user WHERE id = #{userId}")
    Integer getCategoryById(String userId);

    // ... 其他已有的方法 ...
}
