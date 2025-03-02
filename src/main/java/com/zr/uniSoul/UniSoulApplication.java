package com.zr.uniSoul;

import lombok.extern.slf4j.Slf4j;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Slf4j
@SpringBootApplication
@MapperScan("com.zr.uniSoul.mapper")
@EnableTransactionManagement
public class UniSoulApplication {
    public static void main(String[] args) {
        SpringApplication.run(UniSoulApplication.class, args);
        log.info("UniSoulApplication 启动成功");
        log.info("localhost:8080/UniSoul/html/login.html");
    }
}
