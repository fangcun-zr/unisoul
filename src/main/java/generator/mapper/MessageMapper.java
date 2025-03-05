package generator.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import generator.domain.Message;
import generator.domain.MessageThread;
import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;
import java.util.Map;

/**
* @author 陈怡帆
* @description 针对表【message】的数据库操作Mapper
* @createDate 2025-03-01 00:43:09
* @Entity generator.domain.Message
*/
public interface MessageMapper extends BaseMapper<Message> {

    // 查询会话基础信息（分页）
//    Page<MessageThread> selectThreadBaseInfo(
//            @Param("currentUserId") Long currentUserId, // 使用 @Param 注解
//            @Param("page") Page<Message> page
//    );
    // Mapper 接口修正
//    Page<MessageThread> selectThreadBaseInfo(@Param("currentUserId") Long currentUserId);
    @Update("UPDATE message SET is_deleted = 1 WHERE id = #{id} AND is_deleted = 0")
    int updateById(@Param("id") Long id);


    // Mapper 接口
    Page<MessageThread> selectThreadBaseInfo(
            IPage<MessageThread> page,  // 将 IPage 作为第一个参数
            @Param("currentUserId") Long currentUserId
    );
    // 批量查询未读消息数
    @Select("<script>" +
            "SELECT sender_id AS contactId, COUNT(*) AS unreadCount " +
            "FROM message " +
            "WHERE receiver_id = #{currentUserId} " +
            "AND read_status = 0 " +
            "AND sender_id IN " +
            "<foreach item='item' collection='contactIds' open='(' separator=',' close=')'>" +
            "#{item}" +
            "</foreach>" +
            "GROUP BY sender_id" +
            "</script>")
    @MapKey("contactId")
    Map<Long, Integer> batchSelectUnreadCount(@Param("currentUserId") Long currentUserId,
                                              @Param("contactIds") List<Long> contactIds);

}




