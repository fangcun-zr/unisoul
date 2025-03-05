package com.zr.uniSoul.service.impl;


import com.zr.uniSoul.event.MessageEvent;
import com.zr.uniSoul.pojo.dto.MessageConsultDTO;
import com.zr.uniSoul.pojo.entity.ConsultMessage;
import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.pojo.vo.MessageConsultVO;
import com.zr.uniSoul.service.MessageConsultService;
import com.zr.uniSoul.mapper.MessageConsultMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * 消息服务实现类，实现了消息服务接口的方法。
 */
@Service
@Slf4j
public class MessageConsultServiceImpl implements MessageConsultService {
    @Autowired
    private MessageConsultMapper messageMapper;
    @Autowired
    private ApplicationEventPublisher eventPublisher;

    public MessageConsultServiceImpl(MessageConsultMapper messageMapper) {
        this.messageMapper = messageMapper;
    }

    @Override
    public void checkAndSendUnreadMessages(String userId) {
        List<MessageConsultDTO> unreadMessages = messageMapper.getUnreadMessages(userId);
        for (MessageConsultDTO message : unreadMessages) {
            eventPublisher.publishEvent(new MessageEvent(this, message));
            messageMapper.markMessageAsRead(message.getId());
        }
    }

    /**
     * 发送信息
     * @param message
     */
    @Override
    public void sendMessage(MessageConsultDTO message) {
        //将数据存入数据库中
        messageMapper.insertMessage(message);
        //通过webSocket将消息发送给接收的人
        // Publish the event to notify listeners (e.g., WebSocket handler)
        eventPublisher.publishEvent(new MessageEvent(this, message));

        // Mark the message as unread if it was not sent successfully
        message.setRead(false);
    }
    /**
     * 通过SenderId和ReceiverId获取聊天记录
     * @param messageConsultVO
     * @return
     */
    @Override
    public List<ConsultMessage> getConsultMessage(MessageConsultVO messageConsultVO) {
        return messageMapper.getConsultMessage(messageConsultVO.getSenderId(),messageConsultVO.getReceiverId());
    }
    /**
     * 获取在线咨询老师或者用户的列表
     * @param category
     * @return
     */
    @Override
    public List<User> getCounselorsOrUsers(int category) {
        return messageMapper.getCounselorsOrUsers(category);
    }

    /**
     * 删除已发送的信息
     * @param senderId
     * @param contentId
     */
    @Override
    public void deleteMessage(String senderId,int contentId) {
        messageMapper.deleteMessage(senderId,contentId);
    }
}
