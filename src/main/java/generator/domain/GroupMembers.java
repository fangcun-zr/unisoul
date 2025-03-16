package generator.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.util.Date;

/**
 * 小组成员表
 * @TableName group_members
 */
@TableName(value ="group_members")
@Data
public class GroupMembers {
    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 小组ID
     */
    private Long group_id;

    /**
     * 用户ID
     */
    private Long user_id;

    /**
     * 加入时间
     */
    private Date join_time;

    /**
     * 成员角色（0:普通成员，1:管理员）
     */
    private Integer role;

    /**
     * 成员状态（0:退出，1:正常）
     */
    private Integer status;

    /**
     * 删除标记（0:未删除，1:已删除）
     */
    private Integer is_deleted;
}