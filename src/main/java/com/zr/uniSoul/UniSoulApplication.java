package com.zr.uniSoul;

import lombok.extern.slf4j.Slf4j;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Slf4j
@SpringBootApplication
@MapperScan("com.zr.uniSoul.mapper")
public class UniSoulApplication {
    public static void main(String[] args) {
        SpringApplication.run(UniSoulApplication.class, args);
        log.info("UniSoulApplication 启动成功");
    }
}
