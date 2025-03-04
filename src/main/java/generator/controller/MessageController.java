package generator.controller;


import com.baomidou.mybatisplus.core.metadata.OrderItem;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import generator.common.*;
import generator.constant.CommonConstant;
import generator.domain.Message;
import generator.domain.MessageThread;
import generator.domain.dto.MessageDTO;
import generator.domain.vo.MessageVO;
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
    public BaseResponse<Page<MessageVO>> getMessageHistory(
            @RequestParam Long user1,
            @RequestParam Long user2,
            @ModelAttribute PageRequest pageRequest) {

        // 1. 将自定义分页参数转换为 MyBatis Plus 的 Page 对象
        Page<Message> page = new Page<>(pageRequest.getCurrent(), pageRequest.getPageSize());

        // 2. 处理排序（如果指定了排序字段）
        if (StringUtils.isNotBlank(pageRequest.getSortField())) {
            // 根据排序顺序添加排序规则
            String order = CommonConstant.SORT_ORDER_ASC.equalsIgnoreCase(pageRequest.getSortOrder()) ?
                    "ASC" : "DESC";
            page.addOrder(new OrderItem(pageRequest.getSortField(), "ASC".equals(order)));
        }

        // 3. 调用服务层获取分页数据
        Page<MessageVO> resultPage = messageService.getConversationHistory(user1, user2, page);

        // 4. 返回统一响应格式
        return ResultUtils.success(resultPage);
    }

    // 3. 获取当前用户的私信列表
    @GetMapping("/threads")
    public BaseResponse<Page<MessageThread>> getMessageThreads(
            @RequestParam Long userId,
            @ModelAttribute PageRequest pageRequest) {

        // 转换分页参数
        Page<Message> page = new Page<>(pageRequest.getCurrent(), pageRequest.getPageSize());

        // 处理排序
        if (StringUtils.isNotBlank(pageRequest.getSortField())) {
            boolean asc = CommonConstant.SORT_ORDER_ASC.equalsIgnoreCase(pageRequest.getSortOrder());
            page.addOrder(asc ? OrderItem.asc(pageRequest.getSortField()) : OrderItem.desc(pageRequest.getSortField()));
        }

        // 获取分页数据
        Page<MessageThread> result = messageService.getMessageList(userId, page);
        return ResultUtils.success(result);
    }

    // 4. 删除单条消息（逻辑删除）
    @DeleteMapping("/{messageId}")
    public BaseResponse<Void> deleteMessage(
            @PathVariable Long messageId,
            @RequestBody @Valid DeleteRequest deleteRequest // 包含操作者ID
    ) {
        // 1. 获取当前用户ID
        Long currentUserId = deleteRequest.getId();

        // 2. 调用 Service 层删除逻辑
        messageService.deleteMessage(messageId, currentUserId);

        // 3. 返回成功响应
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