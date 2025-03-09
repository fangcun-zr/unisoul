package generator.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import generator.domain.Doctor;
import generator.service.DoctorService;
import generator.mapper.DoctorMapper;
import org.springframework.stereotype.Service;

/**
* @author ztb
* @description 针对表【doctor】的数据库操作Service实现
* @createDate 2025-03-05 23:49:29
*/
@Service
public class DoctorServiceImpl extends ServiceImpl<DoctorMapper, Doctor>
    implements DoctorService{

}




