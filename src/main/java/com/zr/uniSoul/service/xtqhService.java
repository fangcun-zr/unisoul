package com.zr.uniSoul.service;

import com.zr.uniSoul.pojo.entity.User;

public interface xtqhService {
    User login(User user);

    Boolean sendCheckCode(String email, String code);

    int register(User user);

    User findByUsername(String username);

    int editUserInfo(User user);
}
