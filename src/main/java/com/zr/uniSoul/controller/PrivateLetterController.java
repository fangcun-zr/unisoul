package com.zr.uniSoul.controller;

import com.zr.uniSoul.common.PageResult;
import com.zr.uniSoul.common.R;
import com.zr.uniSoul.pojo.dto.PageQueryDTO;
import com.zr.uniSoul.pojo.entity.Message;
import com.zr.uniSoul.pojo.vo.UserVO;
import com.zr.uniSoul.service.PrivateLetterService;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/privateLetter")
@Slf4j
public class PrivateLetterController {
    @Autowired
    private PrivateLetterService privateLetterService;
    //获取关注列表
    @PostMapping("/getFollowList")
    public R<PageResult> getFollowList(HttpServletRequest request, @RequestBody PageQueryDTO pageQueryDTO){
        long userId = (Long)request.getSession().getAttribute("userId");
         if(userId == 0){
            return R.error("请先登录");             
         }
         log.info("获取关注列表，用户id为：{}",userId);
         pageQueryDTO.setUserId(Integer.valueOf(userId+""));
        log.info("分页查询：{}", pageQueryDTO);
        PageResult pageResult = privateLetterService.pageQueryFollow(pageQueryDTO);
        if(pageResult == null){
            return R.error("获取关注列表失败");
         }
         return R.success(pageResult);
    }

    /**
     * 获取当前用户ID
     * @param request
     * @return
     */
    @GetMapping("getUserId")
    public R<Long> getUserId(HttpServletRequest request){
        log.info("获取当前用户ID");
        return R.success((Long)request.getSession().getAttribute("userId"));
    }
    @PostMapping("/getChatHistory")
    public R<PageResult> getChatHistory(@RequestBody PageQueryDTO pageQueryDTO){
        log.info("获取聊天记录：{}",pageQueryDTO);
        PageResult chatHistory = privateLetterService.getChatHistory(pageQueryDTO);
        log.info("获取聊天记录：{}",chatHistory);
        return R.success(chatHistory);
    }
}
