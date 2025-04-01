package com.zr.uniSoul.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zr.uniSoul.pojo.entity.Article;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.deeplearning4j.models.embeddings.loader.WordVectorSerializer;
import org.deeplearning4j.models.word2vec.Word2Vec;
import org.springframework.stereotype.Component;
import javax.annotation.PostConstruct;
import java.io.File;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 智能推荐工具类
 * <p>
 * 提供基于语义相似度的标签匹配与得分更新功能，支持从JSON字符串解析标签列表，
 * 并根据用户行为动态更新标签得分。
 * </p>
 */
@Component
@Data
@Slf4j
public class RecommendedUtil {

    private final ObjectMapper mapper = new ObjectMapper();
    private Word2Vec word2VecModel;

    /**
     * 语义相似度匹配阈值，取值范围 [0.0, 1.0]
     * <p>阈值越高，匹配条件越严格</p>
     */
    private static final double SIMILARITY_THRESHOLD = 0.6;

    /**
     * 预训练词向量模型文件路径（需替换为实际路径）
     */
    private static final String WORD_VECTOR_PATH = "src/main/resources/" +
            "Tencent_AILab_ChineseEmbedding/Tencent_AILab_ChineseEmbedding.txt";

    // region ========== 初始化方法 ==========

    /**
     * 初始化词向量模型
     * <p>
     * 在Spring Bean初始化后自动加载预训练的中文词向量模型，
     * 该模型用于后续的语义相似度计算。
     * </p>
     *
     * @throws RuntimeException 模型文件加载失败时抛出异常
     */
    @PostConstruct
    public void initWord2VecModel() {
        try {
            word2VecModel = WordVectorSerializer.readWord2VecModel(new File(WORD_VECTOR_PATH));
        } catch (Exception e) {
            throw new RuntimeException("词向量模型加载失败，请检查文件路径: " + WORD_VECTOR_PATH, e);
        }
    }
    // endregion

    // region ========== 公开方法 ==========

    /**
     * 解析JSON格式的标签字符串为列表
     *
     * @param tags JSON格式的标签字符串，例如：["心理", "焦虑"]
     * @return 解析后的标签列表，解析失败时返回空列表
     */
    public List<String> analyticalTags(String tags) {
        try {
            return mapper.readValue(tags, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            System.err.println("标签解析失败: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * 更新标签得分（基于语义相似度匹配）
     * <p>
     * 处理逻辑：
     * 1. 直接匹配：若标签存在于原始JSON中，直接加分
     * 2. 语义匹配：若标签不存在，寻找语义最相似的已有标签进行加分
     * </p>
     *
     * @param tags      待处理的标签列表（需增加得分的标签）
     * @param jsonInput 原始JSON字符串，格式如 {"心理":85, "学习":75}
     * @return 更新后的JSON字符串，可直接存入数据库的tag_scores字段
     */
    public String updateTagScores(List<String> tags, String jsonInput ,int score) {
        // 将JSON字符串解析为Map结构
        Map<String, Integer> tagScores = parseJsonToMap(jsonInput);

        // 遍历每个标签进行处理
        tags.forEach(tag -> {
            // 直接匹配逻辑
            if (tagScores.containsKey(tag)) {
                tagScores.put(tag, tagScores.get(tag) + score);
                return;
            }

            // 语义相似度匹配逻辑
            Optional<Map.Entry<String, Integer>> bestMatch = findBestMatch(tag, tagScores);
            bestMatch.ifPresent(entry ->
                    tagScores.put(entry.getKey(), entry.getValue() + score)
            );
        });

        // 转换回JSON字符串
        return mapToJson(tagScores);
    }
    // endregion

    // region ========== 内部工具方法 ==========

    /**
     * 将JSON字符串解析为标签得分映射表
     *
     * @param json JSON字符串
     * @return 标签-得分映射表，解析失败时返回空Map
     */
    private Map<String, Integer> parseJsonToMap(String json) {
        if (json == null) {
            throw new IllegalArgumentException("argument \"content\" is null");
        }
        try {
            return mapper.readValue(json, new TypeReference<Map<String, Integer>>() {});
        } catch (JsonProcessingException e) {
            return new HashMap<>();
        }
    }

    /**
     * 将标签得分映射表转换为JSON字符串
     *
     * @param map 标签-得分映射表
     * @return JSON字符串，转换失败时返回空对象"{}"
     */
    private String mapToJson(Map<String, Integer> map) {
        try {
            return mapper.writeValueAsString(map);
        } catch (JsonProcessingException e) {
            return "{}";
        }
    }

    /**
     * 查找与目标标签最相似的已有标签
     *
     * @param targetTag  待匹配的目标标签
     * @param tagScores  已有的标签-得分映射表
     * @return 匹配到的标签条目（包含标签名和当前得分）
     */
    private Optional<Map.Entry<String, Integer>> findBestMatch(
            String targetTag,
            Map<String, Integer> tagScores
    ) {
        return tagScores.entrySet().stream()
                // 计算每个标签与目标标签的相似度
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> calculateSemanticSimilarity(targetTag, entry.getKey())
                ))
                // 过滤出相似度达标的条目
                .entrySet().stream()
                .filter(entry -> entry.getValue() >= SIMILARITY_THRESHOLD)
                // 选择相似度最高的条目
                .max(Map.Entry.comparingByValue())
                .map(entry -> Map.entry(entry.getKey(), tagScores.get(entry.getKey())));
    }

    /**
     * 计算两个标签的语义相似度（基于词向量余弦相似度）
     *
     * @param tag1 标签1
     * @param tag2 标签2
     * @return 相似度值，范围 [-1.0, 1.0]
     */
    private double calculateSemanticSimilarity(String tag1, String tag2) {
        // 分词处理（当前按字符分割，可替换为分词工具）
        List<String> words1 = splitWords(tag1);
        List<String> words2 = splitWords(tag2);

        // 计算词向量平均值
        double[] vec1 = getAverageVector(words1);
        double[] vec2 = getAverageVector(words2);

        // 返回余弦相似度
        return cosineSimilarity(vec1, vec2);
    }

    /**
     * 简单分词方法（按字符分割）
     * <p>
     * 注意：此为简化实现，实际项目建议使用中文分词工具（如HanLP）
     * </p>
     *
     * @param tag 待分词的标签
     * @return 分词后的词汇列表
     */
    private List<String> splitWords(String tag) {
        return Arrays.asList(tag.split(""));
    }

    /**
     * 计算词组的平均向量
     *
     * @param words 分词后的词汇列表
     * @return 平均向量数组
     */
    private double[] getAverageVector(List<String> words) {
        double[] sum = new double[word2VecModel.getLayerSize()];
        int validWords = 0;

        for (String word : words) {
            if (word2VecModel.hasWord(word)) {
                double[] vec = word2VecModel.getWordVector(word);
                for (int i = 0; i < vec.length; i++) {
                    sum[i] += vec[i];
                }
                validWords++;
            }
        }

        // 处理无有效词汇的情况
        if (validWords == 0) return new double[word2VecModel.getLayerSize()];

        // 计算平均值
        for (int i = 0; i < sum.length; i++) {
            sum[i] /= validWords;
        }
        return sum;
    }

    /**
     * 计算两个向量的余弦相似度
     *
     * @param vecA 向量A
     * @param vecB 向量B
     * @return 余弦相似度值，范围 [-1.0, 1.0]
     */
    private double cosineSimilarity(double[] vecA, double[] vecB) {
        double dotProduct = 0.0;
        double normA = 0.0, normB = 0.0;

        for (int i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += Math.pow(vecA[i], 2);
            normB += Math.pow(vecB[i], 2);
        }

        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }


    /**
     * 对文章进行多维度综合排序
     * <p>
     * 权重分配：
     * 1. 标签匹配得分：45%
     * 2. 更新时间新鲜度：11%
     * 3. 浏览数、点赞数、收藏数、评论数：各11%
     * </p>
     */
    public List<Article> sortArticles(List<Article> articles, String jsonInput) {
        // 0. 空列表直接返回
        if (articles == null || articles.isEmpty()) return Collections.emptyList();

        // 1. 解析权重JSON
        Map<String, Integer> tagWeights = parseJsonToMap(jsonInput);

        // 2. 预计算所有文章的指标
        List<Double> tagScores = new ArrayList<>();
        List<Long> updateHours = new ArrayList<>();
        List<Integer> viewCounts = new ArrayList<>();
        List<Integer> likeCounts = new ArrayList<>();
        List<Integer> favoriteCounts = new ArrayList<>();
        List<Integer> commentCounts = new ArrayList<>();

        LocalDateTime now = LocalDateTime.now();

        // 第一轮遍历：收集所有指标
        for (Article article : articles) {
            // 计算标签得分
            List<String> tags = parseArticleTags(article.getTags());
            final int[] score = {0};
            for (String tag : tags) {
                if (tagWeights.containsKey(tag)) {
                    score[0] += tagWeights.get(tag);
                } else {
                    Optional<Map.Entry<String, Integer>> bestMatch = findBestMatch(tag, tagWeights);
                    bestMatch.ifPresent(entry -> score[0] += entry.getValue());
                }
            }
            tagScores.add((double) score[0]);

            // 计算更新时间小时差（处理未来时间）
            LocalDateTime updateTime = article.getUpdate_time();
            long hours = Math.max(0, Duration.between(updateTime, now).toHours());
            updateHours.add(hours);

            // 收集互动数据
            viewCounts.add(article.getViewCount());
            likeCounts.add(article.getLikeCount());
            favoriteCounts.add(article.getFavoriteCount());
            commentCounts.add(article.getCommentCount());
        }

        // 3. 计算归一化参数
        double[] tagRange = getMinMax(tagScores);
        long[] updateRange = getMinMaxLong(updateHours);
        int viewMax = Collections.max(viewCounts);
        int likeMax = Collections.max(likeCounts);
        int favoriteMax = Collections.max(favoriteCounts);
        int commentMax = Collections.max(commentCounts);

        // 4. 第二轮遍历：计算综合得分
        Map<Article, Double> scoreMap = new HashMap<>();
        for (int i = 0; i < articles.size(); i++) {
            Article article = articles.get(i);

            // 标签得分归一化（45%）
            double tagPart = normalize(tagScores.get(i), tagRange[0], tagRange[1]) * 0.45;

            // 更新时间归一化（11%：越新得分越高）
            double updatePart = (1 - normalize(updateHours.get(i), updateRange[0], updateRange[1])) * 0.11;

            // 互动数据归一化（各11%）
            double viewPart = normalize(viewCounts.get(i), 0, viewMax) * 0.11;
            double likePart = normalize(likeCounts.get(i), 0, likeMax) * 0.11;
            double favoritePart = normalize(favoriteCounts.get(i), 0, favoriteMax) * 0.11;
            double commentPart = normalize(commentCounts.get(i), 0, commentMax) * 0.11;

            // 总分计算
            double total = tagPart + updatePart + viewPart + likePart + favoritePart + commentPart;
            scoreMap.put(article, total);
        }

        // 5. 按综合得分排序
        return articles.stream()
                .sorted((a, b) -> Double.compare(scoreMap.get(b), scoreMap.get(a)))
                .collect(Collectors.toList());
    }

    // region ========== 工具方法 ==========
    private double[] getMinMax(List<Double> list) {
        double min = Collections.min(list);
        double max = Collections.max(list);
        return new double[]{min, max};
    }

    private long[] getMinMaxLong(List<Long> list) {
        long min = Collections.min(list);
        long max = Collections.max(list);
        return new long[]{min, max};
    }

    /**
     * 归一化到[0,1]区间
     */
    private double normalize(double value, double min, double max) {
        if (max - min < 1e-6) return 1.0; // 所有值相等时给满分
        return (value - min) / (max - min);
    }

    /**
     * 处理Long类型归一化
     */
    private double normalize(long value, long min, long max) {
        if (max == min) return 1.0;
        return (double)(value - min) / (max - min);
    }

    /**
     * 处理整数归一化
     */
    private double normalize(int value, int min, int max) {
        if (max == min) return 1.0;
        return (double)(value - min) / (max - min);
    }

    /**
     * 解析文章标签（JSON数组字符串 -> List）
     *
     * @param tagsJson 如 "[\"心理\",\"轻解压\",\"治愈\"]"
     * @return 标签列表，解析失败时返回空列表
     */
    private List<String> parseArticleTags(String tagsJson) {
        try {
            return mapper.readValue(tagsJson, new TypeReference<List<String>>() {
            });
        } catch (JsonProcessingException e) {
            log.error("文章标签解析失败: {}", tagsJson, e);
            return Collections.emptyList();
        }
    }

}