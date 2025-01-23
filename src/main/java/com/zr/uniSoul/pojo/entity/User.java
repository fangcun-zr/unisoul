package com.zr.uniSoul.pojo.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 用户信息
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;
    //用户名
    private String username;
    //邮箱
    private String email;
    //密码
    private String password;

    private LocalDateTime createTime;//创建时间
    //昵称
    private String name;
    //年龄
    private int age;
    //性别  1:男；2：女
    private int Gender;
    //学校
    private String school;
    //简介
    private String biography;

    public void setAge(String age) {
        if (age != null) {
            this.age = Integer.parseInt(age);
        }
    }

    public void setGender(String gender) {
        if (gender != null) {
            if(gender.equals("男")) {
                this.Gender = 1;
            }else if(gender.equals("女")) {
                this.Gender = 2;
            }
        }
    }
}
