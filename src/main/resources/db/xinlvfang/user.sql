create table user
(
    id         bigint auto_increment
        primary key,
    created_at datetime     null,
    email      varchar(255) not null,
    password   varchar(255) not null,
    username   varchar(255) not null,
    name       varchar(30)  null,
    age        int(20)      null,
    gender     int(20)      null comment '1:男；2：女',
    school     varchar(30)  null,
    biography  varchar(255) null comment '简介',
    avatarUrl  varchar(255) null comment '头像url'
);

