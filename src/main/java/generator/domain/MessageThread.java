package generator.domain;

import lombok.Data;

import java.time.LocalDateTime;

//@Data
//public class MessageThread {
//    /**
//     * 对方用户ID
//     */
//    private Long contactId;
//
//    /**
//     * 对方用户名（需关联用户表查询）
//     */
//    private String contactName;
//
//    /**
//     * 对方头像（需关联用户表查询）
//     */
//    private String contactAvatar;
//
//    /**
//     * 最后一条消息内容
//     */
//    private String lastMessage;
//
//    /**
//     * 最后一条消息时间
//     */
//    private LocalDateTime lastMessageTime;
//
//    /**
//     * 未读消息数量
//     */
//    private Integer unreadCount;
//
//    // 可选：构造方法简化对象创建
//    public MessageThread(Long contactId, String lastMessage, LocalDateTime lastMessageTime, Integer unreadCount) {
//        this.contactId = contactId;
//        this.lastMessage = lastMessage;
//        this.lastMessageTime = lastMessageTime;
//        this.unreadCount = unreadCount;
//    }
//}
@Data
public class MessageThread {
    private Long contactId;            // 对应 contact_id
    private LocalDateTime lastMessageTime;  // 对应 send_time
    private String lastMessage;        // 对应 content
}