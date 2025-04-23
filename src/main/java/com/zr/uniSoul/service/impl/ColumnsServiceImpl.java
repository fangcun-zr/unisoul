package com.zr.uniSoul.service.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.zr.uniSoul.common.PageResult;
import com.zr.uniSoul.mapper.ColumnsMapper;
import com.zr.uniSoul.pojo.dto.PageQueryDTO;
import com.zr.uniSoul.pojo.entity.Columns;
import com.zr.uniSoul.pojo.vo.ArticleVO;
import com.zr.uniSoul.pojo.vo.ColumnsVO;
import com.zr.uniSoul.pojo.vo.UserVO;
import com.zr.uniSoul.service.ColumnsService;
import com.zr.uniSoul.utils.AliOssUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * 专栏板块服务层代码
 */
@Service
@Slf4j
public class ColumnsServiceImpl implements ColumnsService {
    @Autowired
    private ColumnsMapper columsMapper;
    @Autowired
    private AliOssUtil aliOssUtil;
    @Override
    public PageResult pageQuery(PageQueryDTO pageQueryDTO) {

        PageHelper.startPage(pageQueryDTO.getPage(),pageQueryDTO.getPageSize());
        //下一条sql进行分页，自动加入limit关键字分页
        Page<Columns> page = columsMapper.pageQuery(pageQueryDTO);
        return new PageResult(page.getTotal(), page.getResult());
    }

    /**
     * 将新建的专栏插入数据库保存
     *
     * @param userId
     * @param title
     * @param description
     * @param categoryId
     * @param cover
     * @return
     */
    @Override
    public Integer createColum(int userId, String title, String description, Integer categoryId, MultipartFile cover) {
        //将文件存储到阿里云
        log.info("文件上传:{}",cover);
        String filePath = "";
        try {
            //原始文件名
            String originalFilename = cover.getOriginalFilename();
            //截取原始文件后缀  xxx.md.png
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            //生成新的文件名
            String objectName = UUID.randomUUID().toString() + extension;
            //上传文件
            filePath = aliOssUtil.upload(cover.getBytes(), objectName);
        } catch (IOException e) {
            log.error("文件上传失败:{}",e);
        }
        //将文件路径保存到数据库
        Columns columns = new Columns();
        columns.setUserId(userId);
        columns.setTitle(title);
        columns.setDescription(description);
        columns.setCategoryId(categoryId);
        columns.setCoverUrl(filePath);
        return columsMapper.insertSelective(columns);
    }

    /**
     * 修改专栏
     * @param
     * @return
     */
    @Override
    public Integer updateColum(Integer columnId, String title, String description, Integer categoryId, MultipartFile cover) {
        //将文件存储到阿里云
        log.info("文件上传:{}",cover);
        String filePath = "";
        try {
            //原始文件名
            String originalFilename = cover.getOriginalFilename();
            //截取原始文件后缀  xxx.md.png
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            //生成新的文件名
            String objectName = UUID.randomUUID().toString() + extension;
            //上传文件
            filePath = aliOssUtil.upload(cover.getBytes(), objectName);
        } catch (IOException e) {
            log.error("文件上传失败:{}",e);
        }
        //将文件路径保存到数据库
        Columns columns = new Columns();
        columns.setColumnId(columnId);
        columns.setTitle(title);
        columns.setDescription(description);
        columns.setCategoryId(categoryId);
        columns.setCoverUrl(filePath);
        return columsMapper.updateByPrimaryKeySelective(columns);

    }



    /**
     * 查询我的专栏
     * @param userId
     * @return
     */
    @Override
    public List<ColumnsVO> getMyColumns(int userId) {
        return columsMapper.getMyColumns(userId);
    }

    @Override
    public List<ArticleVO> getArticleList(Integer columnsId) {
        return columsMapper.getArticleList(columnsId);
    }

    @Override
    public List<ArticleVO> getMyArticles(int authorId) {
        return columsMapper.getMyArticles(authorId);
    }

    @Override
    public Integer addArticleToColum(int articleId, int columnId) {
        //让文章数+1
        columsMapper.ColumnAdd(columnId);
        return columsMapper.addArticleToColum(articleId,columnId);
    }

    /**
     * 将文章从专栏中移除
     * @param articleId
     * @param columnId
     * @return
     */
    @Override
    public Integer removeArticleFromColumn(int articleId, int columnId) {
        //将专栏中的文章数-1
        columsMapper.ColumnUpdate(columnId);
        //将文章的专栏id设置为null
        return columsMapper.removeArticleFromColumn(articleId);

    }

    /**
     *  获取专栏作者信息
     * @param columnId
     * @return
     */
    @Override
    public UserVO getAuthorInfo(Integer columnId) {
        return columsMapper.getAuthorInfo(columnId);
    }

    /**
     * 返回专栏信息
     * @param columnId
     * @return
     */
    @Override
    public Columns getColumnDetail(Integer columnId) {
        return columsMapper.selectByPrimaryKey(columnId);
    }

    /**
     * 删除专栏
     * @param columnId
     * @return
     */
    @Override
    public Integer deleteColumn(Integer columnId) {
        //先将专栏的文章绑定信息改变
        columsMapper.deleteArticleFromColumn(columnId);
        return columsMapper.deleteByPrimaryKey(columnId);
    }


}
