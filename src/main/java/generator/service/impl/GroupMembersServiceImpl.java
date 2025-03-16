package generator.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import generator.domain.GroupMembers;
import generator.service.GroupMembersService;
import generator.mapper.GroupMembersMapper;
import org.springframework.stereotype.Service;

/**
* @author 陈怡帆
* @description 针对表【group_members(小组成员表)】的数据库操作Service实现
* @createDate 2025-03-14 10:56:33
*/
@Service
public class GroupMembersServiceImpl extends ServiceImpl<GroupMembersMapper, GroupMembers>
    implements GroupMembersService{

}




