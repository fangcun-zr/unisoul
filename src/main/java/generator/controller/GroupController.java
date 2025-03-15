package generator.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import generator.common.BaseResponse;
import generator.common.ResultUtils;
import generator.domain.Groups;
import generator.domain.GroupMembers;
import generator.service.GroupsService;
import generator.service.GroupMembersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/community/groups")
public class GroupController {

    @Autowired
    private GroupsService groupsService;

    @Autowired
    private GroupMembersService groupMembersService;

    /**
     * 创建小组
     */
    @PostMapping
    public BaseResponse<String> createGroup(@RequestBody Groups group) {
        boolean isSuccess = groupsService.save(group);
        if (isSuccess) {
            return ResultUtils.success("小组创建成功！");
        } else {
            return ResultUtils.error(500, "小组创建失败");
        }
    }

    /**
     * 检查小组是否存在
     */
    private boolean checkGroupExists(Long groupId) {
        return groupsService.getById(groupId) != null;
    }

    /**
     * 加入小组
     */
    @PostMapping("/{groupId}/join")
    public BaseResponse<String> joinGroup(@PathVariable Long groupId, @RequestParam Long userId) {
        // 检查 groupId 是否存在
        if (!checkGroupExists(groupId)) {
            return ResultUtils.error(404, "小组不存在");
        }

        GroupMembers member = new GroupMembers();
        member.setGroup_id(groupId);
        member.setUser_id(userId);
        member.setRole(0); // 普通成员
        member.setStatus(1); // 正常
        boolean isSuccess = groupMembersService.save(member);
        if (isSuccess) {
            return ResultUtils.success("加入小组成功！");
        } else {
            return ResultUtils.error(500, "加入小组失败");
        }
    }

    /**
     * 获取小组列表（分页）
     */
    @GetMapping
    public BaseResponse<Page<Groups>> getGroupList(@RequestParam(defaultValue = "1") int page,
                                                   @RequestParam(defaultValue = "10") int size) {
        Page<Groups> groupPage = groupsService.page(new Page<>(page, size));
        return ResultUtils.success(groupPage);
    }

    /**
     * 获取小组详情
     */
    @GetMapping("/{groupId}")
    public BaseResponse<Groups> getGroupDetail(@PathVariable Long groupId) {
        Groups group = groupsService.getById(groupId);
        if (group != null) {
            return ResultUtils.success(group);
        } else {
            return ResultUtils.error(404, "小组不存在");
        }
    }
}