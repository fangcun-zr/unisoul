create table test_records
(
    id          bigint auto_increment
        primary key,
    created_at  datetime      null,
    result      varchar(1000) null,
    total_score int           not null,
    test_id     bigint        not null,
    user_id     bigint        not null,
    constraint FKg0yoj5amdhxv15otysvldtv4g
        foreign key (test_id) references psych_tests (id),
    constraint FKsesw9sahtd7antyk0bwx619kp
        foreign key (user_id) references user (id)
);

