package generator.domain.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class MessageDTO {
    private Long id;

    @NotNull(message = "发送者ID不能为空")
    private Long senderId;  // 驼峰命名，前端传参时用 senderId

    @NotNull(message = "接收者ID不能为空")
    private Long receiverId;

    @NotBlank(message = "消息内容不能为空")
    private String content;

    private Long parentId;  // 回复的父消息ID（可选）
}