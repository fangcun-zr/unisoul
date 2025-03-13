package com.zr.uniSoul.controller;

import com.zr.uniSoul.common.PageResult;
import com.zr.uniSoul.common.R;
import com.zr.uniSoul.pojo.dto.ArticleToColumDTO;
import com.zr.uniSoul.pojo.dto.PageQueryDTO;
import com.zr.uniSoul.pojo.vo.ArticleVO;
import com.zr.uniSoul.pojo.vo.ColumnsVO;
import com.zr.uniSoul.service.ColumnsService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * 专栏板块Controller
 */
@RestController
@RequestMapping("/columns")
@Api(tags = "专栏板块")
@Slf4j
public class ColumnsController {

    @Autowired
    private ColumnsService columsService;

    /**
     * 获取专栏列表
     */
    @RequestMapping("/getColumList")
    public R<PageResult> list(@RequestBody PageQueryDTO pageQueryDTO) {
        log.info("获取专栏列表 pageQueryDTO:{}", pageQueryDTO);
        PageResult pageResult = columsService.pageQuery(pageQueryDTO);
        return R.success(pageResult);
    }
    /**
     * 获取我的专栏列表
     */
    @GetMapping("/getMyColumns")
    public R<List<ColumnsVO>> getMyColumList(HttpServletRequest request) {
        log.info("获取我的专栏列表");
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
        List<ColumnsVO> columns = columsService.getMyColumns(userId);
        return R.success(columns);

    }

    /**
     * 获取专栏的文章
     */
    @GetMapping("/getThisArticles")
    public R<List<ArticleVO>> getArticleList(@RequestParam Integer id) {
        log.info("获取专栏的文章 id:{}", id);
        List<ArticleVO> articleList = columsService.getArticleList(id);
        return R.success(articleList);
    }


    /**
     * 获取我的未加入任何专栏的文章
     * @param request
     * @return
     */
    @GetMapping("/getMyArticles")
    @ApiOperation("获取我的文章列表")
    public R<List<ArticleVO>> getMyArticle(HttpServletRequest request){
        log.info("获取我的文章列表接口");
        HttpSession session = request.getSession();
        String userId = session.getAttribute("userId").toString();
        List<ArticleVO> articleVOList = columsService.getMyArticles(Integer.parseInt(userId));
        if (articleVOList == null || articleVOList.isEmpty()) {
            log.info("获取我的文章列表失败");
            return R.error("获取我的文章列表失败");
        }
        return R.success(articleVOList);
    }

    /**
     * 将我的文章添加到该专栏
     */
    @PostMapping("/addMyArticleToColumn")
    public R<Object> addArticleToColum(@RequestBody ArticleToColumDTO articleToColumDTO) {
        log.info("将我的文章添加到该专栏 articleId:{},columId:{}", articleToColumDTO);
        Integer result = columsService.addArticleToColum(articleToColumDTO.getArticleId(), articleToColumDTO.getColumnId());
        if(result == 1){
            return R.success(result);
        }
        return R.error("添加文章失败");
    }

    /**
     * 创建专栏
     */
    @PostMapping(value = "/create")
    public R<Object> createColum(HttpServletRequest request ,
                                 @RequestParam String title,
                                 @RequestParam String description,
                                 @RequestParam Integer categoryId
            , @RequestPart MultipartFile cover) {
        log.info("创建专栏 title:{},description:{},categoryId:{},cover:{}", title, description, categoryId, cover);
        //判断登录
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

        Integer result = columsService.createColum(userId,title, description, categoryId, cover);
        if(result == 1){
            return R.success(result);
        }
        return R.error("创建专栏失败");

    }

    /**
     * 将该文章从该专栏中移除
     */
    @DeleteMapping("/deleteArticleFromColumns")
    public R<Object> removeArticleFromColumn(@RequestBody ArticleToColumDTO articleToColumDTO) {
        log.info("将该文章从该专栏中移除 {}", articleToColumDTO);
        Integer result = columsService.removeArticleFromColumn(articleToColumDTO.getArticleId(), articleToColumDTO.getColumnId());
        if(result == 1){
            return R.success(result);
        }
        return R.error("移除文章失败");
    }
}
