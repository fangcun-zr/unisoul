package generator.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.util.Date;
import lombok.Data;

/**
 * 小组表
 * @TableName groups
 */
@TableName(value ="group_info")
@Data
public class Groups {
    /**
     * 小组ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 小组名称
     */
    private String name;

    /**
     * 小组描述
     */
    private String description;

    /**
     * 创建者用户ID
     */
    private Long creator_id;

    /**
     * 小组头像URL
     */
    private String avatar_url;

    /**
     * 成员数量
     */
    private Integer member_count;

    /**
     * 话题数量
     */
    private Integer topic_count;

    /**
     * 小组状态（0:关闭，1:正常，2:审核中）
     */
    private Integer status;

    /**
     * 创建时间
     */
    private Date create_time;

    /**
     * 更新时间
     */
    private Date update_time;

    /**
     * 删除标记（0:未删除，1:已删除）
     */
    private Integer is_deleted;

    @Override
    public boolean equals(Object that) {
        if (this == that) {
            return true;
        }
        if (that == null) {
            return false;
        }
        if (getClass() != that.getClass()) {
            return false;
        }
        Groups other = (Groups) that;
        return (this.getId() == null ? other.getId() == null : this.getId().equals(other.getId()))
            && (this.getName() == null ? other.getName() == null : this.getName().equals(other.getName()))
            && (this.getDescription() == null ? other.getDescription() == null : this.getDescription().equals(other.getDescription()))
            && (this.getCreator_id() == null ? other.getCreator_id() == null : this.getCreator_id().equals(other.getCreator_id()))
            && (this.getAvatar_url() == null ? other.getAvatar_url() == null : this.getAvatar_url().equals(other.getAvatar_url()))
            && (this.getMember_count() == null ? other.getMember_count() == null : this.getMember_count().equals(other.getMember_count()))
            && (this.getTopic_count() == null ? other.getTopic_count() == null : this.getTopic_count().equals(other.getTopic_count()))
            && (this.getStatus() == null ? other.getStatus() == null : this.getStatus().equals(other.getStatus()))
            && (this.getCreate_time() == null ? other.getCreate_time() == null : this.getCreate_time().equals(other.getCreate_time()))
            && (this.getUpdate_time() == null ? other.getUpdate_time() == null : this.getUpdate_time().equals(other.getUpdate_time()))
            && (this.getIs_deleted() == null ? other.getIs_deleted() == null : this.getIs_deleted().equals(other.getIs_deleted()));
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((getId() == null) ? 0 : getId().hashCode());
        result = prime * result + ((getName() == null) ? 0 : getName().hashCode());
        result = prime * result + ((getDescription() == null) ? 0 : getDescription().hashCode());
        result = prime * result + ((getCreator_id() == null) ? 0 : getCreator_id().hashCode());
        result = prime * result + ((getAvatar_url() == null) ? 0 : getAvatar_url().hashCode());
        result = prime * result + ((getMember_count() == null) ? 0 : getMember_count().hashCode());
        result = prime * result + ((getTopic_count() == null) ? 0 : getTopic_count().hashCode());
        result = prime * result + ((getStatus() == null) ? 0 : getStatus().hashCode());
        result = prime * result + ((getCreate_time() == null) ? 0 : getCreate_time().hashCode());
        result = prime * result + ((getUpdate_time() == null) ? 0 : getUpdate_time().hashCode());
        result = prime * result + ((getIs_deleted() == null) ? 0 : getIs_deleted().hashCode());
        return result;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", id=").append(id);
        sb.append(", name=").append(name);
        sb.append(", description=").append(description);
        sb.append(", creator_id=").append(creator_id);
        sb.append(", avatar_url=").append(avatar_url);
        sb.append(", member_count=").append(member_count);
        sb.append(", topic_count=").append(topic_count);
        sb.append(", status=").append(status);
        sb.append(", create_time=").append(create_time);
        sb.append(", update_time=").append(update_time);
        sb.append(", is_deleted=").append(is_deleted);
        sb.append("]");
        return sb.toString();
    }
}