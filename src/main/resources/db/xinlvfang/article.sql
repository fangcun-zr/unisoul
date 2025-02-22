create table article
(
    id              int auto_increment comment '文章ID'
        primary key,
    title           varchar(255)      not null comment '文章标题',
    content         text              not null comment '文章内容',
    category_id     int               not null comment '分类ID(1:心理 2:学习 3:生活 4:就业)',
    sub_category_id int               null comment '子分类ID',
    cover_image     varchar(255)      null comment '封面图片URL',
    tags            varchar(255)      null comment '标签(逗号分隔)',
    author_id       int               not null comment '作者ID',
    status          int(20) default 0 not null comment '0：审核不通过，1：审核通过',
    review_message  varchar(500)      null comment '审核意见',
    reviewer_id     int               null comment '审核人ID',
    view_count      int     default 0 null comment '浏览次数',
    like_count      int     default 0 null comment '点赞数',
    comment_count   int     default 0 null comment '评论数',
    create_time     datetime          null comment '创建时间',
    update_time     datetime          null comment '更新时间'
)
    comment '文章表' charset = utf8mb4;

create index idx_author
    on article (author_id);

create index idx_category
    on article (category_id);

create index idx_create_time
    on article (create_time);

create index idx_status
    on article (status);

create index idx_sub_category
    on article (sub_category_id);

