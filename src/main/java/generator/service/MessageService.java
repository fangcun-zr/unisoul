package generator.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import generator.domain.Article;
import generator.domain.Message;
import generator.domain.MessageThread;
import generator.domain.vo.MessageVO;

import java.util.List;

/**
* @author 陈怡帆
* @description 针对表【message】的数据库操作Service
* @createDate 2025-03-01 00:43:09
*/
public interface MessageService extends IService<Message> {

    // region 基础私信功能
    // ----------------------------------------------

    /**
     * 发送私信
     * @param senderId    发送者ID（从Token解析）
     * @param receiverId  接收者ID（必填）
     * @param content     消息内容（1-500字符）
     * @param parentId    父消息ID（可选，用于回复）
     * @return 完整消息对象（含ID和时间戳）
     */
    Message sendMessage(Long senderId, Long receiverId, String content, Long parentId);

    /**
     * 分页获取当前用户私信列表
     * @param currentUserId 当前用户ID
     * @param page          分页参数
     * @return 包含发送者基础信息的消息分页数据
     */
    Page<MessageThread> getMessageList(Long currentUserId, Page<Message> page);

    /**
     * 获取与指定用户的对话历史
     * @param currentUserId 当前用户ID
     * @param targetUserId  目标用户ID
     * @param page          分页参数
     * @return 按时间正序排列的对话记录
     */
    Page<MessageVO> getConversationHistory(Long currentUserId, Long targetUserId, Page<Message> page);

    /**
     * 标记单条消息已读
     * @param messageId     消息ID
     * @param currentUserId 操作者ID（必须是接收者）
     */
    void markMessageAsRead(Long messageId, Long currentUserId);

    /**
     * 批量标记消息为已读
     * @param messageIds    消息ID列表
     * @param currentUserId 操作者ID
     */
    void batchMarkAsRead(List<Long> messageIds, Long currentUserId);

    /**
     * 逻辑删除消息（对用户隐藏）
     * @param messageId     消息ID
     * @param currentUserId 操作者ID（发送者或接收者）
     */
    void deleteMessage(Long messageId, Long currentUserId);

    /**
     * 获取当前用户未读消息总数
     * @param currentUserId 用户ID
     * @return 未读数（接收者为当前用户且未读的消息总数）
     */
    Integer getUnreadCount(Long currentUserId);

    // endregion

    // region 扩展功能
    // ----------------------------------------------

    /**
     * 发送关联文章的私信
     * @param senderId    发送者ID
     * @param receiverId  接收者ID
     * @param content     消息内容
     * @param articleId   关联的文章ID（需校验文章合法性）
     * @return 包含文章摘要的消息对象
     */
    Message sendMessageWithArticle(Long senderId, Long receiverId, String content, Long articleId);

    /**
     * 获取消息关联的完整文章详情
     * @param messageId   消息ID
     * @param currentUserId 当前用户（校验权限）
     * @return Article 实体（带权限校验）
     */
    Article getMessageArticleDetail(Long messageId, Long currentUserId);

    // endregion
}
