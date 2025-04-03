package com.zr.uniSoul.filter;

import com.zr.uniSoul.mapper.SensitiveWordRepository;
import com.zr.uniSoul.trie.TrieNode;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.CharUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.List;


/**
 * 敏感词过滤核心逻辑
 * 功能：初始化词库、构建前缀树、执行过滤替换
 */
@Component
@Slf4j
public class SensitiveWordFilter {
    private final Object lock = new Object(); // 刷新锁
    private static final String REPLACEMENT = "**";
    private TrieNode root = new TrieNode();

    @Autowired
    private SensitiveWordRepository repository;




    @PostConstruct
    public void init() {

        log.info("敏感词库加载开始");
        List<String> words = repository.findAllActiveWords();
        log.info("敏感词库加载完成，共加载{}个敏感词", words.size());
        words.forEach(this::addKeyword);

        log.info(("[敏感词库] 我操示例检测结果：" + filter("测试我操")));
    }

    private void addKeyword(String keyword) {
        if (keyword.length() < 2) return;

        TrieNode tempNode = root;
        for (int i = 0; i < keyword.length(); i++) {
            char c = keyword.charAt(i);
            TrieNode subNode = tempNode.getChild(c);

            if (subNode == null) {
                subNode = new TrieNode();
                tempNode.addChild(c, subNode);
            }
            tempNode = subNode;

            if (i == keyword.length() - 1) {
                tempNode.setKeywordEnd(true);
            }
        }
    }

    public String filter(String text) {
        if (StringUtils.isBlank(text)) {
            return text;
        }

        // 使用局部变量保持当前词库引用
        final TrieNode currentRoot;
        synchronized (lock) {
            currentRoot = this.root; // 原子获取当前词库快照
        }

        // 以下过滤逻辑无需同步，使用快照版本
        StringBuilder result = new StringBuilder();
        int begin = 0;
        int end = 0;
        TrieNode tempNode = currentRoot;

        while (end < text.length()) {
            char c = text.charAt(end);

            if (isSymbol(c)) {
                if (tempNode == currentRoot) {
                    result.append(c);
                    begin++;
                }
                end++;
                continue;
            }

            tempNode = tempNode.getChild(c);
            if (tempNode == null) {
                result.append(text.charAt(begin));
                end = ++begin;
                tempNode = currentRoot;
            } else if (tempNode.isKeywordEnd()) {
                result.append(REPLACEMENT);
                begin = ++end;
                tempNode = currentRoot;
            } else {
                end++;
            }
        }
        result.append(text.substring(begin));
        return result.toString();
    }
    private boolean isSymbol(char c) {
        return !CharUtils.isAsciiAlphanumeric(c) && (c < 0x2E80 || c > 0x9FFF);
    }

    /**
     * 公开的刷新接口
     */
    public void reloadFromDatabase() {
        TrieNode newRoot = new TrieNode();

        List<String> words = repository.findAllActiveWords();
        words.parallelStream().forEach(word -> {
            TrieNode node = newRoot;
            for (char c : word.toCharArray()) {
                node = node.getOrAddChild(c);
            }
            node.setKeywordEndAtomic(true);
        });

        synchronized (lock) {
            this.root = newRoot; // 原子替换根节点
        }
    }


    /**
     * 私有方法：向指定节点添加关键词（线程安全）
     */
    private void addKeywordToNode(String keyword, TrieNode node) {
        for (int i = 0; i < keyword.length(); i++) {
            char c = keyword.charAt(i);
            TrieNode subNode = node.getChild(c);

            if (subNode == null) {
                subNode = new TrieNode();
                node.addChild(c, subNode);
            }
            node = subNode;

            if (i == keyword.length() - 1) {
                node.setKeywordEnd(true);
            }
        }
    }
}