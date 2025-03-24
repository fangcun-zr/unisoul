package com.zr.uniSoul.reloader;


import com.zr.uniSoul.filter.SensitiveWordFilter;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SensitiveWordReloader {
    private final SensitiveWordFilter filter;

    public SensitiveWordReloader(SensitiveWordFilter filter) {
        this.filter = filter;
    }

    @Scheduled(fixedRate = 30 * 60 * 1000)
    public void reload() {
        filter.reloadFromDatabase();
    }
}