package com.zr.uniSoul.controller;

import com.zr.uniSoul.common.PageResult;
import com.zr.uniSoul.common.R;
import com.zr.uniSoul.pojo.dto.CommentsPageDTO;
import com.zr.uniSoul.pojo.dto.PageQueryDTO;
import com.zr.uniSoul.pojo.entity.Article;
import com.zr.uniSoul.utils.AliOssUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.zr.uniSoul.service.zhxtService;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.UUID;

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
    private AliOssUtil aliOssUtil;

    /**
     * 发布文章
     * @return
     */
    @PostMapping("publish")
    @ApiOperation("发布接口")
    public R publish(HttpServletRequest request ,
                     @RequestPart String title,
                     @RequestPart String content,
                     @RequestPart String tags,
                     @RequestPart String category_id
                    ,@RequestPart MultipartFile file) {
        Article article = new Article();
        article.setTitle(title);
        article.setContent(content);
        article.setTags(tags);
        article.setCategoryId(Integer.parseInt(category_id));
        log.info("文件上传:{}",file);
        try {
            //原始文件名
            String originalFilename = file.getOriginalFilename();
            //截取原始文件后缀  xxx.png
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            //生成新的文件名
            String objectName = UUID.randomUUID().toString() + extension;
            //上传文件
            String filePath = aliOssUtil.upload(file.getBytes(), objectName);
            article.setCoverImage(filePath);
        } catch (IOException e) {
            log.error("文件上传失败:{}",e);
        }

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

    /**
     * 文章列表
     * @param pageQueryDTO
     * @return
     */
    @GetMapping("list")
    @ApiOperation("文章列表")
    public R<PageResult> list(@RequestBody PageQueryDTO pageQueryDTO) {
        log.info("分页查询：{}", pageQueryDTO);
        PageResult pageResult = zhxtService.pageQuery(pageQueryDTO);
        return R.success(pageResult);

    }

    /**
     * 获取文章评论
     */
    @GetMapping("comments")
    @ApiOperation("获取文章评论")
    public R<PageResult> getComments(@RequestBody CommentsPageDTO commentsPageDTO) {
        log.info("文章评论分页展示：{}", commentsPageDTO);
        PageResult pageResult = zhxtService.getComments(commentsPageDTO);
        return R.success(pageResult);


    }
}
