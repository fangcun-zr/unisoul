package generator.controller;

import generator.common.BaseResponse;
import generator.common.ResultUtils;
import generator.domain.RecommendedGroups;
import generator.service.RecommendedGroupsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}