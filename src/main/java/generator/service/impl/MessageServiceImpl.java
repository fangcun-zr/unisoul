package generator.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import generator.domain.Article;
import generator.domain.Message;
import generator.domain.vo.MessageVO;
import generator.service.MessageService;
import generator.mapper.MessageMapper;
import generator.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        return null;
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




