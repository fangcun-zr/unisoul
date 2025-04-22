package com.zr.uniSoul.controller;

import com.zr.uniSoul.common.PageResult;
import com.zr.uniSoul.pojo.dto.PageQueryDTO;
import com.zr.uniSoul.pojo.entity.ChatMessage;
import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.pojo.vo.ArticleVO;
import com.zr.uniSoul.pojo.vo.UserVO;
import com.zr.uniSoul.service.ChatService;
import com.zr.uniSoul.common.R;
import com.zr.uniSoul.service.XtqhService;
import io.swagger.annotations.ApiOperation;
import kotlin.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/consult")
public class ChatController {

    private static final Logger log = LoggerFactory.getLogger(ChatController.class);

    @Autowired
    private ChatService chatService;
    @Autowired
    private XtqhService xtqhService;

    /**
     * 获取用户头像
     * @param request
     * @return
     */
    @GetMapping("/getAvatar")
    public R<String> getAvatar(HttpServletRequest request) {
        Long userId = (Long)request.getSession().getAttribute("userId");
        return R.success(chatService.getAvatar(userId));
    }
    /**
     * 根据用户id获取用户头像
     * @param userId
     * @return
     */
    @GetMapping("/getAvatarById")
    public R<String> getAvatarById(@RequestParam Long userId) {
        return R.success(chatService.getAvatar(userId));
    }

    /**
     * 获取咨询师列表
     * @param request
     * @param category
     * @return
     */
    @GetMapping("/getCounselors")
    public R<List<User>> getCounselors(HttpServletRequest request ,@RequestParam Integer category) {
        try {
            Long userId = (Long) request.getSession().getAttribute("userId");
            String id = Long.toString(userId);
            log.info("获取用户列表, category: {}", category);
            List<User> users = chatService.getChatList(id, category);

            if (users == null || users.isEmpty()) {
                log.warn("未找到用户数据, category: {}", category);
                return R.success(new ArrayList<>());
            }

            log.info("成功获取用户列表, 数量: {}", users.size());
            return R.success(users);
        } catch (Exception e) {
            log.error("获取用户列表失败, category: {}", category, e);
            return R.error("获取用户列表失败: " + e.getMessage());
        }
    }
    /**
     * 获取聊天记录
     * @param request
     * @param pageQueryDTO
     * @return
     */
    @PostMapping("/messages")
    public R<PageResult> getMessages(HttpServletRequest request, @RequestBody PageQueryDTO pageQueryDTO) {
        Long Id = (Long) request.getSession().getAttribute("userId");
        String userId = Long.toString(Id);
        String receiverId = String.valueOf(pageQueryDTO.getReceiverId());
        try {// 参数验证
            if (userId == null || userId.trim().isEmpty() ||
                    receiverId == null || receiverId.trim().isEmpty()) {
                log.warn("用户ID或接收者ID为空");
                return R.error("用户ID或接收者ID为空");
            }
            log.info("获取聊天记录, userId={}, receiverId={}", userId, receiverId);
            PageResult pageResult = chatService.pageQueryMessage(pageQueryDTO);
            log.info("成功获取聊天记录, 数量: {}", pageResult);
            return R.success(pageResult);
        } catch (Exception e) {
            log.error("获取聊天记录失败, userId={}, receiverId={}", userId, receiverId, e);
            return R.error("获取聊天记录失败: " + e.getMessage());
        }
    }
    /**
     * 获取咨询消息
     * @param request
     * @param senderId
     * @param receiverId
     * @return
     */
    @GetMapping("/consultMessage")
    public R<List<ChatMessage>> getConsultMessage(
            HttpServletRequest request,
            @RequestParam(required = true) String senderId,
            @RequestParam(required = true) String receiverId) {
        Long id = (Long) request.getSession().getAttribute("userId");
        senderId = Long.toString(id);
        try {
            // 参数验证
            if (senderId == null || senderId.trim().isEmpty() ||
                    receiverId == null || receiverId.trim().isEmpty()) {
                log.warn("发送者ID或接收者ID为空");
                return R.success(new ArrayList<>());
            }

            log.info("获取咨询消息, senderId={}, receiverId={}", senderId, receiverId);
            List<ChatMessage> messages = chatService.getChatHistory(senderId, receiverId);
            if (messages == null) {
                messages = new ArrayList<>();
            }

            log.info("成功获取咨询消息, 数量: {}", messages.size());
            return R.success(messages);
        } catch (Exception e) {
            log.error("获取咨询消息失败, senderId={}, receiverId={}", senderId, receiverId, e);
            return R.error("获取咨询消息失败: " + e.getMessage());
        }
    }

    /**
     * 删除消息
     * @param messageId
     * @return
     */
    @DeleteMapping("/message/{messageId}")
    public R<String> deleteMessage(@PathVariable String messageId) {
        try {
            log.info("删除消息, messageId={}", messageId);
            chatService.updateMessageStatus(Long.parseLong(messageId), true);
            return R.success("发送成功");
        } catch (Exception e) {
            log.error("删除消息失败", e);
            return R.error("删除消息失败: " + e.getMessage());
        }
    }
    @GetMapping("/getUserId")
    public R<String> getUserId(HttpServletRequest request) {
        Long Id = (Long)request.getSession().getAttribute("userId");
        String userId = Long.toString(Id);
        return R.success(userId);
    }

    /**
     * 获取用户信息
     * @param userId
     * @return
     */
    @GetMapping("/getUserInformation")
    public R<UserVO> getUserInformation(@RequestParam String userId) {
        log.info("获取用户信息, userId={}", userId);
        UserVO getinformation = xtqhService.getinformation(Integer.parseInt(userId));
        return R.success(getinformation);
    }
}