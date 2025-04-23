package com.zr.uniSoul.service.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.zr.uniSoul.common.PageResult;
import com.zr.uniSoul.mapper.AdminMapper;
import com.zr.uniSoul.mapper.TopicMapper;
import com.zr.uniSoul.pojo.dto.AnalysisImageDTO;
import com.zr.uniSoul.pojo.dto.PageQueryDTO;
import com.zr.uniSoul.pojo.dto.TopicDTO;
import com.zr.uniSoul.pojo.entity.*;
import com.zr.uniSoul.pojo.vo.RepliesLikesVO;
import com.zr.uniSoul.pojo.vo.TopicLikesVO;
import com.zr.uniSoul.pojo.vo.TopicVO;
import com.zr.uniSoul.service.TopicService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.sql.Date;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TopicServiceImpl implements TopicService {
    @Autowired
    private TopicMapper topicMapper;
    @Autowired
    private AdminMapper adminMapper;
    /**
     * 创建话题
     * @param topicDTO
     */
    @Override
    public void createTopic(TopicDTO topicDTO) {
        List<String> tags1 = topicDTO.getTags();
        String[] split = tags1.get(0).strip().split("，");
        List<String> list = Arrays.asList(split);
        topicDTO.setTags(list);
        topicMapper.createTopic(topicDTO);
        long topicId = topicDTO.getId();//获取已经存入数据库的主键值
        List<Tags> allTags = topicMapper.getAllTags();
        List<String> tagString = allTags.stream().map(Tags::getName).collect(Collectors.toList());
        for (String tags : topicDTO.getTags()) {
            Tags tag = new Tags();
            if(tagString.contains(tags)){
                topicMapper.createConnection(topicId,topicMapper.getTagId(tags));
            }else {
                tag.setName(tags);
                topicMapper.addTag(tag);
                topicMapper.createConnection(topicId, tag.getId());
            }
        }
    }
    /**
     * 评论
     * @param replies
     * @return
     */
    @Override
    public void replies(Replies replies) {
        topicMapper.addRepiles(replies);
    }

    /**
     * 获取话题
     * @return
     */
    @Override
    public List<TopicDTO> allTopic() {
        List<TopicDTO> allTopic = topicMapper.getAllTopic();
        log.info("allTopic:{}",allTopic);
        allTopic.forEach(topic -> {
            List<Tags> tags = topicMapper.getTags(topic.getId());
            log.info("tags:{}",tags);
            topic.setTags(new ArrayList<>());
            tags.forEach(tag -> {
                topic.getTags().add(tag.getName());
            });
            if(topic.isAnonymous()){
                topic.setUsername("anonymousUser");
            }
        });
        return allTopic;
    }

    /**
     * 获取回复
     * @param topicId
     * @return
     */
    @Override
    public List<Replies> getReplies(Long topicId) {
        List<Replies> replies = topicMapper.getReplies(topicId);
        replies.forEach(reply -> {
            Boolean b = topicMapper.inquireLikeRepliesStatus(reply.getUsername(), reply.getId());
            if(b==null){
                b = false;
            }
            reply.setLike(b);
            if(reply.isAnonymous()){
                reply.setUsername("anonymousUser");
            }else {
                reply.setAvatarUrl(topicMapper.getAvatarUrl(reply.getUsername()));
            }
        });
        return replies;
    }

    /**
     * 点赞
     * @param username
     * @param topicId
     * @param likeCount
     * @param isLike
     * @return
     */
    @Override
    public TopicLikesVO like(String username, long topicId, long likeCount, boolean isLike) {
        Boolean b = topicMapper.inquireLikeStatus(username, topicId);
        if(b==null){
            isLike = false;//如果数据库中没有该用户点赞记录，则默认为未点赞
        }
        if(isLike == true){
            likeCount--;
            isLike = false;
        }else {
            likeCount++;
            isLike = true;
        }
        topicMapper.like(username, topicId, isLike);
        topicMapper.setTopicLikeCount(topicId,likeCount);
        TopicLikesVO like = new TopicLikesVO();
        like.setUsername(username);
        like.setTopicId(topicId);
        like.setLike(isLike);
        like.setLikesCount(likeCount);
        return like;
    }

    /**
     * 获取总的点赞数
     * @return
     */
    @Override
    public Long allLikeCounts() {
        return topicMapper.allLikeCounts();
    }

    /**
     * 获取总的话题数
     * @return
     */
    @Override
    public Long allTopicCounts() {
        return topicMapper.allTopicCounts();
    }

    /**
     * 获取总的评论数量
     * @return
     */
    @Override
    public Long allRepliesCounts() {
        return topicMapper.allRepliesCounts();
    }

    /**
     * 根据用户名获取用户的评论
     * @param username
     * @return
     */
    @Override
    public List<Replies> getRepliesByUsername(String username) {
        return topicMapper.getRepliesByUsername(username);
    }

    /**
     * 获取话题详情
     * @param topicId
     * @return
     */
    @Override
    public Topic getTopicInformation(Long topicId) {
        topicMapper.addViews(topicId);
        TopicDTO topicDTO = topicMapper.getTopicInformation(topicId);
        Topic topic = new Topic();
        BeanUtils.copyProperties(topicDTO,topic);
        List<Tags> tags = topicMapper.getTags(topicId);
        List<String> tagsName = tags.stream().map(Tags::getName).collect(Collectors.toList());
        topic.setTags(tagsName);
        List<Replies> repliesList = topicMapper.getReplies(topicId);
        topic.setReplies(repliesList);
        Boolean b = topicMapper.inquireLikeStatus(topic.getUsername(), topicId);
        if(topic.isAnonymous()){
            topic.setAvatarUrl("anonymousPicture");
        }else {
            topic.setAvatarUrl(topicMapper.getAvatarUrl(topic.getUsername()));
        }
        if(b == null){
            b = false;
        }
        topic.setLike(b);
        log.info("topic:{}",topic);
        return topic;
    }

    /**
     * 删除话题
     * @param username
     */
    @Override
    public boolean deleteTopic(String username, Long topicId) {
        boolean judge = topicMapper.deleteTopic(username, topicId);
        if(judge){
            topicMapper.deleteTopicConnectionReplies(topicId);
            topicMapper.deleteTopicConnectionTags(topicId);
            topicMapper.deleteTopicConnectionTags(topicId);
            return true;
        }
        return false;
    }

    /**
     * 删除回复
     * @param username
     * @param id
     * @return
     */
    @Override
    public boolean deleteReplies(String username, Long id) {
        return topicMapper.deleteReplies(username,id);
    }

    /**
     * 获取所有标签
     * @return
     */
    @Override
    public List<String> AllTags() {
        return topicMapper.AllTags();
    }

    /**
     * 根据标签获取话题
     *
     * @param username
     * @param tags
     * @return
     */
    @Override
    public List<Topic> getTopicsByTags(String username, List<String> tags) {
        List<Topic> topicsByTags = topicMapper.getTopicsByTags(tags);
        topicsByTags.forEach(topic -> {
            Boolean b = topicMapper.inquireLikeStatus(username, topic.getId());
            if(b == null){
                b = false;
            }
            topic.setLike(b);
            topic.setAvatarUrl(topicMapper.getAvatarUrl(topic.getUsername()));
        });
        return topicsByTags;
    }

    /**
     * 关键字查询
     *
     * @param username
     * @param keyWord
     * @return
     */
    @Override
    public List<Topic> searchKeyWord(String username, String keyWord) {
        List<Topic> topics = topicMapper.searchKeyWord(keyWord);
        topics.forEach(topic -> {
            Boolean b = topicMapper.inquireLikeStatus(username, topic.getId());
            if(b == null){
                b = false;
            }
            topic.setLike(b);
            topic.setAvatarUrl(topicMapper.getAvatarUrl(topic.getUsername()));
        });
        return topics;
    }

    /**
     * 获取最新的话题
     * @return
     */
    @Override
    public List<Topic> newTopics() {
        return topicMapper.newTopics();
    }
    /**
     * 话题分页展示已登录
     * @param username
     * @param pageQueryDTO
     * @return
     */
    @Override
    public PageResult pageQuery(String username , PageQueryDTO pageQueryDTO) {
        PageHelper.startPage(pageQueryDTO.getPage(), pageQueryDTO.getPageSize());
        Page<TopicVO> page = null;
        if(username == "admin"){
            page = topicMapper.pageQuery(pageQueryDTO);
        }else {
            page = topicMapper.pageQueryStatus(pageQueryDTO);
        }
        page.forEach(topicVO -> {
            List<Tags> tags = topicMapper.getTags(topicVO.getId());
            List<String> tagsName = tags.stream().map(Tags::getName).collect(Collectors.toList());
            topicVO.setTags(tagsName);
            Boolean b = topicMapper.inquireLikeStatus(username, topicVO.getId());
            if(b == null){
                b = false;
            }
            topicVO.setLike(b);
            if(topicVO.isAnonymous()){
                topicVO.setAvatarUrl("anonymousPicture");
            }else {
                topicVO.setAvatarUrl(topicMapper.getAvatarUrl(topicVO.getUsername()));
            }
        });
        if (page == null) {
            // 返回一个空的PageResult或者抛出自定义异常
            return new PageResult(0, new ArrayList<>()); // 假设PageResult的构造函数接受total和result列表作为参数
            // 或者
            // throw new CustomException("No comments found");
        }

        return new PageResult(page.getTotal(), page.getResult());
    }

    /**
     * 点赞话题回复
     * @param username
     * @param repliesId
     * @param likeCount
     * @param isLike
     * @return
     */
    @Override
    public RepliesLikesVO likeReplies(String username, long repliesId, long likeCount, boolean isLike) {
        Boolean b = topicMapper.inquireLikeRepliesStatus(username, repliesId);
        System.out.println("b="+b);
        if(b == null){
            b = false;
        }
        if(b){
            likeCount--;
            isLike = false;
        }else {
            likeCount++;
            isLike = true;
        }
        topicMapper.likeReplies(username, repliesId, isLike);
        topicMapper.setTopicRepliesLikeCount(repliesId,likeCount);
        RepliesLikesVO repliesLikesVO = new RepliesLikesVO();
        repliesLikesVO.setLikeCount(likeCount);
        repliesLikesVO.setLike(isLike);
        repliesLikesVO.setRepliesId(repliesId);
        return repliesLikesVO;
    }

    /**
     * 通过评论的Id获取评论
     * @param username
     * @param repliesId
     * @return
     */
    @Override
    public Replies getRepliesById(String username , Long repliesId) {
        Replies repliesById = topicMapper.getRepliesById(repliesId);
        Boolean b = topicMapper.inquireLikeRepliesStatus(username, repliesId);
        if(b == null){
            b = false;
        }
        repliesById.setLike(b);
        return repliesById;
    }

    /**
     * 获取话题评论分页展示
     * @param username
     * @param pageQueryDTO
     * @return
     */
    @Override
    public PageResult pageQueryReplies(String username, PageQueryDTO pageQueryDTO) {
        PageHelper.startPage(pageQueryDTO.getPage(), pageQueryDTO.getPageSize());
        Page<Replies> page = topicMapper.pageQueryReplies(pageQueryDTO);
        log.info("page={}", page);
        if (page == null) {
            // 返回一个空的PageResult或者抛出自定义异常
            return new PageResult(0, new ArrayList<>()); // 假设PageResult的构造函数接受total和result列表作为参数
            // 或者
            // throw new CustomException("No comments found");
        }
        log.info("page.getResult={}", page.getResult());
        page.forEach(replies ->{
            if(replies != null) {
                System.out.println(replies.getId());
                Boolean b = topicMapper.inquireLikeRepliesStatus(username, replies.getId());
                if(b == null){
                    b = false;
                }
                replies.setLike(b);
                replies.setAvatarUrl(topicMapper.getAvatarUrl(replies.getUsername()));
            }
        });

        return new PageResult(page.getTotal(), page.getResult());
    }

    /**
     * 获取近期热门话题
     * @return
     */
    @Override
    public List<Topic> getHotValue() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        //获取到timestamp类型的时间
        Timestamp endTimestamp = new Timestamp(System.currentTimeMillis());
        //获取当前时间的前一周
        Timestamp startTimestamp = new Timestamp(endTimestamp.getTime() - 15 * 24 * 60 * 60 * 1000);
        List<Topic> hotTopics = adminMapper.getHotTopics(startTimestamp, endTimestamp);
        log.info("hotTopics:{}",hotTopics);
        return hotTopics;
    }

    /**
     * 根据用户名获取话题
     * @param username
     * @return
     */
    @Override
    public List<Topic> getTopicsByUsername(String username) {
        List<Topic> topicsByUsername = topicMapper.getTopicsByUsername(username);
        topicsByUsername.forEach(topic ->{
            List<String> tags = topicMapper.getTags(topic.getId()).stream().map(Tags::getName).collect(Collectors.toList());
            topic.setTags(tags);
        });
        return topicsByUsername;
    }

    /**
     * 根据文本内容生成词云分析结果
     * @param analysisImageDTO
     * @return
     */
    @Override
    public String getWordCloudAnalysis(AnalysisImageDTO analysisImageDTO) {
        String url = "http://localhost:8081/process"; // 假设 Flask 应用监听在本地的 5000 端口上

        // 构造请求参数
        JsonObject data = new JsonObject();
        data.addProperty("text", analysisImageDTO.getText());
        data.addProperty("width", analysisImageDTO.getWidth());
        data.addProperty("height", analysisImageDTO.getHeight());
        data.addProperty("maxWords", analysisImageDTO.getMaxWords());

        try {
            // 发送 POST 请求
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json");

            // 将参数写入请求体
            con.setDoOutput(true);
            OutputStream os = con.getOutputStream();
            os.write(new Gson().toJson(data).getBytes("utf-8"));
            os.flush();
            os.close();
            log.info("请求："+con);
            // 处理响应结果
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer response = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            // 解析 JSON 数据
            JsonObject processedData = new Gson().fromJson(response.toString(), JsonObject.class);
            // 解析JSON
            System.out.println(processedData);
            return response.toString();
        } catch (Exception e) {
            System.out.println("请求失败：" + e.getMessage());
            return "请求失败";
        }
    }
}
