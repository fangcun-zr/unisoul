package com.zr.uniSoul.controller;

import com.zr.uniSoul.filter.SensitiveWordFilter;
import com.zr.uniSoul.pojo.vo.FilterResponse;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;

/**
 * 敏感词过滤控制器
 */
@RestController
@RequestMapping("/zhxt")
@Api("敏感词过滤")
@Slf4j
public class SensitiveWordController {

    @Autowired
    private  SensitiveWordFilter sensitiveWordFilter;

    /**
     * 过滤敏感词的接口
     * @param
     * @return
     */
    @GetMapping("/filter")
    @ApiOperation("敏感词过滤接口")
    public FilterResponse filterSensitiveWords(@RequestParam String psychology_content ) {
        System.out.println(psychology_content);
        // 调用敏感词过滤器的 filter 方法进行过滤
        log.info("敏感词过滤请求: {}",psychology_content);
        String filteredContent = sensitiveWordFilter.filter(psychology_content);
        return new FilterResponse(filteredContent);
    }
}

