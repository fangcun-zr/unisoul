package com.zr.uniSoul.mapper;

import com.zr.uniSoul.pojo.dto.MessageConsultDTO;
import com.zr.uniSoul.pojo.entity.ConsultMessage;
import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.pojo.vo.MessageConsultVO;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 消息Mapper接口，定义了操作数据库的SQL语句。
 */
@Mapper
public interface MessageConsultMapper {
    /**
     * 获取用户信息
     * @param userId
     * @return
     */
    @Select("SELECT * FROM user WHERE username = #{userId}")
    User getUserInformation(String userId);
}