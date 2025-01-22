package com.zr.uniSoul.service.impl;

import com.zr.uniSoul.mapper.xtqhMapper;
import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.service.xtqhService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class xtqhServiceImpl implements xtqhService {

    @Autowired
    private xtqhMapper xtqhmapper;
    @Override
    public User login(User user) {

        return  xtqhmapper.findByPasswordAndUsername(user.getPassword(), user.getUsername());
    }
}
