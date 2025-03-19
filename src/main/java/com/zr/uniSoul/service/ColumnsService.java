package com.zr.uniSoul.service;

import com.zr.uniSoul.common.PageResult;
import com.zr.uniSoul.pojo.dto.PageQueryDTO;
import com.zr.uniSoul.pojo.entity.Columns;
import com.zr.uniSoul.pojo.vo.ArticleVO;
import com.zr.uniSoul.pojo.vo.ColumnsVO;
import com.zr.uniSoul.pojo.vo.UserVO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 专栏板块接口
 */
public interface ColumnsService {
    PageResult pageQuery(PageQueryDTO pageQueryDTO);

    Integer createColum(int userId, String title, String description, Integer categoryId, MultipartFile cover);

    List<ColumnsVO> getMyColumns(int userId);

    List<ArticleVO> getArticleList(Integer columnsId);

    List<ArticleVO> getMyArticles(int articleId);

    Integer addArticleToColum(int articleId, int columnId);

    Integer removeArticleFromColumn(int articleId, int columnId);

    UserVO getAuthorInfo(Integer columnId);

    Columns getColumnDetail(Integer columnId);

    Integer deleteColumn(Integer columnId);

    Integer updateColum(Integer columnId, String title, String description, Integer categoryId, MultipartFile cover);
}
