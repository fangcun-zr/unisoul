package generator.controller;

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
    public List<RecommendedGroups> getRecommendedGroups() {
        return recommendedGroupsService.list();
    }
}