package com.zr.uniSoul.service.impl;

import com.zr.uniSoul.common.R;
import com.zr.uniSoul.mapper.xtqhMapper;
import com.zr.uniSoul.pojo.dto.UserDTO;
import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.pojo.vo.ArticleLikesVO;
import com.zr.uniSoul.pojo.vo.ArticleVO;
import com.zr.uniSoul.pojo.vo.UserVO;
import com.zr.uniSoul.service.XtqhService;
import com.zr.uniSoul.utils.AliOssUtil;
import com.zr.uniSoul.utils.CheckCode;
import com.zr.uniSoul.utils.MailUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@Slf4j
@Service
public class XtqhServiceImpl implements XtqhService {

    @Autowired
    private xtqhMapper xtqhmapper;

    @Autowired
    private AliOssUtil aliOssUtil;
    @Override
    public User login(User user) {

        return  xtqhmapper.findByPasswordAndUsername(user.getPassword(), user.getUsername());
    }

    /**
     * 发送验证码
     *
     * @param code
     * @param
     * @return
     */
    @Override
    public Boolean sendCheckCode(String email, String code) {
        log.info("验证码为：{}",code);
        return MailUtils.sendMail(email,"你好,欢迎注册学途心绘坊，您的验证码为"+code,"注册验证码");
    }

    /**
     * 用户注册
     * @param user
     * @return
     */
    @Override
    public int register(User user) {
        user.setCreateTime(LocalDateTime.now());
        //设置默认用户昵称
        user.setName("用户"+ user.getUsername());
        // 设置默认头像
        try {
            // 使用ClassPathResource加载类路径资源
            ClassPathResource resource = new ClassPathResource("img/AvatarImg.jpg");

            // 1. 资源存在性验证
            if (!resource.exists()) {
                log.error("默认头像资源未找到: img/AvatarImg.jpg");
                throw new IllegalStateException("系统资源初始化失败");
            }

            // 2. 安全获取文件信息
            String originalFilename = resource.getFilename();
            String extension = originalFilename.contains(".") ?
                    originalFilename.substring(originalFilename.lastIndexOf(".")) :
                    ".jpg";  // 处理无后缀情况

            // 3. 生成唯一文件名
            String objectName = UUID.randomUUID() + extension;

            // 4. 安全读取文件内容（自动关闭流）
            byte[] fileBytes;
            try (InputStream inputStream = resource.getInputStream()) {
                fileBytes = StreamUtils.copyToByteArray(inputStream);
            }

            // 5. 上传OSS（建议添加重试逻辑）
            String filePath = aliOssUtil.upload(fileBytes, objectName);

            // 6. 设置用户头像（添加空值保护）
            if (filePath != null && !filePath.isBlank()) {
                user.setAvatarUrl(filePath);
                log.info("头像上传成功 | 路径: {} | 文件大小: {}字节", filePath, fileBytes.length);
            } else {
                log.warn("OSS返回空路径 | 文件名: {}", objectName);
                throw new RuntimeException("文件存储服务异常");
            }
        } catch (IOException e) {
            log.error("文件IO操作失败 | 错误类型: {} | 详细信息:", e.getClass().getSimpleName(), e);
            throw new RuntimeException("系统文件服务暂时不可用");
        } catch (Exception e) {
            log.error("头像上传未知异常 | 错误类型: {} | 堆栈跟踪:", e.getClass().getSimpleName(), e);
            throw new RuntimeException("用户注册流程异常");
        }
        return xtqhmapper.insert(user.getUsername(), user.getPassword(), user.getEmail(), user.getCreateTime(), user.getName(), user.getAvatarUrl());
    }

    @Override
    public User findByUsername(String username) {
        return xtqhmapper.findByUsername(username);
    }

    @Override
    public int editUserInfo(User user) {
        return xtqhmapper.update(user);
    }

    @Override
    public int follow(int following_id, String follower_name) {

        Integer follower_id = xtqhmapper.findIdByUsername(follower_name);
        log.info("关注者following_id:{},被关注者follower_id:{}",following_id,follower_id);
        if (follower_id == null){
            return 0;
        }
        //先判断是否存在，如果已经存在则不插入数据
        if (xtqhmapper.findFollow(follower_id,following_id) >0){
            return 0;
        }
        return xtqhmapper.follow(follower_id,following_id);
    }
    /**
     * 点赞
     * @param articleLikes
     * @return
     */
    @Override
    public ArticleLikesVO likes(ArticleLikesVO articleLikes) {
        if(!inquireLikeStatus(articleLikes.getUserId(),articleLikes.getArticleId())) {//在没有点赞的情况下
            articleLikes.setLikesCount(articleLikes.getLikesCount() + 1);
            articleLikes.setIsLike(true);
            xtqhmapper.likes(articleLikes.getArticleId(), articleLikes.getLikesCount());//修改文章的点赞数量
            xtqhmapper.likesArticle(articleLikes.getUserId(), articleLikes.getArticleId(), LocalDateTime.now());//添加文章点赞和点赞着的关系
        }else{//已经对文章点过赞了,则取消点赞
            articleLikes.setLikesCount(articleLikes.getLikesCount() - 1);
            articleLikes.setIsLike(false);
            xtqhmapper.likes(articleLikes.getArticleId(), articleLikes.getLikesCount());//修改文章的点赞数量
            xtqhmapper.deleteLikesArticle(articleLikes.getUserId(), articleLikes.getArticleId());//删除文章点赞和点赞着的关系
        }
        return articleLikes;
    }

    @Override
    public int editUserAvatar(String username, String filePath) {
        return xtqhmapper.updateAvatar(username,filePath);
    }

    /**
     * 获取粉丝昵称
     * @param username
     * @return
     */
    @Override
    public List<String> getFollowersByUsername(String username) {
        List<String> list = xtqhmapper.getFollowersByUsername(username);
        return list;
    }

    @Override
    public List<ArticleVO> getMyArticles(int authorId) {
        return xtqhmapper.getMyArticles(authorId);
    }

    /**
     * 查询点赞状态
     * @param userId
     * @param articleId
     * @return
     */
    @Override
    public boolean inquireLikeStatus(Long userId, int articleId) {
        Integer status = xtqhmapper.inquireLikeStatus(userId, articleId);
        if (status == null) {
            return false;//代表没有点赞
        } else {
            return true;//代表点过赞了
        }
    }

    /**
     * 收藏文章
     * @param userId
     * @param articleId
     * @return
     */
    @Override
    public int collectArticle(int userId, int articleId) {
        xtqhmapper.addFavoriteCount(articleId);
        return xtqhmapper.collectArticle(userId, articleId);
    }

    /**
     * 判断是否收藏
     * @param userId
     * @param articleId
     * @return
     */
    @Override
    public int isCollect(int userId, int articleId) {
        return xtqhmapper.isCollect(userId, articleId);
    }

    @Override
    public int cancelCollect(int userId, int articleId) {
        xtqhmapper.reduceFavoriteCount(articleId);
        return xtqhmapper.cancelCollect(userId, articleId);
    }

    /**
     * 获取粉丝列表
     * @param userId
     * @return
     */
    @Override
    public List<UserVO> getFollowersList(Integer userId) {
        return xtqhmapper.getFollowersList(userId);
    }

    /**
     * 获取关注列表
     * @param userId
     * @return
     */
    @Override
    public List<UserVO> getFollowList(Integer userId) {
       return xtqhmapper.getFollowingsList(userId);
    }

    /**
     * 获取文章收藏列表
     * @param id
     * @return
     */
    @Override
    public List<ArticleVO> getMyArticleCollect(int id) {
        return xtqhmapper.getMyArticleCollect(id);
    }

    /**
     * 获取我的个人信息
     * @param id
     * @return
     */
    @Override
    public UserVO getinformation(int id) {
        return xtqhmapper.getinformation(id);
    }

    /**
     * 找回密码
     * @param user
     * @return
     */
    @Override
    public String findPassword(UserDTO user) {
        //用户名和邮箱是否匹配
        String email = xtqhmapper.findEmainlByUsername(user.getUsername());
        log.info("email:{}",email);
        if(email == null){
            return null;
        }
        if(user.getEmail().equals(email)){

            //生成验证码
            String Code = CheckCode.generateVerificationCode();
            //发送验证码
            MailUtils.sendMail(email,"你好,欢迎注册学途心绘坊，您的验证码为"+Code,"注册验证码");
            return Code;
        }
        return null;
    }

    @Override
    public int changePassWord(String username, String password) {
        return xtqhmapper.changePassWord(username,password);
    }

}
