create table test_categories
(
    id          bigint auto_increment
        primary key,
    created_at  datetime     null,
    description varchar(500) null,
    name        varchar(255) not null
);

