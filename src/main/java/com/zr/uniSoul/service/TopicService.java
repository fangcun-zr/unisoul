package com.zr.uniSoul.service;

import com.zr.uniSoul.pojo.dto.TopicDTO;
import com.zr.uniSoul.pojo.entity.Replies;
import com.zr.uniSoul.pojo.entity.Topic;
import com.zr.uniSoul.pojo.vo.TopicLikesVO;
import com.zr.uniSoul.pojo.vo.TopicVO;

import java.util.List;

public interface TopicService {
    /**
     * 创建话题
     * @param topicDTO
     */
    void createTopic(TopicDTO topicDTO);
    /**
     * 评论
     * @param replies
     * @return
     */
    void replies(Replies replies);

    /**
     * 获取话题
     * @return
     */
    List<TopicDTO> allTopic();

    /**
     * 获取回复
     * @param topicId
     * @return
     */
    List<Replies> getReplies(Long topicId);

    /**
     * 点赞
     * @param username
     * @param topicId
     * @param likeCount
     * @param isLike
     * @return
     */
    TopicLikesVO like(String username, long topicId, long likeCount, boolean isLike);

    /**
     * 获取总的点赞数
     * @return
     */
    Long allLikeCounts();

    /**
     * 获取总的话题数
     * @return
     */
    Long allTopicCounts();

    /**
     * 获取总的评论数量
     * @return
     */
    Long allRepliesCounts();

    /**
     * 获取我的评论
     * @param username
     * @return
     */
    List<Replies> getRepliesByUsername(String username);
    /**
     * 获取话题信息
     * @param topicId
     * @return
     */
    Topic getTopicInformation(Long topicId);

    /**
     * 删除话题
     * @param username
     */
    boolean deleteTopic(String username,Long topicId);

    /**
     *  删除回复
     * @param username
     * @param id
     * @return
     */
    boolean deleteReplies(String username, Long id);

    /**
     * 获取所有标签
     * @return
     */
    List<String> AllTags();

    /**
     * 根据标签获取话题
     * @param tags
     * @return
     */
    List<Topic> getTopicsByTags(List<String> tags);

    /**
     * 关键词查询
     * @param keyWord
     * @return
     */
    List<Topic> searchKeyWord(String keyWord);

    /**
     * 获取最新的话题
     * @return
     */
    List<Topic> newTopics();
}
