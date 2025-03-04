package generator.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import generator.common.ErrorCode;
import generator.domain.Article;
import generator.domain.Message;
import generator.domain.MessageThread;
import generator.domain.User;
import generator.domain.vo.MessageVO;
import generator.exception.BusinessException;
import generator.mapper.MessageMapper;
import generator.service.ArticleService;
import generator.service.MessageService;
import generator.service.UserService;
import org.hibernate.validator.internal.util.stereotypes.Lazy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;

/**
* @author 陈怡帆
* @description 针对表【message】的数据库操作Service实现
* @createDate 2025-03-01 00:43:09
*/
@Service
@Slf4j
public class MessageServiceImpl extends ServiceImpl<MessageMapper, Message>
    implements MessageService{

    @Autowired
    @Lazy // 避免循环依赖
    private UserService userService;

    @Autowired
    private MessageMapper messageMapper;

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW) // 独立事务
    public Message sendMessage(Long senderId, Long receiverId, String content, Long parentId) {
        log.info("开始查询发送者用户信息，senderId: {}", senderId);
        User sender = userService.getById(senderId);
        log.info("发送者用户信息查询完成，sender: {}", sender);

        log.info("开始查询接收者用户信息，receiverId: {}", receiverId);
        User receiver = userService.getById(receiverId);
        log.info("接收者用户信息查询完成，receiver: {}", receiver);

        if (sender == null || receiver == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "用户不存在");
        }

        // 创建并填充消息对象
        Message message = new Message();
        message.setSender_id(senderId); // 使用传入的senderId
        message.setReceiver_id(receiverId); // 使用传入的receiverId
        message.setContent(content); // 使用传入的内容
        message.setSend_time(new Date());
        message.setParent_id(parentId != null ? parentId : null); // 设置父消息ID，如果为null则设为默认值

        // 保存到数据库
        this.save(message);
        return message;
    }

//    @Override
//    public Page<MessageThread> getMessageList(Long currentUserId, Page<Message> page) {
//        // 1. 手动设置分页参数（参数类型需为 int）
//        PageHelper.startPage((int) page.getCurrent(), (int) page.getSize());
//
//        // 2. 执行查询（Mapper 接口已移除 page 参数）
//        Page<MessageThread> threadPage = messageMapper.selectThreadBaseInfo(currentUserId);
//
//        // 3. 后续批量查询和填充逻辑...
//        return threadPage;
//    }
@Override
public Page<MessageThread> getMessageList(Long currentUserId, Page<Message> page) {
    // 创建 MyBatis-Plus 的 Page 对象
    Page<MessageThread> threadPage = new Page<>(page.getCurrent(), page.getSize());

    // 执行分页查询
    threadPage = messageMapper.selectThreadBaseInfo(threadPage, currentUserId);

    // 后续批量查询和填充逻辑...
    return threadPage;
}

//    @Override
//    public Page<MessageThread> getMessageList(Long currentUserId, Page<Message> page) {
//        Page<MessageThread> threadPage = new Page<>(page.getCurrent(), page.getSize());
//        threadPage = messageMapper.selectThreadBaseInfo(threadPage, currentUserId);
//        // ...后续逻辑
//        return threadPage;
//    }

//    @Override
//    public Page<MessageThread> getMessageList(Long currentUserId, Page<Message> page) {
//
//        PageHelper.startPage((int) page.getCurrent(), (int) page.getSize()); // 手动设置分页参数
//        Page<MessageThread> threadPage = messageMapper.selectThreadBaseInfo(currentUserId); // 移除 page 参数
//
//
//        // 1. 查询基础会话列表（带分页）
////        Page<MessageThread> threadPage = messageMapper.selectThreadBaseInfo(currentUserId, page);
//
//        // 2. 批量查询用户信息和未读数
//        List<Long> contactIds = threadPage.getRecords().stream()
//                .map(MessageThread::getContactId)
//                .collect(Collectors.toList());
//
//        // 批量查询用户信息
//        Map<Long, User> userMap = userService.listByIds(contactIds).stream()
//                .collect(Collectors.toMap(User::getId, Function.identity()));
//
//        // 批量查询未读消息数
//        Map<Long, Integer> unreadCountMap = messageMapper.batchSelectUnreadCount(currentUserId, contactIds);
//
//        // 3. 填充会话列表信息
//        threadPage.getRecords().forEach(thread -> {
//            User contactUser = userMap.get(thread.getContactId());
//            if (contactUser != null) {
//                thread.setContactName(contactUser.getUsername());
//                thread.setContactAvatar(contactUser.getAvatarUrl());
//            }
//            thread.setUnreadCount(unreadCountMap.getOrDefault(thread.getContactId(), 0));
//        });
//
//        return threadPage;
//    }

    @Override
    public Page<MessageVO> getConversationHistory(Long currentUserId, Long targetUserId, Page<Message> page) {
        // 构建查询条件
        QueryWrapper<Message> queryWrapper = new QueryWrapper<>();
        queryWrapper.nested(wq -> wq
                        .eq("sender_id", currentUserId)
                        .eq("receiver_id", targetUserId)
                )
                .or(wq -> wq
                        .eq("sender_id", targetUserId)
                        .eq("receiver_id", currentUserId)
                );

        // 执行分页查询
        Page<Message> messagePage = messageMapper.selectPage(page, queryWrapper);

        // 手动创建新的 Page 对象（关键修复点）
        Page<MessageVO> voPage = new Page<>();
        voPage.setRecords(messagePage.getRecords().stream()
                .map(this::convertToVO)
                .collect(Collectors.toList()));
        voPage.setTotal(messagePage.getTotal());
        voPage.setSize(messagePage.getSize());
        voPage.setCurrent(messagePage.getCurrent());
        voPage.setOrders(messagePage.getOrders());

        return voPage;
    }

    private MessageVO convertToVO(Message message) {
        MessageVO vo = new MessageVO();
        vo.setId(message.getId());
        vo.setSenderId(message.getSender_id());
        vo.setReceiverId(message.getReceiver_id());
        vo.setContent(message.getContent());
        vo.setSendTime(message.getSend_time());
        vo.setReadStatus(message.getRead_status());
        vo.setParentId(message.getParent_id());
        return vo;
    }

    @Override
    public void markMessageAsRead(Long messageId, Long currentUserId) {

    }

    @Override
    public void batchMarkAsRead(List<Long> messageIds, Long currentUserId) {

    }

    @Override
    public void deleteMessage(Long messageId, Long currentUserId) {
        // 1. 检查消息是否存在
        Message message = messageMapper.selectById(messageId);
        if (message == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "消息不存在");
        }

        // 2. 检查 sender_id 和 receiver_id 是否为空
        if (message.getSender_id() == null || message.getReceiver_id() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "消息数据不完整");
        }

        // 3. 检查当前用户是否有权限删除该消息
        if (!message.getSender_id().equals(currentUserId) && !message.getReceiver_id().equals(currentUserId)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR, "无权删除该消息");
        }

        // 4. 逻辑删除（更新 is_deleted 字段）
        Message updateMessage = new Message();
        updateMessage.setId(messageId);
        updateMessage.setIsDeleted(1); // 1 表示已删除
        messageMapper.updateById(updateMessage);

        // 5. 记录日志（可选）
        log.info("消息删除成功，消息ID：{}，操作者ID：{}", messageId, currentUserId);
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




