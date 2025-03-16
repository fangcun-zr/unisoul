package generator.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.util.Date;
import lombok.Data;

/**
 * 统计表
 * @TableName statistics
 */
@TableName(value ="statistics")
@Data
public class Statistics {
    /**
     * 统计ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 在线用户数
     */
    private Integer online_users;

    /**
     * 今日帖子数
     */
    private Integer today_posts;

    /**
     * 今日回复数
     */
    private Integer today_replies;

    /**
     * 互助小组总数
     */
    private Integer total_groups;

    /**
     * 今日交流数
     */
    private Integer today_interactions;

    /**
     * 互助成功数
     */
    private Integer successful_help;

    /**
     * 创建时间
     */
    private Date create_time;

    /**
     * 更新时间
     */
    private Date update_time;

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
        Statistics other = (Statistics) that;
        return (this.getId() == null ? other.getId() == null : this.getId().equals(other.getId()))
            && (this.getOnline_users() == null ? other.getOnline_users() == null : this.getOnline_users().equals(other.getOnline_users()))
            && (this.getToday_posts() == null ? other.getToday_posts() == null : this.getToday_posts().equals(other.getToday_posts()))
            && (this.getToday_replies() == null ? other.getToday_replies() == null : this.getToday_replies().equals(other.getToday_replies()))
            && (this.getTotal_groups() == null ? other.getTotal_groups() == null : this.getTotal_groups().equals(other.getTotal_groups()))
            && (this.getToday_interactions() == null ? other.getToday_interactions() == null : this.getToday_interactions().equals(other.getToday_interactions()))
            && (this.getSuccessful_help() == null ? other.getSuccessful_help() == null : this.getSuccessful_help().equals(other.getSuccessful_help()))
            && (this.getCreate_time() == null ? other.getCreate_time() == null : this.getCreate_time().equals(other.getCreate_time()))
            && (this.getUpdate_time() == null ? other.getUpdate_time() == null : this.getUpdate_time().equals(other.getUpdate_time()));
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((getId() == null) ? 0 : getId().hashCode());
        result = prime * result + ((getOnline_users() == null) ? 0 : getOnline_users().hashCode());
        result = prime * result + ((getToday_posts() == null) ? 0 : getToday_posts().hashCode());
        result = prime * result + ((getToday_replies() == null) ? 0 : getToday_replies().hashCode());
        result = prime * result + ((getTotal_groups() == null) ? 0 : getTotal_groups().hashCode());
        result = prime * result + ((getToday_interactions() == null) ? 0 : getToday_interactions().hashCode());
        result = prime * result + ((getSuccessful_help() == null) ? 0 : getSuccessful_help().hashCode());
        result = prime * result + ((getCreate_time() == null) ? 0 : getCreate_time().hashCode());
        result = prime * result + ((getUpdate_time() == null) ? 0 : getUpdate_time().hashCode());
        return result;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", id=").append(id);
        sb.append(", online_users=").append(online_users);
        sb.append(", today_posts=").append(today_posts);
        sb.append(", today_replies=").append(today_replies);
        sb.append(", total_groups=").append(total_groups);
        sb.append(", today_interactions=").append(today_interactions);
        sb.append(", successful_help=").append(successful_help);
        sb.append(", create_time=").append(create_time);
        sb.append(", update_time=").append(update_time);
        sb.append("]");
        return sb.toString();
    }
}