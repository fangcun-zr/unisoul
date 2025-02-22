create table consultations
(
    id          int auto_increment
        primary key,
    date        datetime                                                                  not null,
    timeSlot    varchar(255)                                                              not null,
    type        enum ('video', 'voice', 'text')                                           not null,
    status      enum ('pending', 'confirmed', 'cancelled', 'completed') default 'pending' null,
    description text                                                                      null,
    createdAt   datetime                                                                  not null,
    updatedAt   datetime                                                                  not null
);

