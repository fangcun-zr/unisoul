create table options
(
    id          bigint auto_increment
        primary key,
    content     varchar(255) not null,
    score       int          not null,
    question_id bigint       null,
    constraint FK5bmv46so2y5igt9o9n9w4fh6y
        foreign key (question_id) references questions (id)
);

