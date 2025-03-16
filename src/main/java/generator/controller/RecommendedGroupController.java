package generator.controller;
import generator.common.BaseResponse;
import generator.common.ResultUtils;
import generator.domain.RecommendedGroups;
import generator.service.RecommendedGroupsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/community/recommended-groups")
public class RecommendedGroupController {

    @Autowired
    private RecommendedGroupsService recommendedGroupsService;

    /**
     * 获取推荐小组
     */
    @GetMapping
    public BaseResponse<List<RecommendedGroups>> getRecommendedGroups() {
        List<RecommendedGroups> recommendedGroups = recommendedGroupsService.list();
        return ResultUtils.success(recommendedGroups);
    }

    /**
     * 根据ID获取单个推荐小组详情
     */
    @GetMapping("/{id}")
    public BaseResponse<RecommendedGroups> getRecommendedGroupById(@PathVariable Long id) {
        RecommendedGroups recommendedGroup = recommendedGroupsService.getById(id);
        if (recommendedGroup != null) {
            return ResultUtils.success(recommendedGroup);
        } else {
            return ResultUtils.error(404, "推荐小组不存在");
        }
    }

    /**
     * 添加新的推荐小组
     */
    @PostMapping
    public BaseResponse<RecommendedGroups> addRecommendedGroup(@RequestBody RecommendedGroups recommendedGroup) {
        boolean saveResult = recommendedGroupsService.save(recommendedGroup);
        if (saveResult) {
            return ResultUtils.success(recommendedGroup);
        } else {
            return ResultUtils.error(500, "添加推荐小组失败");
        }
    }

    /**
     * 更新推荐小组信息
     */
    @PutMapping
    public BaseResponse<RecommendedGroups> updateRecommendedGroup(@RequestBody RecommendedGroups recommendedGroup) {
        boolean updateResult = recommendedGroupsService.updateById(recommendedGroup);
        if (updateResult) {
            return ResultUtils.success(recommendedGroup);
        } else {
            return ResultUtils.error(500, "更新推荐小组失败");
        }
    }

    /**
     * 删除推荐小组
     */
    @DeleteMapping("/{id}")
    public BaseResponse<String> deleteRecommendedGroup(@PathVariable Long id) {
        boolean deleteResult = recommendedGroupsService.removeById(id);
        if (deleteResult) {
            return ResultUtils.success("推荐小组删除成功");
        } else {
            return ResultUtils.error(500, "删除推荐小组失败");
        }
    }
}