package com.zr.uniSoul.controller;

import com.zr.uniSoul.common.PageResult;
import com.zr.uniSoul.common.R;
import com.zr.uniSoul.pojo.dto.CommentsPageDTO;
import com.zr.uniSoul.pojo.dto.PageQueryDTO;
import com.zr.uniSoul.pojo.dto.AddCommentsDTO;
import com.zr.uniSoul.pojo.entity.Article;
import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.pojo.vo.MyDataVO;
import com.zr.uniSoul.utils.AliOssUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.zr.uniSoul.service.ZhxtService;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.UUID;

/**
 * 智绘心途板块代码
 */
@RestController
@RequestMapping("/zhxt")
@Api(tags = "智绘心途")
@Slf4j
public class ZhxtController {

    @Autowired
    private ZhxtService zhxtService;

    @Autowired
    private AliOssUtil aliOssUtil;

    /**
     * 发布文章
     * @return
     */
    @PostMapping(value = "publish")
    @ApiOperation("发布接口")
    public R publish(HttpServletRequest request ,
                     @RequestPart String title,
                     @RequestPart String content,
                     @RequestPart String tags,
                     @RequestPart String category_id
                    ,@RequestPart MultipartFile file) {

        try {
            // 将接收到的乱码字符串转换为字节数组，然后用正确的编码重新解码
            title = new String(title.getBytes("ISO-8859-1"), "UTF-8");
            content = new String(content.getBytes("ISO-8859-1"), "UTF-8");

            tags = new String(tags.getBytes("ISO-8859-1"), "UTF-8");
            category_id = new String(category_id.getBytes("ISO-8859-1"), "UTF-8");

        } catch (UnsupportedEncodingException e) {
            log.error("解码失败: {}", e.getMessage());
            return R.error("解码失败，请检查输入");
        }

        log.info("发布文章接口:{}",content);


        Article article = new Article();
        article.setTitle(title);
        article.setContent(content);
        article.setTags(tags);
        article.setCategory_id(Integer.parseInt(category_id));
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
            article.setCover_image(filePath);
        } catch (IOException e) {
            log.error("文件上传失败:{}",e);
        }

        log.info("发布文章接口");
        HttpSession session = request.getSession();
        String username = (String) session.getAttribute("username");
        int authorId = zhxtService.findIdByUsername(username);
        article.setAuthor_id(authorId);
        int ret = zhxtService.publish(article);
        if (ret == 1) {
            return R.success("发布成功，待审核");
        }
        return R.error("发布失败");
    }

    /**
     * 删除文章
     */
    @DeleteMapping ("deleteArticle")
    @ApiOperation("删除文章")
    public R deleteArticle(@RequestParam int articleId) {
        log.info("删除文章接口, 文章id: {}", articleId);
        int ret = zhxtService.deleteArticle(articleId);
        if (ret == 1) {
            return R.success("删除成功");
        }
        return R.error("删除失败");
    }

    /**
     * 文章列表
     * @param pageQueryDTO
     * @return
     */
    @PostMapping("list")
    @ApiOperation("文章分页展示")
    public R<PageResult> list(@RequestBody PageQueryDTO pageQueryDTO) {
        log.info("分页查询：{}", pageQueryDTO);
        PageResult pageResult = zhxtService.pageQuery(pageQueryDTO);
        return R.success(pageResult);
    }

    /**
     * 获取我的信息
     */
    @GetMapping("getMyData")
    @ApiOperation("获取我的信息")
    public R<MyDataVO> getMyInfo(HttpServletRequest request) {

        HttpSession session = request.getSession();
        String username = (String) session.getAttribute("username");
        int userId = zhxtService.findIdByUsername(username);
        MyDataVO myDataVO = zhxtService.getMyData(userId);
        log.info("获取我的信息接口, 用户id: {}", userId);
        return R.success(myDataVO);

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
    @PostMapping("add")
    @ApiOperation("添加评论")
    public R addComments(@RequestBody AddCommentsDTO addcommentsDTO, HttpServletRequest request) {
        log.info("添加评论：{}", addcommentsDTO);
        HttpSession session = request.getSession();
        int userId = 0;
        Object userIdObj = session.getAttribute("userId");
        if (userIdObj instanceof Integer) {
            userId = (Integer) userIdObj;
        } else if (userIdObj instanceof Long) {
            userId = ((Long) userIdObj).intValue();
        } else {
            // 处理其他情况或抛出异常
        }

        int ret = zhxtService.addComments(addcommentsDTO, userId);
        if (ret == 1) {
            return R.success("评论成功");
        }
        return R.error("评论失败");
    }

    /**
     * 点赞评论
     */
    @GetMapping("/like")
    @ApiOperation("点赞评论")
    public R likeComments(@RequestParam String articleCommentId, HttpServletRequest request) {
        log.info("点赞评论：articleCommentId = {}, userId = {}", articleCommentId, getUserIdFromSession(request));
        HttpSession session = request.getSession();

        int userId = 0;
        Object userIdObj = session.getAttribute("userId");
        if (userIdObj instanceof Integer) {
            userId = (Integer) userIdObj;
        } else if (userIdObj instanceof Long) {
            userId = ((Long) userIdObj).intValue();
        } else {
            // 处理其他情况或抛出异常
        }

        try {
            int ret = zhxtService.likeComments(articleCommentId, userId);
            if (ret == 1) {
                return R.success("点赞成功");
            } else {
                return R.error("点赞失败");
            }
        } catch (Exception e) {
            log.error("点赞评论时发生错误", e);
            return R.error("服务器内部错误");
        }
    }

    private int getUserIdFromSession(HttpServletRequest request) {
        HttpSession session = request.getSession();
        Object userIdObj = session.getAttribute("userId");
        if (userIdObj instanceof Integer) {
            return (Integer) userIdObj;
        }
        return 0;
    }
    /**
     * 获取文章详情信息
     */
    @GetMapping("detail")
    @ApiOperation("获取文章详情信息")
    public R<Article> getArticleDetail(@RequestParam String id) {
        log.info("获取文章详情信息：文章id={}", id);
        Article article = zhxtService.getArticleDetail(id);
        if (article != null) {
            return R.success(article);
        }
        return R.error("文章不存在");
    }

    @GetMapping("author_info")
    @ApiOperation("获取作者详情信息")
    public R<User> getAuthor_info(@RequestParam String id) {
        log.info("获取文章作者信息：文章id={}", id);
        User authorUser = zhxtService.getUserByArticleId(id);
        if (authorUser != null) {
            return R.success(authorUser);
        }
        return R.error("文章不存在");
    }
    /**
     * 审核文章
     */
    @PostMapping("check")
    @ApiOperation("审核文章")
    public R checkArticle(@RequestBody Article article, HttpServletRequest request) {
        log.info("审核文章：{}", article);
        int ret = zhxtService.checkArticle(article);
        if (ret == 1) {
            return R.success("审核成功");
        }
        return R.error("审核失败");
    }
    /**
     * 检查关注状态
     */
    @GetMapping("check-follow-status")
    @ApiOperation("检查关注状态")
    public R checkFollowStatus(@RequestParam("authorId") int authorId, HttpServletRequest request) {
        log.info("检查关注状态：authorId = {}", authorId);
        HttpSession session = request.getSession();
        int userId = 0;
        Object userIdObj = session.getAttribute("userId");
        if (userIdObj instanceof Integer) {
            userId = (Integer) userIdObj;
        } else if (userIdObj instanceof Long) {
            userId = ((Long) userIdObj).intValue();
        } else {
            // 处理其他情况或抛出异常
        }
        if (userId == 0) {
            return R.error("用户未登录");
        }
        int status = zhxtService.checkFollowStatus(authorId, userId);
        if (status == 1) {
            log.info("已关注");
            return R.success("1");
        }
        log.info("未关注");
        return R.success("0");
    }

}
