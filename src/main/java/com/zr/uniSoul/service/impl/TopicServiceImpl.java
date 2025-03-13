package com.zr.uniSoul.service.impl;

import com.zr.uniSoul.mapper.TopicMapper;
import com.zr.uniSoul.pojo.dto.TopicDTO;
import com.zr.uniSoul.pojo.entity.Replies;
import com.zr.uniSoul.pojo.entity.Tags;
import com.zr.uniSoul.pojo.entity.Topic;
import com.zr.uniSoul.pojo.vo.TopicLikesVO;
import com.zr.uniSoul.pojo.vo.TopicVO;
import com.zr.uniSoul.service.TopicService;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TopicServiceImpl implements TopicService {
    @Autowired
    private TopicMapper topicMapper;
    /**
     * 创建话题
     * @param topicDTO
     */
    @Override
    public void createTopic(TopicDTO topicDTO) {
        log.info("topic:{}",topicDTO);
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
        return topicMapper.getReplies(topicId);
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
        topicMapper.like(username, topicId, isLike);
        if(isLike == true){
            likeCount--;
        }else likeCount++;
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
     * 根据用户名获取用户的话题
     * @param topicId
     * @return
     */
    @Override
    public Topic getTopicInformation(Long topicId) {
        TopicDTO topicDTO = topicMapper.getTopicInformation(topicId);
        Topic topic = new Topic();
        BeanUtils.copyProperties(topicDTO,topic);
        List<Tags> tags = topicMapper.getTags(topicId);
        List<String> tagsName = tags.stream().map(Tags::getName).collect(Collectors.toList());
        topic.setTags(tagsName);
        List<Replies> repliesList = topicMapper.getReplies(topicId);
        topic.setReplies(repliesList);
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
     * @param tags
     * @return
     */
    @Override
    public List<Topic> getTopicsByTags(List<String> tags) {
        return  topicMapper.getTopicsByTags(tags);
    }

    /**
     * 关键字查询
     * @param keyWord
     * @return
     */
    @Override
    public List<Topic> searchKeyWord(String keyWord) {
        return topicMapper.searchKeyWord(keyWord);
    }

    /**
     * 获取最新的话题
     * @return
     */
    @Override
    public List<Topic> newTopics() {
        return topicMapper.newTopics();
    }
}
