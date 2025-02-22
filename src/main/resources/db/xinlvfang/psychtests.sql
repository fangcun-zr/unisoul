create table psychtests
(
    id        int auto_increment
        primary key,
    testType  varchar(255) not null,
    answers   text         null,
    result    text         null,
    score     int          null,
    createdAt datetime     not null,
    updatedAt datetime     not null
);

