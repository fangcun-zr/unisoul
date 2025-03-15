package generator.controller;

import generator.common.BaseResponse;
import generator.common.ResultUtils;
import generator.domain.Statistics;
import generator.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/community/statistics")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    /**
     * 获取社区统计数据
     */
    @GetMapping
    public BaseResponse<Statistics> getStatistics() {
        Statistics statistics = statisticsService.getById(1); // 假设统计表只有一条记录
        if (statistics != null) {
            return ResultUtils.success(statistics);
        } else {
            return ResultUtils.error(404, "统计数据不存在");
        }
    }
}