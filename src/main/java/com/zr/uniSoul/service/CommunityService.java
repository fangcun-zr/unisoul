package com.zr.uniSoul.service;

import com.zr.uniSoul.common.PageResult;
import com.zr.uniSoul.pojo.dto.PageQueryDTO;

public interface CommunityService {
    PageResult getCommunityList(PageQueryDTO pageQueryDTO);
}
