package com.zr.uniSoul.pojo.vo;

import lombok.Data;

/**
 * User的返回类
 */
@Data
public class UserVO {
//    id,created_at,email,username,name,age,gender,school,biography,avatarUrl,status
    private int id;
    private String createdAt;
    private String email;
    private String username;
    private String name;
    private int age;
    private String gender;
    private String school;
    private String biography;
    private String avatarUrl;
    private int status;
    private int isAdmin;
    private int category;

}
