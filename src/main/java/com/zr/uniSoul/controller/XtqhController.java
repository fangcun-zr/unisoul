package com.zr.uniSoul.controller;

import com.zr.uniSoul.common.R;
import com.zr.uniSoul.pojo.dto.UserDTO;
import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.pojo.vo.ArticleLikesVO;
import com.zr.uniSoul.pojo.vo.ArticleVO;
import com.zr.uniSoul.pojo.vo.FollowersVO;
import com.zr.uniSoul.service.XtqhService;
import com.zr.uniSoul.utils.AliOssUtil;
import com.zr.uniSoul.utils.CheckCode;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/xtqh")
@Api(tags = "学途启航")
@Slf4j
public class XtqhController {

    @Autowired
    private XtqhService xtqhService;

    @Autowired
    private AliOssUtil aliOssUtil;

    /**
     * 用户登录
     * @param request
     * @param user
     * @return
     */
    @PostMapping("/login")
    @ApiOperation("用户登录接口")
    public R<User> login(HttpServletRequest request, @RequestBody User user){
        log.info("用户登录接口");
        //TODO:添加JWT或MD5加密处理

        User loginUser = xtqhService.login(user);
        if (loginUser != null){
            log.info("用户登录成功");
            //将用户的用户名存入session
            request.getSession().setAttribute("username",user.getUsername());
            //将用户的用户id存入session
            request.getSession().setAttribute("userId",loginUser.getId());
            return R.success(loginUser);
        }
        return R.error("用户名或密码错误");
    }
    @GetMapping("sendCheckCode")
    @ApiOperation("发送验证码")
    public R<String> sendCheckCode(HttpServletRequest request, @RequestParam String email){
        log.info("发送验证码");
        //获取验证码
        String Code = CheckCode.generateVerificationCode();
        //发送验证码
        Boolean flag = xtqhService.sendCheckCode(email,Code);
        if (flag){
            log.info("验证码发送成功");
            return R.success(Code);
        }
        log.info("验证码发送失败");
        return R.error("验证码发送失败，请检查邮箱是否正确");
    }
    @PostMapping("register")
    @ApiOperation("用户注册接口")
    public R<String> register(HttpServletRequest request, @RequestBody User user){
        log.info("用户注册接口");
        //TODO:添加JWT  ，MD5加密处理
        //先判断用户名是否已经存在
        User user1 = xtqhService.findByUsername(user.getUsername());
        if (user1 != null){
            log.info("用户名已存在");
            return R.error("用户名已存在");
        }
        int ret = xtqhService.register(user);
        if (ret != 0){
            log.info("用户注册成功");
            //将用户的用户名存入session
            request.getSession().setAttribute("username",user.getUsername());
            return R.success("注册成功");
        }
        return R.error("用户注册失败");
    }
    /**
     * 编辑个人信息
     */
    @PostMapping(value = "/information" , consumes = "application/json")
    @ApiOperation("编辑个人信息")
    public R<String> editUserInfo(HttpServletRequest request,
                                  @RequestBody UserDTO userDTO
                                  ){
        log.info("编辑个人信息接口");


        HttpSession session =  request.getSession();
        userDTO.setUsername(session.getAttribute("username").toString());
        //保存个人信息
        User user = User.builder()
                .age(userDTO.getAge())
                .school(userDTO.getSchool())
                .name(userDTO.getName())
                .gender(userDTO.getGender())
                .biography(userDTO.getBiography())
                .username(userDTO.getUsername())
                .build();


        int ret = xtqhService.editUserInfo(user);
        if (ret != 0){
            log.info("编辑个人信息成功");
            return R.success("编辑个人信息成功");
        }
        return R.error("编辑个人信息失败");
    }

    /**
     * 更改头像
     */
    @PostMapping(value = "/changeAvatar")
    @ApiOperation("更改头像")
    public R<String> editUserAvatar(HttpServletRequest request,
                                  @RequestParam("avatar") MultipartFile file
                                  ){
        log.info("更改头像接口");
        HttpSession session =  request.getSession();
        String username = session.getAttribute("username").toString();

        String filePath = "";
                //将头像图片存入阿里云
        try {
            //原始文件名
            String originalFilename = file.getOriginalFilename();
            //截取原始文件后缀  xxx.png
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            //生成新的文件名
            String objectName = UUID.randomUUID().toString() + extension;
            //上传文件
            filePath = aliOssUtil.upload(file.getBytes(), objectName);
        } catch (IOException e) {
            log.error("文件上传失败:{}",e);
        }

        int ret = xtqhService.editUserAvatar(username,filePath);
        if (ret != 0){
            log.info("更改头像成功");
            return R.success(filePath);
        }
        return R.error("更改头像失败");
    }
    /**
     * 关注
     */
    @GetMapping("follow")
    @ApiOperation("关注")
    public R<String> follow(@RequestParam("username") String username, HttpServletRequest request) {
        log.info("关注接口, 关注: {}", username);

        if (username == null || username.isEmpty()) {
            return R.error("用户名不能为空");
        }

        HttpSession session = request.getSession();
        Object userIdObj = session.getAttribute("userId");
        if (userIdObj == null) {
            return R.error("用户未登录");
        }

        int user_Id = Integer.parseInt(userIdObj.toString());
        int ret = xtqhService.follow(user_Id, username);

        if (ret == 0) {
            log.info("关注失败");
            return R.error("关注失败");
        }
        return R.success("关注成功");
    }

    /**
     * 点赞
     * @param ArticleId
     * @param LikesCount
     * @return
     */
    @GetMapping("/likes")
    @ApiOperation("点赞")
    public R<ArticleLikesVO> likes(HttpServletRequest request,@RequestParam int ArticleId, int LikesCount ,boolean isLike){
        ArticleLikesVO articleLikesVO = new ArticleLikesVO();
        articleLikesVO.setLikesCount(LikesCount);
        articleLikesVO.setArticleId(ArticleId);
        if(!new Boolean(isLike).booleanValue()) isLike = false;
        articleLikesVO.setIsLike(isLike);
        String name = request.getSession().getAttributeNames().nextElement();
        Long userId = (Long)request.getSession().getAttribute("userId");
        articleLikesVO.setUserId(userId);
        log.info("点赞接口, 点赞: {}", articleLikesVO);
        articleLikesVO  = xtqhService.likes(articleLikesVO);
        return R.success(articleLikesVO);
    }

    /**
     * 获取粉丝昵称
     * @return
     */
    @GetMapping("/followers")
    @ApiOperation("获取粉丝昵称")
    public R<FollowersVO> getFollowers(@RequestParam String username){
        log.info("获取粉丝昵称接口,{}", username);
        FollowersVO followersVO = new FollowersVO();
        List<String> followers = xtqhService.getFollowersByUsername(username);
        followersVO.setFollowers(followers);
        followersVO.setFollowersCount(followers.size());
        return R.success(followersVO);
    }
    /**
     * 获取我的文章列表哦
     */
    @GetMapping("/getMyArticles")
    @ApiOperation("获取我的文章列表")
    public R<List<ArticleVO>> getMyArticle(HttpServletRequest request){
        log.info("获取我的文章列表接口");
        HttpSession session = request.getSession();
        String userId = session.getAttribute("userId").toString();
        List<ArticleVO> articleVOList = xtqhService.getMyArticles(Integer.parseInt(userId));
        if (articleVOList == null || articleVOList.isEmpty()) {
            log.info("获取我的文章列表失败");
            return R.error("获取我的文章列表失败");
        }
        return R.success(articleVOList);
    }

}
