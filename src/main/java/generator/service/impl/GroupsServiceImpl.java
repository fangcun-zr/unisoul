package generator.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import generator.domain.Groups;
import generator.service.GroupsService;
import generator.mapper.GroupsMapper;
import org.springframework.stereotype.Service;

/**
* @author 陈怡帆
* @description 针对表【groups(小组表)】的数据库操作Service实现
* @createDate 2025-03-14 10:32:30
*/
@Service
public class GroupsServiceImpl extends ServiceImpl<GroupsMapper, Groups>
    implements GroupsService{

}




