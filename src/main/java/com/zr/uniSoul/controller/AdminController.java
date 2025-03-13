package com.zr.uniSoul.controller;

import com.zr.uniSoul.common.R;
import com.zr.uniSoul.pojo.dto.BannedDTO;
import com.zr.uniSoul.pojo.vo.UserVO;
import com.zr.uniSoul.service.AdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

@RestController
@Slf4j
@RequestMapping("/admin")
public class AdminController {

    //TODO 后台管理

    @Autowired
    private AdminService adminService;

    public Boolean judgeAdmin(HttpServletRequest request) {
        //判断登录

        HttpSession session = request.getSession();
        Object userIdObj = session.getAttribute("userId");
        if (userIdObj == null) {
            return false;
        }
        int user_Id = Integer.parseInt(userIdObj.toString());
        return adminService.judgeAdmin(user_Id);

    }

    @GetMapping("/getUsersList")
    public R<List<UserVO>> getUsersList(HttpServletRequest request) {
        if(!judgeAdmin(request)){
            return R.error("非管理员账户，没有权限");
        }
        List<UserVO> ret = adminService.getUsersList();
        return R.success(ret);
    }

    /**
     * 封禁/解除封禁用户
     * @param
     * @return
     */
    @PostMapping("/bannedUser")
    public R<String> bannedUser(@RequestBody BannedDTO bannedDTO, HttpServletRequest request) {
        if(!judgeAdmin(request)){
            return R.error("非管理员账户，没有权限");
        }
        int userId = bannedDTO.getId();
        int status = bannedDTO.getStatus();
        int ret = adminService.bannedUser(userId,status);
        if(ret==1){
            return R.success("操作成功");
        }
        else {
            return R.error("操作失败");
        }
    }

    /**
     * 删除用户
     * @param id
     * @return
     */
    @GetMapping("/deleteUser")
    public R<String> deleteUser(@RequestParam int id,HttpServletRequest request){
        if(!judgeAdmin(request)){
            return R.error("非管理员账户，没有权限");
        }
        int ret = adminService.deleteUser(id);
        if(ret==1){
            return R.success("操作成功");
        }
        else {
            return R.error("操作失败");
        }
    }

    /**
     * 封禁/解除封禁文章
     * @param bannedDTO
     * @param bannedDTO
     * @param request
     * @return
     */
    @PostMapping("/setArticle")
    public R<String> setArticle(@RequestBody BannedDTO bannedDTO, HttpServletRequest request) {
        log.info("对文章进行操作{}",bannedDTO);
        if(!judgeAdmin(request)){
            return R.error("非管理员账户，没有权限");
        }
        int articleId = bannedDTO.getId();
        int status = bannedDTO.getStatus();
        int ret = adminService.setArticle(articleId,status);
        if(ret==1){
            return R.success("操作成功");
        }
        else {
            return R.error("操作失败");
        }
    }

    @DeleteMapping("/deleteArticleComment")
    public R<String> deleteArticleComment(@RequestParam int id,HttpServletRequest request){
        log.info("删除文章评论{}",id);
        if(!judgeAdmin(request)){
            return R.error("非管理员账户，没有权限");
        }
        int ret = adminService.deleteArticleComment(id);
        if(ret==1){
            return R.success("操作成功");
        }
        else {
            return R.error("操作失败");
        }
    }
}
