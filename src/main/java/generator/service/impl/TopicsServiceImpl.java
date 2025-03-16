package generator.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import generator.domain.Topics;
import generator.service.TopicsService;
import generator.mapper.TopicsMapper;
import org.springframework.stereotype.Service;

/**
* @author 陈怡帆
* @description 针对表【topics(话题表)】的数据库操作Service实现
* @createDate 2025-03-14 11:04:44
*/
@Service
public class TopicsServiceImpl extends ServiceImpl<TopicsMapper, Topics>
    implements TopicsService{

}




