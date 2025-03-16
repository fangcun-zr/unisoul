package generator.controller;

import generator.common.BaseResponse;
import generator.common.ResultUtils;
import generator.domain.Statistics;
import generator.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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


    /**
     * 新增统计数据
     */
    @PostMapping
    public BaseResponse<Statistics> addStatistics(@RequestBody Statistics statistics) {
        boolean saveResult = statisticsService.save(statistics);
        if (saveResult) {
            return ResultUtils.success(statistics);
        } else {
            return ResultUtils.error(500, "新增统计数据失败");
        }
    }

    /**
     * 删除统计数据
     */
    @DeleteMapping("/{id}")
    public BaseResponse<String> deleteStatistics(@PathVariable Long id) {
        boolean removeResult = statisticsService.removeById(id);
        if (removeResult) {
            return ResultUtils.success("删除统计数据成功");
        } else {
            return ResultUtils.error(500, "删除统计数据失败");
        }
    }

    /**
     * 更新社区统计数据，假设前端传入完整的 Statistics 对象
     */
    @PutMapping
    public BaseResponse<Statistics> updateStatistics(@RequestBody Statistics statistics) {
        boolean updateResult = statisticsService.updateById(statistics);
        if (updateResult) {
            return ResultUtils.success(statistics);
        } else {
            return ResultUtils.error(500, "更新统计数据失败");
        }
    }

    /**
     * 获取社区统计数据
     */
    @GetMapping("/{id}")
    public BaseResponse<Statistics> getStatistics(@PathVariable Long id) {
        Statistics statistics = statisticsService.getById(id);
        if (statistics != null) {
            return ResultUtils.success(statistics);
        } else {
            return ResultUtils.error(404, "统计数据不存在");
        }
    }

    /**
     * 获取所有统计数据
     */
    @GetMapping("/all")
    public BaseResponse<List<Statistics>> getAllStatistics() {
        List<Statistics> statisticsList = statisticsService.list();
        if (statisticsList != null && !statisticsList.isEmpty()) {
            return ResultUtils.success(statisticsList);
        } else {
            return ResultUtils.error(404, "无统计数据");
        }
    }
}