package generator.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
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
    public String createGroup(@RequestBody Groups group) {
        groupsService.save(group);
        return "小组创建成功！";
    }

    /**
     * 加入小组
     */
    @PostMapping("/{groupId}/join")
    public String joinGroup(@PathVariable Long groupId, @RequestParam Long userId) {
        GroupMembers member = new GroupMembers();
        member.setGroup_id(groupId);
        member.setUser_id(userId);
        member.setRole(0); // 普通成员
        member.setStatus(1); // 正常
        groupMembersService.save(member);
        return "加入小组成功！";
    }

    /**
     * 获取小组列表（分页）
     */
    @GetMapping
    public Page<Groups> getGroupList(@RequestParam(defaultValue = "1") int page,
                                     @RequestParam(defaultValue = "10") int size) {
        return groupsService.page(new Page<>(page, size));
    }

    /**
     * 获取小组详情
     */
    @GetMapping("/{groupId}")
    public Groups getGroupDetail(@PathVariable Long groupId) {
        return groupsService.getById(groupId);
    }
}