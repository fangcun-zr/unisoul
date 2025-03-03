package generator.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import generator.domain.User;
import generator.mapper.UserMapper;
import generator.service.UserService;
import org.springframework.stereotype.Service;

/**
* @author 陈怡帆
* @description 针对表【user】的数据库操作Service实现
* @createDate 2025-03-01 00:43:09
*/
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User>
    implements UserService{

    @Override
    public boolean existsById(Long userId) {
        return getById(userId) != null;
        // 或使用 MyBatis-Plus 的快捷方法
        // return lambdaQuery().eq(User::getId, userId).count() > 0;
    }

//    @Override
//    public User getById(long userId) {
//
//        return baseMapper.selectById(userId);
//    }

}




