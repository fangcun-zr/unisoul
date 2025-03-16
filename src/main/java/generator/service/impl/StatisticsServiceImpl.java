package generator.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import generator.domain.Statistics;
import generator.service.StatisticsService;
import generator.mapper.StatisticsMapper;
import org.springframework.stereotype.Service;

/**
* @author 陈怡帆
* @description 针对表【statistics(统计表)】的数据库操作Service实现
* @createDate 2025-03-14 10:56:33
*/
@Service
public class StatisticsServiceImpl extends ServiceImpl<StatisticsMapper, Statistics>
    implements StatisticsService{

}




