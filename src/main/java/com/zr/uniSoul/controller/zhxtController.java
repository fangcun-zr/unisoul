package com.zr.uniSoul.controller;

import com.zr.uniSoul.common.R;
import com.zr.uniSoul.pojo.entity.Article;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zr.uniSoul.service.zhxtService;
import com.zr.uniSoul.service.xtqhService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * 智绘心途板块代码
 */
@RestController
@RequestMapping("/zhxt")
@Api(tags = "智绘心途")
@Slf4j
public class zhxtController {

    @Autowired
    private zhxtService zhxtService;

    @Autowired
    private xtqhService xhtService;

    /**
     * 发布文章
     * @return
     */
    @PostMapping("publish")
    @ApiOperation("发布接口")
    public R publish(HttpServletRequest request ,@RequestBody Article article) {
        log.info("发布文章接口");
        HttpSession session = request.getSession();
        String username = (String) session.getAttribute("username");
        int authorId = zhxtService.findIdByUsername(username);
        article.setAuthorId(authorId);
        int ret = zhxtService.publish(article);
        if (ret == 1) {
            return R.success("发布成功，待审核");
        }
        return R.error("发布失败");
    }
}
