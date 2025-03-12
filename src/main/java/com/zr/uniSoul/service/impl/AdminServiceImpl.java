package com.zr.uniSoul.service.impl;


import com.zr.uniSoul.mapper.AdminMapper;
import com.zr.uniSoul.pojo.vo.UserVO;
import com.zr.uniSoul.service.AdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

/**
 * 后台管理service实现
 */
@Service
@Slf4j
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminMapper adminMapper;

    /**
     * 判断登录者是不是管理员
     * @param userId
     * @return
     */
    @Override

    public Boolean judgeAdmin(int userId) {
        int isAdmin = adminMapper.getIsAdmin(userId);
        log.info("userId: {}, isAdmin: {}", userId, isAdmin);
        return isAdmin==1;
    }

    /**
     * 获取所有用户列表
     * @return
     */
    @Override
    public List<UserVO> getUsersList() {

        return adminMapper.getAllUsersList();
    }

    /**
     * 封禁/解除封禁用户
     *
     * @param userId
     * @param status
     * @return
     */
    @Override
    public int bannedUser(int userId, int status) {
        if(status==1){
            status=0;
        }
        else {
            status=1;
        }

        return adminMapper.bannedUser(userId,status);
    }

    /**
     * 删除用户
     * @param id
     * @return
     */
    @Override
    public int deleteUser(int id) {
        return adminMapper.deleteUser(id);
    }

    //TODO 后台管理
}
