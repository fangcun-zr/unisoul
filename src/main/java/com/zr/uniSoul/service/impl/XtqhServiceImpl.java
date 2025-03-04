package com.zr.uniSoul.service.impl;

import com.zr.uniSoul.mapper.xtqhMapper;
import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.pojo.vo.ArticleLikesVO;
import com.zr.uniSoul.pojo.vo.ArticleVO;
import com.zr.uniSoul.service.XtqhService;
import com.zr.uniSoul.utils.AliOssUtil;
import com.zr.uniSoul.utils.MailUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.File;
import java.io.IOException;
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
        //设置默认头像
        File file = new File("img/AvatarImg.jpg");
        //将项目中的默认头像上传至阿里云
        log.info("头像上传:{}",file);
        try {
            //原始文件名
            String originalFilename = file.getName();
            //截取原始文件后缀  xxx.png
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            //生成新的文件名
            String objectName = UUID.randomUUID().toString() + extension;
            //上传文件
            byte[] fileBytes = Files.readAllBytes(Paths.get(ClassLoader.getSystemResource("img/AvatarImg.jpg").toURI()));

            String filePath = aliOssUtil.upload(fileBytes, objectName);
            //将上传后的文件路径存入数据库
            user.setAvatarUrl(filePath);
            log.info("上传成功:{}",filePath);
        } catch (IOException e) {
            log.error("文件上传失败:{}",e);
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
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
    public int follow(int user_id, String following_name) {
        Integer following_id = xtqhmapper.findIdByUsername(following_name);
        log.info("following_id:{}",following_id);
        if (following_id == null){
            return 0;
        }
        //先判断是否存在，如果已经存在则不插入数据
        if (xtqhmapper.findFollow(user_id,following_id) >0){
            return 0;
        }
        return xtqhmapper.follow(user_id,following_id);
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
        }else{//已经对文章点过赞了
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
}
