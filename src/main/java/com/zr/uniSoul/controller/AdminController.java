package com.zr.uniSoul.controller;

import com.zr.uniSoul.common.R;
import com.zr.uniSoul.pojo.dto.AssessmentDTO;
import com.zr.uniSoul.pojo.dto.BannedDTO;
import com.zr.uniSoul.pojo.dto.WordDTO;
import com.zr.uniSoul.pojo.entity.Topic;
import com.zr.uniSoul.pojo.vo.AssessmentSubmitCountVO;
import com.zr.uniSoul.pojo.vo.AssessmentVO;
import com.zr.uniSoul.pojo.vo.UserVO;
import com.zr.uniSoul.pojo.vo.WordVO;
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
    @PostMapping("/setTopic")
    public R<String> setTopic(@RequestBody BannedDTO bannedDTO, HttpServletRequest request){
        log.info("对话题进行操作{}",bannedDTO);
        if(!judgeAdmin(request)){
            return R.error("非管理员账户，没有权限");
        }
        int topicId = bannedDTO.getId();
        int status = bannedDTO.getStatus();
        int ret = adminService.setTopic(topicId,status);
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

    @PostMapping("/addAssessment")
    public R<String> addAssessment(@RequestBody AssessmentDTO assessmentDTO, HttpServletRequest request) {
        log.info("添加测评{}",assessmentDTO);
        if(!judgeAdmin(request)) {
            return R.error("非管理员账户，没有权限");
        }
        int ret = adminService.addAssessment(assessmentDTO);
        if(ret>0){
            return R.success("操作成功");
        }
        else {
            return R.error("操作失败");
        }

    }

    /**
     * 保存测评
     * @param assessmentDTO
     * @param request
     * @return
     */
    @PostMapping("/saveAssessment")
    public R<String> changeAssessment(@RequestBody AssessmentDTO assessmentDTO, HttpServletRequest request) {
        log.info("保存测评{}",assessmentDTO);
        if(!judgeAdmin(request)) {
            return R.error("非管理员账户，没有权限");
        }
        int ret = adminService.saveAssessment(assessmentDTO);
        if(ret>0){
            return R.success("操作成功");
        }
        else {
            return R.error("操作失败");
        }
    }

    /**
     * 获取测评 的详情（修改测评）
     * @param id
     * @param request
     * @return
     */
    @GetMapping("/changeAssessment")
    public R<AssessmentVO> changeAssessment(@RequestParam int id, HttpServletRequest request) {
        log.info("修改测评{}",id);
        if(!judgeAdmin(request)) {
            return R.error("非管理员账户，没有权限");
        }
       AssessmentVO ret = adminService.changeAssessment(id);
        if(ret!=null){
            return R.success(ret);
        }
        else {
            return R.error("操作失败");
        }
    }

    @DeleteMapping("/deleteQuestion")
    public R<String> deleteQuestion(@RequestParam int id,HttpServletRequest request){
        log.info("删除问题{}",id);
        if(!judgeAdmin(request)) {
            return R.error("非管理员账户，没有权限");
        }
        int ret = adminService.deleteQuestion(id);
        if(ret==1){
            return R.success("操作成功");
        }
        else {
            return R.error("操作失败");
        }
    }

    /**
     * 删除测评
     * @param id
     * @param request
     * @return
     */
    @DeleteMapping("/deleteAssessment")
    public R<String> deleteAssessment(@RequestParam int id,HttpServletRequest request){
        log.info("删除测评{}",id);
        if(!judgeAdmin(request)) {
            return R.error("非管理员账户，没有权限");
        }
        int ret = adminService.deleteAssessment(id);
        if(ret==1){
            return R.success("操作成功");
        }
        else {
            return R.error("操作失败");
        }
    }


    /**
     * 获取所有敏感词
     */
    @GetMapping("/getAllwords")
    public R<List<WordVO>> getSensitiveWords(HttpServletRequest request){
        if(!judgeAdmin(request)) {
            return R.error("非管理员账户，没有权限");
        }
        return R.success(adminService.getAllWords());
    }

    /**
     * 添加敏感词
     */
    @PostMapping("/addWords")
    public R<String> addWords(@RequestBody List<String> words,HttpServletRequest request){
        log.info("添加敏感词{}",words);
        if(!judgeAdmin(request)) {
            return R.error("非管理员账户，没有权限");
        }
        int ret = adminService.addWords(words);
        if(ret >0 ){
            return R.success("操作成功");
        }
        else {
            return R.error("操作失败");
        }
    }

    /**
     * 删除敏感词
     */
    @PostMapping("/deleteWords")
    public R<String> deleteWords(@RequestBody List<Integer> ids,HttpServletRequest request){
        log.info("删除敏感词{}",ids);
        if(!judgeAdmin(request)) {
            return R.error("非管理员账户，没有权限");
        }
        int ret = adminService.deleteWords(ids);
        if(ret >0 ){
            return R.success("操作成功");
        }
        else {
            return R.error("操作失败");
        }
    }

    /**
     * 设置敏感词状态
     */
    @PostMapping("/setWordStatus")
    public R<Integer> setWordsStatus(@RequestBody WordDTO wordDTO, HttpServletRequest request){
        log.info("设置敏感词状态{}",wordDTO);
        if(!judgeAdmin(request)) {
            return R.error("非管理员账户，没有权限");
        }
        int status = adminService.setWordsStatus(wordDTO);
        return R.success(status);

    }

    /**
     * 返回各个测评的提交次数
     */
    @GetMapping("/assessmentSubmitCount")
    public R<Object> assessmentSubmit(HttpServletRequest request){
        if(!judgeAdmin(request)) {
            return R.error("非管理员账户，没有权限");
        }
        log.info("返回各个测评的提交次数");
        List<AssessmentSubmitCountVO> ret = adminService.assessmentSubmitCount();
        if(ret!=null){
            return R.success(ret);
        }
        else{
            return R.error("操作失败");
        }
    }

    /**
     * 返回用户喜好分析
     */
    @GetMapping("/userAnalysis")
    public R<Object> userAnalysis(HttpServletRequest request){
        if(!judgeAdmin(request)) {
            return R.error("非管理员账户，没有权限");
        }
        String ret = adminService.userAnalysis();
        if(ret!=null){
            return R.success(ret);
        }
        else {
            return R.error("操作失败");
        }
    }
    @GetMapping("getHotTopics")
    public R<List<Topic>> getHotTopics(HttpServletRequest request , @RequestParam String startTime , @RequestParam String endTime) {
        if (!judgeAdmin(request)) {
            return R.error("非管理员账户，没有权限");
        }
        log.info("查询开始时间{}，查询结束时间{}",startTime,endTime);
        return R.success(adminService.getHotTopics(startTime, endTime));
    }
}
