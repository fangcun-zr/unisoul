package com.zr.uniSoul.controller;

import com.zr.uniSoul.common.R;
import com.zr.uniSoul.pojo.entity.ConsultMessage;
import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.pojo.vo.MessageConsultVO;
import com.zr.uniSoul.utils.AiConsultUtil;
import com.zr.uniSoul.utils.DeepSeekUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.zr.uniSoul.pojo.dto.MessageConsultDTO;
import com.zr.uniSoul.service.MessageConsultService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 消息控制器，提供API接口用于管理消息。
 */
@RestController
@RequestMapping("/consult")
@Slf4j
@Api(tags = "在线咨询接口")
public class MessageConsultController {
    @Autowired
    private MessageConsultService messageService;

    public MessageConsultController(MessageConsultService messageService) {
        this.messageService = messageService;
    }

    /**
     * 发送信息接口
     * @return
     */
    @PostMapping("/send")
    @ApiOperation("客户端发送咨询")
    public R<String> sendMessage(@RequestBody MessageConsultDTO message, HttpServletRequest request) {
        Object userId = request.getSession().getAttribute("username");
        log.info("userId: {}", userId);
        if (userId == null) {
            return R.error("用户未登录");
        } else {
            message.setSenderId(userId.toString());
            log.info("发送消息: {}", message);
            messageService.sendMessage(message);
            return R.success("消息发送成功");
        }
    }

    /**
     * 获取咨询聊天记录
     * @return
     */
    @GetMapping("/consultMessage")
    @ApiOperation("获取咨询信息")
    public R<MessageConsultVO> getConsultMessage(HttpServletRequest request,@RequestParam String receiverId) {
        Object userId = request.getSession().getAttribute("username");
        MessageConsultVO messageConsultVO = new MessageConsultVO();
        messageConsultVO.setSenderId(userId.toString());
        messageConsultVO.setReceiverId(receiverId);
        log.info("获取咨询信息: {}", messageConsultVO);
        List<ConsultMessage> consultMessage = messageService.getConsultMessage(messageConsultVO);
        messageConsultVO.setMessageList(consultMessage);
        return R.success(messageConsultVO);
    }

    /**
     * 获取在线咨询老师或者用户的列表
     * @param request
     * @param category
     * @return
     */
    @GetMapping("/getCounselors")
    @ApiOperation("获取在线咨询老师或者用户的列表")
    public R<List<User>> getCounselorsOrUsers(HttpServletRequest request,@RequestParam int category){
        Object username = request.getSession().getAttribute("username");
        if(username == null){
            return R.error("用户未登录");
        }
        List<User> counselorsOrUsers = messageService.getCounselorsOrUsers(category);
        return R.success(counselorsOrUsers);
    }

    /**
     * 删除已发送的信息
     * @param contentId
     * @param request
     * @return
     */
    @DeleteMapping("/deleteMessage")
    @ApiOperation("删除已发送的信息")
    public R<String> deleteMessage(@RequestParam int contentId,HttpServletRequest request){
        Object username = request.getSession().getAttribute("username");
        if(username == null){
            return R.error("用户未登录");
        }
        String senderId = username.toString();
        log.info("删除已发送的信息: {}", senderId,contentId);
        messageService.deleteMessage(senderId,contentId);
        return R.success("成功删除");
    }


    /**
     * ai咨询
     * @param question
     * @param session
     * @return
     */
    @GetMapping("/chat")
    public R<String> chat(@RequestParam String question, HttpSession session) {

        String reply = messageService.getReply(question,session);
        return R.success(reply);

    }

}
