create table appointments
(
    id               bigint auto_increment
        primary key,
    appointment_time datetime     not null,
    created_at       datetime     null,
    description      varchar(500) null,
    status           varchar(255) not null,
    consultant_id    bigint       not null,
    user_id          bigint       not null,
    constraint FK68kmqhd2ad86sqrs6wyomudy4
        foreign key (consultant_id) references user (id),
    constraint FK886ced1atxgvnf1o3oxtj5m4s
        foreign key (user_id) references user (id)
);

