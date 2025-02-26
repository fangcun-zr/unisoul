package com.zr.uniSoul.pojo.vo;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Data
public class ArticleVO {
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
    private String cover_image;

    /** 标签 (逗号分隔)，可以为空 */
    private String tags;


    /** 状态 (draft:草稿 pending:待审核 published:已发布) */
    private int status;


    /** 浏览次数，默认为0 */
    private int viewCount;

    /** 点赞数，默认为0 */
    private int likeCount;

    /** 评论数，默认为0 */
    private int commentCount;

    /** 创建时间，默认为当前时间 */
    private LocalDateTime create_time;

    /** 更新时间，默认为当前时间，数据更新时自动更新 */
    private LocalDateTime update_time;


}
