create table comments
(
    id        int auto_increment
        primary key,
    content   text     not null,
    replyTo   int      null,
    createdAt datetime not null,
    updatedAt datetime not null
);

