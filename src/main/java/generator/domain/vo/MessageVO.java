package generator.domain.vo;

import lombok.Data;

import java.util.Date;

@Data
public class MessageVO {
    private Long id;
    private Long senderId;
    private Long receiverId;
    private String content;
    private Date sendTime;
    private Integer readStatus;
    private Long parentId;
}
