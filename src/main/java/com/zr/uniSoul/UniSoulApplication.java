package com.zr.uniSoul;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Slf4j
@SpringBootApplication
public class UniSoulApplication {
    public static void main(String[] args) {
        SpringApplication.run(UniSoulApplication.class, args);
        log.info("UniSoulApplication 启动成功");
    }
}
