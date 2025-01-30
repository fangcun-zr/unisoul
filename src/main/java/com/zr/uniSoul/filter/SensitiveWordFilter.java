package com.zr.uniSoul.filter;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class SensitiveWordFilter {

    private final Set<String> sensitiveWords;

    public SensitiveWordFilter() {
        // 初始化敏感词库
        sensitiveWords = new HashSet<>();
        sensitiveWords.add("傻逼");
        sensitiveWords.add("贱人");
        // 添加更多敏感词...
    }

    public String filter(String content) {
        if (content == null) {
            // 根据你的需求处理null值，这里直接返回null
            return null;
        }
        for (String word : sensitiveWords) {
            content = content.replaceAll(word, "**"); // 用**替换敏感词
        }
        return content;
    }

}

