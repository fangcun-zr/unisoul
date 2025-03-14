package generator.controller;

import generator.domain.Statistics;
import generator.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/community/statistics")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    /**
     * 获取社区统计数据
     */
    @GetMapping
    public Statistics getStatistics() {
        return statisticsService.getById(1); // 假设统计表只有一条记录
    }
}