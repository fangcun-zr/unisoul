create table questions
(
    id          bigint auto_increment
        primary key,
    content     varchar(255) not null,
    order_index int          not null,
    test_id     bigint       null,
    constraint FKeupvv5xdotrha8gevkovl425c
        foreign key (test_id) references psych_tests (id)
);

