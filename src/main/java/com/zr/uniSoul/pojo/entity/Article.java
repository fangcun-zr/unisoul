package com.zr.uniSoul.pojo.entity;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.Column;
import java.time.LocalDateTime;

/**
 * 文章表对应的 JavaBean 类。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Article {
    /** 文章ID */
    private int id;

    /** 文章标题 */
    private String title;

    /** 文章内容 */
    private String content;

    /** 分类ID (1:心理 2:学习 3:生活 4:就业) */
    private int category_id;

    /** 子分类ID，可以为空 */
    private Integer subCategoryId;

    /** 封面图片URL，可以为空 */
//    @Column(name = "cover_image")
    private String cover_image;

    /** 标签 (逗号分隔)，可以为空 */
    private String tags;

    /** 作者ID */
    private int author_id;

    /** 状态 (draft:草稿 pending:待审核 published:已发布) */
    private int status;

    /** 审核意见，可以为空 */
    private String reviewMessage;

    /** 审核人ID，可以为空 */
    private Integer reviewerId;

    /** 浏览次数，默认为0 */
    private int viewCount;

    /** 点赞数，默认为0 */
    private int likeCount;

    /** 收藏数，默认未0*/
    private int favoriteCount;

    /** 评论数，默认为0 */
    private int commentCount;

    /** 创建时间，默认为当前时间 */
    @Getter
    private LocalDateTime create_time;

    /** 更新时间，默认为当前时间，数据更新时自动更新 */
    private LocalDateTime update_time;

    private MultipartFile file;

    public void setCreateTime() {
        this.create_time = LocalDateTime.now();
    }

    public void setUpdate_time() {
        this.update_time = LocalDateTime.now();
    }
    // Getter and Setter methods...

    // Optional: Override toString() method for easy printing of Article object

}

