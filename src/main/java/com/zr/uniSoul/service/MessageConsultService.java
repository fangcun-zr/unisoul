package com.zr.uniSoul.service;

import com.zr.uniSoul.pojo.dto.MessageConsultDTO;
import com.zr.uniSoul.pojo.entity.ConsultMessage;
import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.pojo.vo.MessageConsultVO;

import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * 消息服务接口，定义了消息管理的相关方法。
 */
public interface MessageConsultService {
    String getReply(String question, HttpSession session);

    /**
     * 获取用户信息
     * @param string
     * @return
     */
    User getUserInformation(String string);
}