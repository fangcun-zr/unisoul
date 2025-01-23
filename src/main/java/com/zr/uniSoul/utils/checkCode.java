package com.zr.uniSoul.utils;

import java.util.Random;

public class checkCode {

    // 定义验证码字符集，包括数字和大小写字母
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    // 创建一个Random对象用于生成随机数
    private static final Random random = new Random();

    /**
     * 生成一个四个字符的验证码
     * @return 四个字符的验证码
     */
    public static String generateVerificationCode() {
        StringBuilder code = new StringBuilder(4);
        for (int i = 0; i < 4; i++) {
            // 生成一个随机索引，并从字符集中取出对应的字符
            int randomIndex = random.nextInt(CHARACTERS.length());
            code.append(CHARACTERS.charAt(randomIndex));
        }
        return code.toString();
    }

    public static void main(String[] args) {
        // 测试生成验证码的方法
        String verificationCode = generateVerificationCode();
        System.out.println("生成的验证码是: " + verificationCode);
    }
}
