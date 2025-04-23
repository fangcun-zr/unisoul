package com.zr.uniSoul.service;

import com.zr.uniSoul.common.PageResult;
import com.zr.uniSoul.pojo.dto.AnalysisImageDTO;
import com.zr.uniSoul.pojo.dto.PageQueryDTO;
import com.zr.uniSoul.pojo.dto.TopicDTO;
import com.zr.uniSoul.pojo.entity.Replies;
import com.zr.uniSoul.pojo.entity.Topic;
import com.zr.uniSoul.pojo.vo.RepliesLikesVO;
import com.zr.uniSoul.pojo.vo.TopicLikesVO;

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
     *
     * @param username
     * @param tags
     * @return
     */
    List<Topic> getTopicsByTags(String username, List<String> tags);

    /**
     * 关键词查询
     *
     * @param username
     * @param keyWord
     * @return
     */
    List<Topic> searchKeyWord(String username, String keyWord);

    /**
     * 获取最新的话题
     * @return
     */
    List<Topic> newTopics();
    /**
     * 分页展示用户的登录
     * @param pageQueryDTO
     * @return
     */
    PageResult pageQuery(String username,PageQueryDTO pageQueryDTO);

    /**
     * 点赞话题的回复
     * @param username
     * @param repliesId
     * @param likeCount
     * @param isLike
     * @return
     */
    RepliesLikesVO likeReplies(String username, long repliesId, long likeCount, boolean isLike);

    /**
     * 通过Id获取评论
     * @param repliesId
     * @return
     */
    Replies getRepliesById(String username , Long repliesId);

    /**
     * 获取话题评论分页展示
     * @param username
     * @param pageQueryDTO
     * @return
     */
    PageResult pageQueryReplies(String username, PageQueryDTO pageQueryDTO);

    /**
     * 获取近期热门话题
     * @return
     */
    List<Topic> getHotValue();

    /**
     * 根据用户名获取话题
     * @param username
     * @return
     */
    List<Topic> getTopicsByUsername(String username);

    String getWordCloudAnalysis(AnalysisImageDTO analysisImageDTO);
}
