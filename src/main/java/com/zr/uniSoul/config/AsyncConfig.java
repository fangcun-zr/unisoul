package com.zr.uniSoul.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.Executor;

@Configuration
@EnableAsync // 启用异步支持
public class AsyncConfig {

    @Bean("asyncExecutor") // 定义线程池Bean
    public Executor asyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        // 核心线程数（默认常驻线程）
        executor.setCorePoolSize(10);
        // 最大线程数（根据负载动态扩容）
        executor.setMaxPoolSize(100);
        // 队列容量（缓冲待执行任务）
        executor.setQueueCapacity(50);
        // 线程名前缀（便于日志跟踪）
        executor.setThreadNamePrefix("Async-Executor-");
        // 拒绝策略（队列满时由调用线程直接执行）
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        // 初始化
        executor.initialize();
        return executor;
    }
}
