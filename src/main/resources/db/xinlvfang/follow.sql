create table follow
(
    follower_id  bigint                              not null comment '被关注者',
    following_id bigint                              not null comment '关注者',
    created_at   timestamp default CURRENT_TIMESTAMP not null,
    constraint follower_id
        unique (follower_id, following_id),
    constraint follow_ibfk_1
        foreign key (follower_id) references user (id)
            on delete cascade,
    constraint follow_ibfk_2
        foreign key (following_id) references user (id)
            on delete cascade
);

create index following_id
    on follow (following_id);

