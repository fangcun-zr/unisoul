create table article_comment
(
    id          int auto_increment comment '评论ID'
        primary key,
    article_id  int                  not null comment '文章ID',
    user_id     bigint               not null comment '评论用户ID',
    content     text                 not null comment '评论内容',
    create_time datetime             not null comment '评论时间',
    update_time datetime             not null comment '更新时间',
    is_deleted  tinyint(1) default 0 not null comment '是否删除(0-未删除 1-已删除)',
    constraint article_comment_ibfk_1
        foreign key (article_id) references article (id)
)
    comment '文章评论表' charset = utf8mb4;

create index idx_article_id
    on article_comment (article_id);

create index idx_create_time
    on article_comment (create_time);

create index idx_user_id
    on article_comment (user_id);

