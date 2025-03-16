package generator.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.util.Date;
import lombok.Data;

/**
 * 话题表
 * @TableName topics
 */
@TableName(value ="topics")
@Data
public class Topics {
    /**
     * 话题ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 话题标题
     */
    private String title;

    /**
     * 内容
     */
    private String content;

    /**
     * 是否匿名（0:否，1:是）
     */
    private Integer anonymous;

    /**
     * 点赞数
     */
    private Long likes;

    /**
     * 浏览数
     */
    private Long views;

    /**
     * 创建者用户名
     */
    private String username;

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
        Topics other = (Topics) that;
        return (this.getId() == null ? other.getId() == null : this.getId().equals(other.getId()))
            && (this.getTitle() == null ? other.getTitle() == null : this.getTitle().equals(other.getTitle()))
            && (this.getContent() == null ? other.getContent() == null : this.getContent().equals(other.getContent()))
            && (this.getAnonymous() == null ? other.getAnonymous() == null : this.getAnonymous().equals(other.getAnonymous()))
            && (this.getLikes() == null ? other.getLikes() == null : this.getLikes().equals(other.getLikes()))
            && (this.getViews() == null ? other.getViews() == null : this.getViews().equals(other.getViews()))
            && (this.getUsername() == null ? other.getUsername() == null : this.getUsername().equals(other.getUsername()))
            && (this.getCreate_time() == null ? other.getCreate_time() == null : this.getCreate_time().equals(other.getCreate_time()))
            && (this.getUpdate_time() == null ? other.getUpdate_time() == null : this.getUpdate_time().equals(other.getUpdate_time()))
            && (this.getIs_deleted() == null ? other.getIs_deleted() == null : this.getIs_deleted().equals(other.getIs_deleted()));
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((getId() == null) ? 0 : getId().hashCode());
        result = prime * result + ((getTitle() == null) ? 0 : getTitle().hashCode());
        result = prime * result + ((getContent() == null) ? 0 : getContent().hashCode());
        result = prime * result + ((getAnonymous() == null) ? 0 : getAnonymous().hashCode());
        result = prime * result + ((getLikes() == null) ? 0 : getLikes().hashCode());
        result = prime * result + ((getViews() == null) ? 0 : getViews().hashCode());
        result = prime * result + ((getUsername() == null) ? 0 : getUsername().hashCode());
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
        sb.append(", title=").append(title);
        sb.append(", content=").append(content);
        sb.append(", anonymous=").append(anonymous);
        sb.append(", likes=").append(likes);
        sb.append(", views=").append(views);
        sb.append(", username=").append(username);
        sb.append(", create_time=").append(create_time);
        sb.append(", update_time=").append(update_time);
        sb.append(", is_deleted=").append(is_deleted);
        sb.append("]");
        return sb.toString();
    }
}