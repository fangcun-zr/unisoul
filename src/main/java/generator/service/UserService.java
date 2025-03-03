package generator.service;

import com.baomidou.mybatisplus.extension.service.IService;
import generator.domain.User;

/**
* @author 陈怡帆
* @description 针对表【user】的数据库操作Service
* @createDate 2025-03-01 00:43:09
*/
public interface UserService extends IService<User> {

    /**
     * 判断用户是否存在
     * @param userId 用户ID
     * @return true=存在
     */
    boolean existsById(Long userId);

//    User getById(long userId);
}
