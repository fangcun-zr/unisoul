package generator.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import generator.domain.HotTopics;
import generator.service.HotTopicsService;
import generator.mapper.HotTopicsMapper;
import org.springframework.stereotype.Service;

/**
* @author 陈怡帆
* @description 针对表【hot_topics(热门话题表)】的数据库操作Service实现
* @createDate 2025-03-14 11:04:57
*/
@Service
public class HotTopicsServiceImpl extends ServiceImpl<HotTopicsMapper, HotTopics>
    implements HotTopicsService{

}




