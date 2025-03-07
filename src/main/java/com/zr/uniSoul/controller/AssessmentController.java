package com.zr.uniSoul.controller;

import com.zr.uniSoul.common.R;
import com.zr.uniSoul.pojo.dto.AnswerDTO;
import com.zr.uniSoul.pojo.dto.ReportDTO;
import com.zr.uniSoul.pojo.vo.AssessmentVO;
import com.zr.uniSoul.pojo.vo.QuestionsVo;
import com.zr.uniSoul.pojo.vo.ReportVO;
import com.zr.uniSoul.service.AssessmentService;
import io.swagger.annotations.Api;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * 心理测评板块Controller
 */

@RestController
@RequestMapping("/assessment")
@Api(tags = "测评板块")
@Slf4j
public class AssessmentController {

    @Autowired
    private AssessmentService assessmentService;

    /**
     * 获取测试列表
     *   GET /assessment/list
     *   接口ID：268581116
     *   接口地址：https://app.apifox.com/link/project/5787034/apis/api-268581116
     */
    @RequestMapping("/list")
    public R<AssessmentVO> list(@RequestParam int category_id){
        log.info("获取测评列表category_id:{}",category_id);
        AssessmentVO ret = assessmentService.getAssessments(category_id);
        if (ret != null){
            log.info("获取测评列表成功");
            return R.success(ret);
        }
        return R.error("获取测评列表失败");
    }
    /**
     * 开始测评
     */
    @RequestMapping("/start")
    public R<Object> start(@RequestParam int id, HttpServletRequest request ){
        log.info("开始测评id:{}",id);
        //判断登录
        HttpSession session = request.getSession();
        Object userIdObj = session.getAttribute("userId");
        if (userIdObj == null) {
            return R.error("用户未登录,请先登录");
        }
        int user_Id = Integer.parseInt(userIdObj.toString());

        String sessionUuid = assessmentService.startAssessment(id,user_Id);
        if (sessionUuid != null){
            log.info("开始测评成功");
            return R.success(sessionUuid);
        }
        return R.error("开始测评失败");

    }
    /**
     * 获取测试题目
     */
    @GetMapping("/questions")
    public R<List<QuestionsVo>> getQuestion(@RequestParam Integer id){
        log.info("获取测试题目id:{}",id);
        List<QuestionsVo> ret = assessmentService.getQuestions(id);

        if( ret!= null){
            log.info("获取测试题目成功");
            return R.success(ret);
        }
        return R.error("获取测试题目失败");
    }

    /**
     * 提交测试
     */
    @PostMapping("/submit")
    public R<Object> submit(@RequestBody AnswerDTO answerDTO){
        log.info("提交测试answerDTO:{}",answerDTO);
        ReportVO reportVO = assessmentService.getReport(answerDTO);
        if (reportVO!=null){
            log.info("提交测试成功");
        }
        return R.success(reportVO);
    }

    /**
    保存测试
     */
    @PostMapping("/save")
    public R<Object> save(@RequestBody ReportDTO reportDTO,HttpServletRequest request){
        log.info("保存测试answerDTO:{}",reportDTO);

        //判断登录
        HttpSession session = request.getSession();
        Object userIdObj = session.getAttribute("userId");
        if (userIdObj == null) {
            return R.error("用户未登录,请先登录");
        }
        int user_Id = Integer.parseInt(userIdObj.toString());
       int ret =  assessmentService.save(reportDTO,user_Id);
        if (ret!=0){
            log.info("保存测试成功");
            return R.success("保存测试成功");
        }
        return R.error("保存测试失败");

    }

    /**
     * 获取历史测评结果
     */
    @GetMapping("/history")
    public R<List<ReportVO>> getHistory(HttpServletRequest request){
        log.info("获取历史测评结果");
        //判断登录
        HttpSession session = request.getSession();
        Object userIdObj = session.getAttribute("userId");
        if (userIdObj == null) {
            return R.error("用户未登录,请先登录");
        }
        int user_Id = Integer.parseInt(userIdObj.toString());
        List<ReportVO> ret = assessmentService.getMyReport(user_Id);
        if (ret!=null){
            log.info("获取历史测评结果成功");
            return R.success(ret);
        }
        return R.error("获取历史测评结果失败");
    }



}
