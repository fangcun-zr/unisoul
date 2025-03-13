package com.zr.uniSoul.mapper;

import com.zr.uniSoul.pojo.dto.TopicDTO;
import com.zr.uniSoul.pojo.entity.Replies;
import com.zr.uniSoul.pojo.entity.Tags;
import com.zr.uniSoul.pojo.entity.Topic;
import com.zr.uniSoul.pojo.vo.TopicLikesVO;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TopicMapper {
    /**
     * 创建话题
     * @param topicDTO
     */
    @Insert("INSERT INTO topics (title, content, anonymous, likes, views, username) VALUES (#{title}, #{content}, #{anonymous}, #{likes}, #{views}, #{username})")
    @Options(useGeneratedKeys = true, keyProperty = "id")//在存入数据之后将主键值返回
    void createTopic(TopicDTO topicDTO);

    /**
     * 创建于标签表的连接
     * @param topicId
     * @param id
     */
    @Insert("INSERT INTO topic_tags (topic_id, tag_id) VALUES (#{topicId}, #{id})")
    void createConnection(long topicId, long id);
    /**
     * 添加标签
     * @param tags
     */
    @Insert("INSERT INTO tags(name) VALUES (#{name})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void addTag(Tags tags);

    /**
     * 评论
     * @param replies
     * @return
     */
    @Insert("INSERT INTO replies (topic_id, username, content,anonymous) VALUES (#{topicId}, #{username}, #{content},#{anonymous})")
    void addRepiles(Replies replies);

    /**
     * 获取所有话题
     */
    @Select("SELECT * FROM topics ORDER BY views DESC")
    List<TopicDTO> getAllTopic();

    /**
     * 获取标签
     * @param id
     * @return
     */
    @Select("SELECT * FROM tags WHERE id IN (SELECT tag_id FROM topic_tags WHERE topic_id = #{id})")
    List<Tags> getTags(long id);

    /**
     * 获取所有的标签
     * @return
     */
    @Select("SELECT * FROM tags")
    List<Tags> getAllTags();

    /**
     * 获取标签id
     * @param tags
     * @return
     */
    @Select("SELECT id FROM tags WHERE name = #{tags}")
    long getTagId(String tags);

    /**
     * 获取回复
     * @param topicId
     */
    @Select("SELECT * FROM replies WHERE topic_id = #{topicId}")
    List<Replies> getReplies(Long topicId);

    /**
     * 点赞
     * 如果数据表中存在相应的用户ID和话题ID
     * 就是只改变纯入的isLike的结果
     * @param username
     * @param topicId
     * @param isLike
     */
    @Insert("INSERT INTO likes_state_topic (username, topic_id, is_like) VALUES (#{username}, #{topicId}, #{isLike}) ON DUPLICATE KEY UPDATE is_like = #{isLike}")
    void like(String username, long topicId, boolean isLike);

    /**
     * 设置点赞数
     * @param topicId
     * @param likeCount
     * @return
     */
    @Select("UPDATE topics SET likes = #{likeCount} WHERE id = #{topicId}")
    void setTopicLikeCount(long topicId, long likeCount);

    /**
     * 查询点赞状态
     * @param username
     * @param topicId
     */
    @Select("SELECT is_like FROM likes_state_topic WHERE username = #{username} AND topic_id = #{topicId}")
    Boolean inquireLikeStatus(String username, long topicId);
    /**
     * 获取所有点赞数
     * @return
     */
    @Select("SELECT SUM(likes) FROM topics")
    Long allLikeCounts();

    /**
     * 获取所有话题数
     * @return
     */
    @Select("SELECT COUNT(*) FROM topics")
    Long allTopicCounts();

    /**
     * 获取所有回复数
     * @return
     */
    @Select("SELECT COUNT(*) FROM replies")
    Long allRepliesCounts();

    /**
     * 获取用户的评论
     * @param username
     * @return
     */
    @Select("SELECT * FROM replies WHERE username = #{username}")
    List<Replies> getRepliesByUsername(String username);

    /**
     * 获取话题信息
     * @param topicId
     * @return
     */
    @Select("SELECT * FROM topics WHERE id = #{topicId}")
    TopicDTO getTopicInformation(Long topicId);

    /**
     * 删除话题
     * @param username
     * @param id
     */
    @Delete("DELETE FROM topics WHERE (id = #{id} AND (username = #{username} OR (SELECT 1 FROM user WHERE username = #{username} AND isAdmin = 1)))")
    boolean deleteTopic(String username, Long id);

    /**
     * 删除回复
     * @param username
     * @param id
     * @return
     */
    @Delete("DELETE FROM replies WHERE (id = #{id} AND (username = #{username} OR (SELECT 1 FROM user WHERE username = #{username} AND isAdmin = 1)))")
    boolean deleteReplies(String username, Long id);

    /**
     * 查询用户的身份
     * @param username
     * @return
     */
    @Select("SELECT isAdmin FROM user WHERE username = #{username}")
    Integer inquireIdentity(String username);

    /**
     * 删除和话题相关的评论
     * @param topicId
     */
    @Delete("DELETE FROM replies WHERE topic_id = #{topicId}")
    void deleteTopicConnectionReplies(Long topicId);

    /**
     * 删除话题相关的标签
     * @param topicId
     */
    @Delete("DELETE FROM topic_tags WHERE topic_id = #{topicId}")
    void deleteTopicConnectionTags(Long topicId);

    /**
     * 获取所有标签
     * @return
     */
    @Select("SELECT name FROM tags")
    List<String> AllTags();
    /**
     * 根据标签获取话题
     * @param tags
     */
    @Select("SELECT * FROM topics WHERE id IN (SELECT topic_tags.topic_id FROM topic_tags WHERE tag_id IN (SELECT id FROM tags WHERE name IN (#{tags})))")
    List<Topic> getTopicsByTags(List<String> tags);

    /**
     * 关键词查询
     * @param keyWord
     * @return
     */
    @Select("SELECT * FROM topics WHERE title LIKE CONCAT('%', #{keyWord}, '%')")
    List<Topic> searchKeyWord(String keyWord);

    /**
     * 获取最新的话题
     * @return
     */
    @Select("SELECT * FROM topics ORDER BY create_time DESC LIMIT 10")
    List<Topic> newTopics();
}
