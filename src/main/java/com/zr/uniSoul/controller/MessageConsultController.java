package com.zr.uniSoul.controller;

import com.zr.uniSoul.common.R;
import com.zr.uniSoul.pojo.entity.ConsultMessage;
import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.pojo.vo.MessageConsultVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.zr.uniSoul.pojo.dto.MessageConsultDTO;
import com.zr.uniSoul.service.MessageConsultService;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;

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
    @GetMapping("index")
    public R<String> index(){
        return R.success("请求成功");
    }

    @GetMapping("page")
    public ModelAndView page(){
        return new ModelAndView("websocket");
    }

    /**
     * ai咨询
     * @param question
     * @param session
     * @return
     */
    @GetMapping("/chat")
    public R<String> chat(@RequestParam String question, HttpSession session) {

        log.info("ai咨询：{}",question);
        String reply = messageService.getReply(question,session);
        return R.success(reply);

    }

}
