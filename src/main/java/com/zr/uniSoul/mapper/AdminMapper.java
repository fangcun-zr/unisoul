package com.zr.uniSoul.mapper;

import com.zr.uniSoul.pojo.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AdminMapper {

    int getIsAdmin(int userId);

    List<UserVO> getAllUsersList();

    int bannedUser(int userId, int status);

    int deleteUser(int id);
}
