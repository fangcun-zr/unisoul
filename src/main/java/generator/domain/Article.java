package generator.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

/**
 * 文章表
 * @TableName article
 */
@TableName(value ="article")
@Data
public class Article {
    /**
     * 文章ID
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 文章标题
     */
    private String title;

    /**
     * 文章内容
     */
    private String content;

    /**
     * 分类ID(1:心理 2:学习 3:生活 4:就业)
     */
    private Integer category_id;

    /**
     * 子分类ID
     */
    private Integer sub_category_id;

    /**
     * 封面图片URL
     */
    private String cover_image;

    /**
     * 标签(逗号分隔)
     */
    private String tags;

    /**
     * 作者ID
     */
    private Integer author_id;

    /**
     * 0：审核不通过，1：审核通过
     */
    private Integer status;

    /**
     * 审核意见
     */
    private String review_message;

    /**
     * 审核人ID
     */
    private Integer reviewer_id;

    /**
     * 浏览次数
     */
    private Integer view_count;

    /**
     * 点赞数
     */
    private Integer like_count;

    /**
     * 评论数
     */
    private Integer comment_count;

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
        Article other = (Article) that;
        return (this.getId() == null ? other.getId() == null : this.getId().equals(other.getId()))
            && (this.getTitle() == null ? other.getTitle() == null : this.getTitle().equals(other.getTitle()))
            && (this.getContent() == null ? other.getContent() == null : this.getContent().equals(other.getContent()))
            && (this.getCategory_id() == null ? other.getCategory_id() == null : this.getCategory_id().equals(other.getCategory_id()))
            && (this.getSub_category_id() == null ? other.getSub_category_id() == null : this.getSub_category_id().equals(other.getSub_category_id()))
            && (this.getCover_image() == null ? other.getCover_image() == null : this.getCover_image().equals(other.getCover_image()))
            && (this.getTags() == null ? other.getTags() == null : this.getTags().equals(other.getTags()))
            && (this.getAuthor_id() == null ? other.getAuthor_id() == null : this.getAuthor_id().equals(other.getAuthor_id()))
            && (this.getStatus() == null ? other.getStatus() == null : this.getStatus().equals(other.getStatus()))
            && (this.getReview_message() == null ? other.getReview_message() == null : this.getReview_message().equals(other.getReview_message()))
            && (this.getReviewer_id() == null ? other.getReviewer_id() == null : this.getReviewer_id().equals(other.getReviewer_id()))
            && (this.getView_count() == null ? other.getView_count() == null : this.getView_count().equals(other.getView_count()))
            && (this.getLike_count() == null ? other.getLike_count() == null : this.getLike_count().equals(other.getLike_count()))
            && (this.getComment_count() == null ? other.getComment_count() == null : this.getComment_count().equals(other.getComment_count()))
            && (this.getCreate_time() == null ? other.getCreate_time() == null : this.getCreate_time().equals(other.getCreate_time()))
            && (this.getUpdate_time() == null ? other.getUpdate_time() == null : this.getUpdate_time().equals(other.getUpdate_time()));
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((getId() == null) ? 0 : getId().hashCode());
        result = prime * result + ((getTitle() == null) ? 0 : getTitle().hashCode());
        result = prime * result + ((getContent() == null) ? 0 : getContent().hashCode());
        result = prime * result + ((getCategory_id() == null) ? 0 : getCategory_id().hashCode());
        result = prime * result + ((getSub_category_id() == null) ? 0 : getSub_category_id().hashCode());
        result = prime * result + ((getCover_image() == null) ? 0 : getCover_image().hashCode());
        result = prime * result + ((getTags() == null) ? 0 : getTags().hashCode());
        result = prime * result + ((getAuthor_id() == null) ? 0 : getAuthor_id().hashCode());
        result = prime * result + ((getStatus() == null) ? 0 : getStatus().hashCode());
        result = prime * result + ((getReview_message() == null) ? 0 : getReview_message().hashCode());
        result = prime * result + ((getReviewer_id() == null) ? 0 : getReviewer_id().hashCode());
        result = prime * result + ((getView_count() == null) ? 0 : getView_count().hashCode());
        result = prime * result + ((getLike_count() == null) ? 0 : getLike_count().hashCode());
        result = prime * result + ((getComment_count() == null) ? 0 : getComment_count().hashCode());
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
        sb.append(", title=").append(title);
        sb.append(", content=").append(content);
        sb.append(", category_id=").append(category_id);
        sb.append(", sub_category_id=").append(sub_category_id);
        sb.append(", cover_image=").append(cover_image);
        sb.append(", tags=").append(tags);
        sb.append(", author_id=").append(author_id);
        sb.append(", status=").append(status);
        sb.append(", review_message=").append(review_message);
        sb.append(", reviewer_id=").append(reviewer_id);
        sb.append(", view_count=").append(view_count);
        sb.append(", like_count=").append(like_count);
        sb.append(", comment_count=").append(comment_count);
        sb.append(", create_time=").append(create_time);
        sb.append(", update_time=").append(update_time);
        sb.append("]");
        return sb.toString();
    }
}