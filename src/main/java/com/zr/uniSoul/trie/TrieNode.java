package com.zr.uniSoul.trie;

import java.util.HashMap;
import java.util.Map;

/**
 * 前缀树节点结构
 * - children: 子节点映射表（字符 -> 子节点）
 * - isKeywordEnd: 标识是否敏感词结尾
 */

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class TrieNode {
    // 使用线程安全的ConcurrentHashMap存储子节点
    private final Map<Character, TrieNode> children = new ConcurrentHashMap<>();
    // 使用volatile保证状态可见性
    private volatile boolean isKeywordEnd;

    /**
     * 获取子节点（线程安全）
     */
    public TrieNode getChild(Character c) {
        return children.get(c);
    }

    /**
     * 添加子节点（线程安全）
     */
    public void addChild(Character c, TrieNode node) {
        children.put(c, node);
    }

    /**
     * 原子性获取或创建子节点（新增方法）
     */
    public TrieNode getOrAddChild(Character c) {
        return children.computeIfAbsent(c, k -> new TrieNode());
    }

    /**
     * 标准设置结束标志
     */
    public void setKeywordEnd(boolean isKeywordEnd) {
        this.isKeywordEnd = isKeywordEnd;
    }

    /**
     * 原子设置结束标志（新增方法）
     */
    public void setKeywordEndAtomic(boolean isKeywordEnd) {
        this.isKeywordEnd = isKeywordEnd;
    }

    /**
     * 判断是否关键词结尾
     */
    public boolean isKeywordEnd() {
        return isKeywordEnd;
    }
}