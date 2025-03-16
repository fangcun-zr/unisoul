package generator.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import generator.domain.GroupTopics;
import generator.service.GroupTopicsService;
import generator.mapper.GroupTopicsMapper;
import org.springframework.stereotype.Service;

/**
* @author 陈怡帆
* @description 针对表【group_topics(小组话题关联表)】的数据库操作Service实现
* @createDate 2025-03-14 10:56:33
*/
@Service
public class GroupTopicsServiceImpl extends ServiceImpl<GroupTopicsMapper, GroupTopics>
    implements GroupTopicsService{

}




