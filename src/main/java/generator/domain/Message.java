package generator.domain;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.util.Date;

/**
 * 
 * @TableName message
 */
@TableName(value ="message")
@Data
public class Message {
    /**
     * 消息ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 发送者ID
     */
    @TableField("sender_id") // 显式映射数据库字段
    private Long sender_id;

    /**
     * 接收者ID
     */
    @TableField("receiver_id") // 显式映射数据库字段
    private Long receiver_id;

    /**
     * 消息内容
     */
    @TableField("content")
    private String content;

    /**
     * 发送时间
     */
    @TableField("send_time") // 显式映射数据库字段
    private Date send_time;

    /**
     * 0未读 1已读
     */
    @TableField("read_status") // 显式映射数据库字段
    private Integer read_status;

    /**
     * 父消息ID（支持回复）
     */
    @TableField("parent_id") // 显式映射数据库字段
    private Long parent_id;

    /**
     * 逻辑删除字段（0未删除 1已删除）
     */
    @TableLogic // 标记为逻辑删除字段
    @TableField("is_deleted") // 显式映射数据库字段
    private Integer isDeleted;

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
        Message other = (Message) that;
        return (this.getId() == null ? other.getId() == null : this.getId().equals(other.getId()))
            && (this.getSender_id() == null ? other.getSender_id() == null : this.getSender_id().equals(other.getSender_id()))
            && (this.getReceiver_id() == null ? other.getReceiver_id() == null : this.getReceiver_id().equals(other.getReceiver_id()))
            && (this.getContent() == null ? other.getContent() == null : this.getContent().equals(other.getContent()))
            && (this.getSend_time() == null ? other.getSend_time() == null : this.getSend_time().equals(other.getSend_time()))
            && (this.getRead_status() == null ? other.getRead_status() == null : this.getRead_status().equals(other.getRead_status()))
            && (this.getParent_id() == null ? other.getParent_id() == null : this.getParent_id().equals(other.getParent_id()));
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((getId() == null) ? 0 : getId().hashCode());
        result = prime * result + ((getSender_id() == null) ? 0 : getSender_id().hashCode());
        result = prime * result + ((getReceiver_id() == null) ? 0 : getReceiver_id().hashCode());
        result = prime * result + ((getContent() == null) ? 0 : getContent().hashCode());
        result = prime * result + ((getSend_time() == null) ? 0 : getSend_time().hashCode());
        result = prime * result + ((getRead_status() == null) ? 0 : getRead_status().hashCode());
        result = prime * result + ((getParent_id() == null) ? 0 : getParent_id().hashCode());
        return result;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", id=").append(id);
        sb.append(", sender_id=").append(sender_id);
        sb.append(", receiver_id=").append(receiver_id);
        sb.append(", content=").append(content);
        sb.append(", send_time=").append(send_time);
        sb.append(", read_status=").append(read_status);
        sb.append(", parent_id=").append(parent_id);
        sb.append("]");
        return sb.toString();
    }
}