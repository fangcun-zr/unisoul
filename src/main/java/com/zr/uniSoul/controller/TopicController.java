package com.zr.uniSoul.controller;

import com.zr.uniSoul.common.PageResult;
import com.zr.uniSoul.common.R;
import com.zr.uniSoul.mapper.ColumnsMapper;
import com.zr.uniSoul.pojo.dto.PageQueryDTO;
import com.zr.uniSoul.pojo.dto.TopicDTO;
import com.zr.uniSoul.pojo.entity.Replies;
import com.zr.uniSoul.pojo.entity.Topic;
import com.zr.uniSoul.pojo.vo.RepliesLikesVO;
import com.zr.uniSoul.pojo.vo.TopicLikesVO;
import com.zr.uniSoul.pojo.vo.TopicVO;
import com.zr.uniSoul.service.TopicService;
import com.zr.uniSoul.service.ZhxtService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/topic")
@Api(tags = "话题接口")
@Slf4j
public class TopicController {
    @Autowired
    private TopicService topicService;

    /**
     * 创建话题
     * @param request
     * @param topicDTO
     * @return
     */
    @ApiOperation("创建话题")
    @PostMapping("/createTopic")
    public R<String> createTopic(HttpServletRequest request, @RequestBody TopicDTO topicDTO){
        log.info("创建话题.{}",topicDTO);
        String username = (String)request.getSession().getAttribute("username");
        if(username == null){
            return R.error("用户未登录");
        }
        topicDTO.setUsername(username);
        topicService.createTopic(topicDTO);
        return R.success("创建话题成功");
    }

    /**
     * 评论
     * @param request
     * @param replies
     * @return
     */
    @ApiOperation("评论")
    @PostMapping("/replies")
    public R<String> replies(HttpServletRequest request, @RequestBody Replies replies){
        String username = (String)request.getSession().getAttribute("username");
        if(username == null){
            return R.error("用户未登录");
        }
        replies.setUsername(username);
        log.info("评论，{}",replies);
        topicService.replies(replies);
        return R.success("发送成功");
    }

    /**
     * 获取话题
     * @param request
     * @return
     */
    @ApiOperation("获取话题")
    @GetMapping("/allTopic")
    public R<List<TopicDTO>> allTopic(HttpServletRequest request){
        return R.success(topicService.allTopic());
    }

    /**
     * 获取话题评论
     * @param request
     * @param topicId
     * @return
     */
    @ApiOperation("获取评论")
    @GetMapping("/getReplies")
    public R<List<Replies>> getReplies(HttpServletRequest request,@RequestParam Long topicId){
        List<Replies> replies = topicService.getReplies(topicId);
        log.info("获取评论，{}",replies);
        return R.success(replies);
    }

    /**
     * 实行点赞功能
     * @param request
     * @param topicId
     * @param likeCount
     * @param isLike
     * @return
     */
    @ApiOperation("点赞话题")
    @GetMapping("/likes")
    public R<TopicLikesVO> like(HttpServletRequest request, @RequestParam long topicId,long likeCount, boolean isLike){
        String username = (String)request.getSession().getAttribute("username");
        if(username == null){
            return R.error("用户未登录");
        }
        log.info("点赞，{},{},{}",topicId,likeCount,isLike);
        TopicLikesVO topicLikesVO = topicService.like(username,topicId,likeCount,isLike);
        log.info("完成点赞之后， {}",topicLikesVO);
        return R.success(topicLikesVO);
    }
    @ApiOperation("点赞回复")
    @GetMapping("/likeReplies")
    public R<RepliesLikesVO> likeReplies(HttpServletRequest request, @RequestParam long repliesId, long likeCount, boolean isLike){
        String username = (String)request.getSession().getAttribute("username");
        if(username == null){
            return R.error("用户未登录");
        }
        log.info("点赞，{},{},{}",repliesId,likeCount,isLike);
        RepliesLikesVO repliesLikesVO = topicService.likeReplies(username,repliesId,likeCount,isLike);
        log.info("完成点赞之后， {}",repliesLikesVO);
        return R.success(repliesLikesVO);
    }
    /**
     * 计算总的点赞数量
     * @return
     */
    @ApiOperation("获取总的点赞数量")
    @GetMapping("/allLikeCounts")
    public R<Long> allLikeCounts(){
        return R.success(topicService.allLikeCounts());
    }

    /**
     * 获取总的话题数
     * @return
     */
    @ApiOperation("获取总的话题数")
    @GetMapping("/allTopicCounts")
    public R<Long> allTopicCounts(){
        return R.success(topicService.allTopicCounts());
    }

    /**
     * 获取总的评论数量
     * @return
     */
    @ApiOperation("获取总的回复数量")
    @GetMapping("/allRepliesCounts")
    public R<Long> allRepliesCounts(){
        return R.success(topicService.allRepliesCounts());
    }

    /**
     * 获取我的评论
     * @param request
     * @return
     */
    @ApiOperation("获取我的评论")
    @GetMapping("/getMyReplies")
    public R<List<Replies>> getMyReplies(HttpServletRequest request){
        String username = (String)request.getSession().getAttribute("username");
        if(username == null){
            return R.error("用户未登录");
        }
        return R.success(topicService.getRepliesByUsername(username));
    }

    /**
     * 获取话题详情
     * @param topicId
     * @return
     */
    @ApiOperation("获取话题详情")
    @GetMapping("/getTopicInformation")
    public R<Topic> getTopicInformation(@RequestParam Long topicId){
        return R.success(topicService.getTopicInformation(topicId));
    }

    /**
     * 删除话题
     * @param request
     * @param topicId
     * @return
     */
    @ApiOperation("删除话题")
    @DeleteMapping("/deleteTopic")
    public R<String> deleteTopic(HttpServletRequest request,@RequestParam Long topicId){
        String username = (String)request.getSession().getAttribute("username");
        if(username == null){
            return R.error("用户未登录");
        }
        boolean judge =  topicService.deleteTopic(username,topicId);
        if(judge){
            return R.success("删除成功");
        }else {
            return R.error("删除失败");
        }
    }

    /**
     * 删除回复
     * @param request
     * @param replyId
     * @return
     */
    @ApiOperation("删除回复")
    @DeleteMapping("/deleteReplies")
    public R<String> deleteReplies(HttpServletRequest request,@RequestParam(value = "replyId") int replyId){
        String username = (String)request.getSession().getAttribute("username");
        log.info("删除回复，{},{}",username,replyId);
        if(username == null){
            return R.error("用户未登录");
        }
        boolean judge =  topicService.deleteReplies(username,(long) replyId);
        if(judge){
            return R.success("删除成功");
        }else{
            return R.error("删除失败");
        }
    }

    /**
     * 获取所有标签
     * @return
     */
    @ApiOperation("获取所有标签")
    @GetMapping("/AllTags")
    public R<List<String>> AllTags(){
        return R.success(topicService.AllTags());
    }

    /**
     * 通过标签名获取话题
     * @param tagsName
     * @return
     */
    @ApiOperation("通过标签获取对应的话题")
    @GetMapping("/getTopicsByTags")
    public R<List<Topic>> getTopicsByTags(HttpServletRequest request , @RequestParam(value = "tagsName") List<String> tagsName){
        String username = (String)request.getSession().getAttribute("username");
        if(username==null){
            return R.error("用户未登录");
        }
        return R.success(topicService.getTopicsByTags(username,tagsName));
    }

    /**
     * 通过关键词查询对应的话题
     * @param keyWord
     * @return
     */
    @ApiOperation("通过关键词查询对应的话题")
    @GetMapping("/searchKeyWord")
    public R<List<Topic>> searchKeyWord(HttpServletRequest request , @RequestParam(value = "keyWord") String keyWord){
        log.info("关键词查询，{}",keyWord);
        String username = (String)request.getSession().getAttribute("username");
        if(username==null){
            return R.error("用户未登录");
        }
        return R.success(topicService.searchKeyWord(username , keyWord));
    }
    @ApiOperation("获取最新的话题")
    @GetMapping("/newTopics")
    public R<List<Topic>> newTopics(){
        log.info("获取最新话题");
        return R.success(topicService.newTopics());
    }
    /**
     * 话题分页展示
     * @param pageQueryDTO
     * @return
     */
    @PostMapping("list")
    @ApiOperation("话题分页展示")
    public R<PageResult> list(HttpServletRequest request,@RequestBody PageQueryDTO pageQueryDTO) {
        log.info("分页查询：{}", pageQueryDTO);
        String username = (String)request.getSession().getAttribute("username");
        PageResult pageResult = topicService.pageQuery(username,pageQueryDTO);
        return R.success(pageResult);
    }
    /**
     * 通过Id获取回复
     * @param request
     * @param repliesId
     * @return
     */
    @ApiOperation("通过Id获取回复")
    @GetMapping("getRepliesById")
    public R<Replies> getRepliesById(HttpServletRequest request , @RequestParam(value = "repliesId") Long repliesId){
        String username = (String)request.getSession().getAttribute("username");
        if(username == null){
            return R.error("用户未登录");
        }
        Replies repliesById = topicService.getRepliesById(username,repliesId);
        return R.success(repliesById);
    }
}
