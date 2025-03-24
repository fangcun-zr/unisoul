package com.zr.uniSoul.mapper;

import com.github.pagehelper.Page;
import com.zr.uniSoul.pojo.dto.PageQueryDTO;
import com.zr.uniSoul.pojo.entity.Columns;
import com.zr.uniSoul.pojo.vo.ArticleVO;
import com.zr.uniSoul.pojo.vo.ColumnsVO;
import com.zr.uniSoul.pojo.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ColumnsMapper {

    Page<Columns> pageQuery(PageQueryDTO pageQueryDTO);

    Integer insertSelective(Columns columns);

    List<ColumnsVO> getMyColumns(int userId);

    List<ArticleVO> getArticleList(Integer columnsId);

    List<ArticleVO> getMyArticles(int authorId);

    Integer addArticleToColum(int articleId, int columnId);

    Integer removeArticleFromColumn(int articleId);

    void ColumnUpdate(int columnId);

    void ColumnAdd(int columnId);

    UserVO getAuthorInfo(Integer columnId);

    Columns selectByPrimaryKey(Integer columnId);

    Integer deleteByPrimaryKey(Integer columnId);

    void deleteArticleFromColumn(Integer columnId);

    Integer updateByPrimaryKeySelective(Columns columns);
}
