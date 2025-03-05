package com.zr.uniSoul.mapper;

import com.zr.uniSoul.pojo.dto.MessageConsultDTO;
import com.zr.uniSoul.pojo.entity.ConsultMessage;
import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.pojo.vo.MessageConsultVO;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 消息Mapper接口，定义了操作数据库的SQL语句。
 */
@Mapper
public interface MessageConsultMapper {
    /**
     * 存储聊天记录
     * @param message
     */
    @Insert("INSERT INTO messages_consult (sender_id,receiver_id, content) VALUES (#{senderId},#{receiverId}, #{content})")
    void insertMessage(MessageConsultDTO message);

    /**
     * 获取未读消息
     * @param receiverId
     * @return
     */
    @Select("SELECT * FROM messages_consult WHERE receiver_id = #{receiverId} AND is_read = FALSE")
    List<MessageConsultDTO> getUnreadMessages(String receiverId);
    /**
     * 标记消息为已读
     * @param id
     */
    @Update("UPDATE messages_consult SET is_read = TRUE WHERE id = #{id}")
    void markMessageAsRead(int id);
    /**
     * 通过SenderId和ReceiverId获取聊天记录
     * @param senderId
     * @param receiverId
     * @return
     */
    @Select("SELECT content,id FROM messages_consult WHERE sender_id = #{senderId} AND receiver_id = #{receiverId} ORDER BY id ASC")
    List<ConsultMessage> getConsultMessage(String senderId, String receiverId);
    /**
     * 获取在线咨询老师或者用户的列表
     * @param category
     * @return
     */
    @Select("SELECT * FROM user WHERE category = #{category}")
    List<User> getCounselorsOrUsers(int category);

    /**
     * 删除已发送的信息
     * @param senderId
     * @param contentId
     */
    @Delete("DELETE FROM messages_consult WHERE sender_id = #{senderId} AND id = #{contentId}")
    void deleteMessage(String senderId,int contentId);
}