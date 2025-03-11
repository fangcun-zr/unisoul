package com.zr.uniSoul.service;

import com.zr.uniSoul.pojo.dto.MessageConsultDTO;
import com.zr.uniSoul.pojo.entity.ConsultMessage;
import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.pojo.vo.MessageConsultVO;

import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * 消息服务接口，定义了消息管理的相关方法。
 */
public interface MessageConsultService {
    void checkAndSendUnreadMessages(String userId);

    /**
     * 发送信息
     * @param message
     */
    void sendMessage(MessageConsultDTO message);

    /**
     * 通过SenderId和ReceiverId获取聊天记录
     * @param messageConsultVO
     * @return
     */
    List<ConsultMessage> getConsultMessage(MessageConsultVO messageConsultVO);
    /**
     * 获取在线咨询老师或者用户的列表
     * @param category
     * @return
     */
    List<User> getCounselorsOrUsers(int category);

    /**
     * 删除已发送的信息
     * @param senderId
     * @param contentId
     */
    void deleteMessage(String senderId,int contentId);

    String getReply(String question, HttpSession session);
}