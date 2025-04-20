package com.zr.uniSoul.controller;

import com.zr.uniSoul.common.PageResult;
import com.zr.uniSoul.common.R;
import com.zr.uniSoul.pojo.dto.PageQueryDTO;
import com.zr.uniSoul.service.CommunityService;
import io.swagger.annotations.Api;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 社区版块控制器
 */
@RestController
@RequestMapping("/community")
@Api(tags = "社区版块")
@Slf4j
public class CommunityController {
    //TODO 社区版块
    @Autowired
    private CommunityService communityService;
    /**
     * 获取所有圈子
     */
    @RequestMapping("/getAllCom")
    public R<PageResult> getAllCommunity(@RequestBody PageQueryDTO pageQueryDTO) {
        log.info("社区分页展示：{}", pageQueryDTO);
        PageResult pageResult = communityService.getCommunityList(pageQueryDTO);
        return R.success(pageResult);
    }
}
