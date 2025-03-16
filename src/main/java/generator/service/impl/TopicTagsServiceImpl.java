package generator.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import generator.domain.TopicTags;
import generator.service.TopicTagsService;
import generator.mapper.TopicTagsMapper;
import org.springframework.stereotype.Service;

/**
* @author 陈怡帆
* @description 针对表【topic_tags(话题标签关联表)】的数据库操作Service实现
* @createDate 2025-03-14 10:56:33
*/
@Service
public class TopicTagsServiceImpl extends ServiceImpl<TopicTagsMapper, TopicTags>
    implements TopicTagsService{

}




