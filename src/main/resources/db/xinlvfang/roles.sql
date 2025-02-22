create table roles
(
    id   bigint auto_increment
        primary key,
    name varchar(20) null,
    constraint UK_ofx66keruapi6vyqpv6f2or37
        unique (name)
);

