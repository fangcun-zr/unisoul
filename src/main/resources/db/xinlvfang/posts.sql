create table posts
(
    id        int auto_increment
        primary key,
    title     varchar(255)  not null,
    content   text          not null,
    tag       varchar(255)  null,
    views     int default 0 null,
    likes     int default 0 null,
    createdAt datetime      not null,
    updatedAt datetime      not null
);

