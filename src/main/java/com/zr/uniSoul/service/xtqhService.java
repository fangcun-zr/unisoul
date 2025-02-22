package com.zr.uniSoul.service;

import com.zr.uniSoul.pojo.entity.UserDTO;

public interface xtqhService {
    UserDTO login(UserDTO user);

    Boolean sendCheckCode(String email, String code);

    int register(UserDTO user);

    UserDTO findByUsername(String username);

    int editUserInfo(UserDTO user);


    int follow(int myUsername, String role_name);
}
