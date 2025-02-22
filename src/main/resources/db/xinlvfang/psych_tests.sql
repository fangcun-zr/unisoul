create table psych_tests
(
    id             bigint auto_increment
        primary key,
    created_at     datetime      null,
    description    varchar(1000) null,
    estimated_time int           not null,
    title          varchar(255)  not null,
    category_id    bigint        null,
    constraint FK2lro4x7iktd80rfbn5nri9upq
        foreign key (category_id) references test_categories (id)
);

