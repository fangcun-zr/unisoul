package com.zr.uniSoul.pojo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
//登录时用到的信息
public class Result {
    private boolean flag;
    private String message;
}
