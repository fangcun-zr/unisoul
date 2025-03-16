package generator.controller;
import generator.common.BaseResponse;
import generator.common.ResultUtils;
import generator.domain.GroupTopics;
import generator.service.GroupTopicsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/community/group-topics")
public class GroupTopicsController {

    @Autowired
    private GroupTopicsService groupTopicsService;

    /**
     * 获取所有小组话题关联记录
     */
    @GetMapping
    public BaseResponse<List<GroupTopics>> getGroupTopics() {
        List<GroupTopics> groupTopics = groupTopicsService.list();
        return ResultUtils.success(groupTopics);
    }

    /**
     * 根据ID获取单个小组话题关联记录
     */
    @GetMapping("/{id}")
    public BaseResponse<GroupTopics> getGroupTopicById(@PathVariable Long id) {
        GroupTopics groupTopic = groupTopicsService.getById(id);
        if (groupTopic != null) {
            return ResultUtils.success(groupTopic);
        } else {
            return ResultUtils.error(404, "小组话题关联记录不存在");
        }
    }

    /**
     * 添加新的小组话题关联记录
     */
    @PostMapping
    public BaseResponse<GroupTopics> addGroupTopic(@RequestBody GroupTopics groupTopic) {
        boolean saveResult = groupTopicsService.save(groupTopic);
        if (saveResult) {
            return ResultUtils.success(groupTopic);
        } else {
            return ResultUtils.error(500, "添加小组话题关联记录失败");
        }
    }

    /**
     * 更新小组话题关联记录
     */
    @PutMapping
    public BaseResponse<GroupTopics> updateGroupTopic(@RequestBody GroupTopics groupTopic) {
        boolean updateResult = groupTopicsService.updateById(groupTopic);
        if (updateResult) {
            return ResultUtils.success(groupTopic);
        } else {
            return ResultUtils.error(500, "更新小组话题关联记录失败");
        }
    }

    /**
     * 删除小组话题关联记录
     */
    @DeleteMapping("/{id}")
    public BaseResponse<String> deleteGroupTopic(@PathVariable Long id) {
        boolean deleteResult = groupTopicsService.removeById(id);
        if (deleteResult) {
            return ResultUtils.success("小组话题关联记录删除成功");
        } else {
            return ResultUtils.error(500, "删除小组话题关联记录失败");
        }
    }
}