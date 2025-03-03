package generator.controller;


import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import generator.common.*;
import generator.domain.Message;
import generator.domain.MessageThread;
import generator.domain.dto.MessageDTO;
import generator.service.MessageService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("messages")
@Api(tags = "私信")
public class MessageController {

    @Autowired
    private MessageService messageService;

    // 1. 发送私信
    @PostMapping("/send")
    @ApiOperation("发私信")
    public BaseResponse<MessageDTO> sendMessage(@RequestBody @Valid MessageDTO messageDTO) {
        Long receiverId = messageDTO.getReceiverId();
        String content = messageDTO.getContent();
        Long senderId = messageDTO.getSenderId();
        Long parentId = messageDTO.getParentId();

        // 调用 Service 发送消息
        Message savedMessage = messageService.sendMessage(senderId, receiverId, content, parentId);

        // 将 Message 转换为 MessageDTO
        MessageDTO savedMessageDTO = convertToMessageDTO(savedMessage);

        // 返回成功响应
        return ResultUtils.success(savedMessageDTO);
    }
    public MessageDTO convertToMessageDTO(Message message) {
        MessageDTO messageDTO = new MessageDTO();
        BeanUtils.copyProperties(message, messageDTO);
        return messageDTO;
    }


    // 2. 获取双方历史消息（带分页）
    @GetMapping("/history")
    public BaseResponse<Page<Message>> getMessageHistory(
            @RequestParam Long user1,
            @RequestParam Long user2,
            @ModelAttribute PageRequest pageRequest // 自定义分页参数
    ) {
        // 示例：返回分页数据（需处理分页逻辑）
        return ResultUtils.success(null);
    }

    // 3. 获取当前用户的私信列表
    @GetMapping
    public BaseResponse<List<MessageThread>> getMessageThreads(
            @RequestParam Long userId
    ) {
        // 示例：返回私信列表（逻辑需补充）
        return ResultUtils.success(null);
    }

    // 4. 删除单条消息（逻辑删除）
    @DeleteMapping("/{messageId}")
    public BaseResponse<Void> deleteMessage(
            @PathVariable Long messageId,
            @RequestBody @Valid DeleteRequest deleteRequest // 包含操作者ID
    ) {
        // 示例：鉴权通过后删除（需补充校验逻辑）
        return ResultUtils.success(null);
    }

    // 5. 标记消息为已读
    @PutMapping("/{messageId}/read")
    public BaseResponse<Void> markAsRead(
            @PathVariable Long messageId,
            @RequestParam Long userId
    ) {
        // 示例：处理已读状态（逻辑需补充）
        return ResultUtils.success(null);
    }

    // 统一异常处理示例（可放在 @ControllerAdvice 中）
    @ExceptionHandler(Exception.class)
    public BaseResponse<?> handleException(Exception e) {
        return ResultUtils.error(ErrorCode.OPERATION_ERROR, e.getMessage());
    }
}