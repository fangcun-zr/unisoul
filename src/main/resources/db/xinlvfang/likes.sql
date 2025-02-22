create table likes
(
    id                 int(20) unsigned auto_increment comment '主键id'
        primary key,
    article_comment_id int(20)  not null,
    user_id            bigint   not null,
    update_time        datetime null,
    create_time        datetime null,
    constraint article_comment_id
        foreign key (article_comment_id) references article_comment (id),
    constraint user_id
        foreign key (user_id) references user (id)
);

