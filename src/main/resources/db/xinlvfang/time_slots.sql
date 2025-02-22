create table time_slots
(
    id            bigint auto_increment
        primary key,
    is_available  bit      null,
    created_at    datetime null,
    end_time      datetime not null,
    start_time    datetime not null,
    consultant_id bigint   not null,
    constraint FKc7le5jbaei1qb9rcse53hbr9h
        foreign key (consultant_id) references user (id)
);

