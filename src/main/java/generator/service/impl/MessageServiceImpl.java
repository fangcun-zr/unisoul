package generator.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import generator.common.ErrorCode;
import generator.domain.Article;
import generator.domain.Message;
import generator.domain.User;
import generator.domain.vo.MessageVO;
import generator.exception.BusinessException;
import generator.mapper.MessageMapper;
import generator.service.MessageService;
import generator.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
* @author 陈怡帆
* @description 针对表【message】的数据库操作Service实现
* @createDate 2025-03-01 00:43:09
*/
@Service
public class MessageServiceImpl extends ServiceImpl<MessageMapper, Message>
    implements MessageService{

    @Autowired
    private  UserService userService;

    @Override
    public Message sendMessage(Long senderId, Long receiverId, String content, Long parentId) {
        // 校验用户是否存在
        User sender = userService.getById(senderId);
        User receiver = userService.getById(receiverId);
        if (sender == null || receiver == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "用户不存在");
        }

        // 创建并填充消息对象
        Message message = new Message();
        message.setSender_id(senderId); // 使用传入的senderId
        message.setReceiver_id(receiverId); // 使用传入的receiverId
        message.setContent(content); // 使用传入的内容
        message.setSend_time(new Date());
        message.setParent_id(parentId != null ? parentId : 0L); // 设置父消息ID，如果为null则设为默认值

        // 保存到数据库
        this.save(message);
        return message;
    }


    @Override
    public Page<MessageVO> getMessageList(Long currentUserId, Page<Message> page) {
        return null;
    }

    @Override
    public Page<MessageVO> getConversationHistory(Long currentUserId, Long targetUserId, Page<Message> page) {
        return null;
    }

    @Override
    public void markMessageAsRead(Long messageId, Long currentUserId) {

    }

    @Override
    public void batchMarkAsRead(List<Long> messageIds, Long currentUserId) {

    }

    @Override
    public void deleteMessage(Long messageId, Long currentUserId) {

    }

    @Override
    public Integer getUnreadCount(Long currentUserId) {
        return 0;
    }

    @Override
    public Message sendMessageWithArticle(Long senderId, Long receiverId, String content, Long articleId) {
        return null;
    }

    @Override
    public Article getMessageArticleDetail(Long messageId, Long currentUserId) {
        return null;
    }
}




