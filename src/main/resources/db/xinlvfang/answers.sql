create table answers
(
    id                 bigint auto_increment
        primary key,
    question_id        bigint not null,
    selected_option_id bigint not null,
    test_record_id     bigint not null,
    constraint FK2p6lf2j1swcobipb0i08rj58o
        foreign key (test_record_id) references test_records (id),
    constraint FK3erw1a3t0r78st8ty27x6v3g1
        foreign key (question_id) references questions (id),
    constraint FKp4m2qoh4fod5rv9umta5ypb80
        foreign key (selected_option_id) references options (id)
);

