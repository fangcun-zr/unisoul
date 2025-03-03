package generator.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import generator.domain.Article;
import generator.mapper.ArticleMapper;
import generator.service.ArticleService;
import org.springframework.stereotype.Service;

/**
* @author 陈怡帆
* @description 针对表【article(文章表)】的数据库操作Service实现
* @createDate 2025-03-01 00:43:09
*/
@Service
public class ArticleServiceImpl extends ServiceImpl<ArticleMapper, Article>
    implements ArticleService{

}




