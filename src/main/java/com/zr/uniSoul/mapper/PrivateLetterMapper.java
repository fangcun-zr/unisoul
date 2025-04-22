package com.zr.uniSoul.mapper;

import com.github.pagehelper.Page;
import com.zr.uniSoul.pojo.dto.PageQueryDTO;
import com.zr.uniSoul.pojo.vo.MessageVO;
import com.zr.uniSoul.pojo.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;

import java.time.LocalDateTime;
import java.util.List;
@Mapper
public interface PrivateLetterMapper {
    Page<UserVO> getFollowList(PageQueryDTO pageQueryDTO);

    void storeMessage(String username, String toName, String data);

    Page<MessageVO> getChatHistory(PageQueryDTO pageQueryDTO);
}
