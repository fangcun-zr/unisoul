package com.zr.uniSoul.service;


import com.zr.uniSoul.common.PageResult;
import com.zr.uniSoul.common.R;
import com.zr.uniSoul.pojo.dto.PageQueryDTO;
import com.zr.uniSoul.pojo.vo.UserVO;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface PrivateLetterService {
    /**
     * 获取关注列表分页展示
     * @param pageQueryDTO
     * @return
     */
    PageResult pageQueryFollow(PageQueryDTO pageQueryDTO);
    /**
     * 存储私信信息
     * @param username
     * @param toName
     * @param data
     */
    void storeMessage(String username, String toName, String data);

    PageResult getChatHistory(PageQueryDTO pageQueryDTO);
}
