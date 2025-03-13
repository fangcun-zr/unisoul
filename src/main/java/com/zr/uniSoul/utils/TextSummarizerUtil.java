package com.zr.uniSoul.utils;

import com.hankcs.hanlp.HanLP;
import com.hankcs.hanlp.seg.common.Term;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
@Data
public class TextSummarizerUtil {

    // 中文停用词表（部分示例，实际需更完整）
    private static final Set<String> CN_STOP_WORDS = new HashSet<>(Arrays.asList(
            "的", "了", "是", "在", "和", "有", "就", "都", "而", "及", "与", "这", "那", "你", "我", "他"
    ));

    // 英文停用词表
    private static final Set<String> EN_STOP_WORDS = new HashSet<>(Arrays.asList(
            "a", "an", "the", "in", "on", "at", "to", "of", "and", "or", "is", "are", "was", "were"
    ));

    /**
     * 生成文本摘要
     * @param text 原始文本
     * @param ratio 摘要比例（0-1）
     * @return 摘要文本
     */
    public static String summarize(String text, float ratio) {
        // 预处理文本
        String processedText = preprocessText(text);

        // 分句处理
        List<String> sentences = splitSentences(processedText);
        if (sentences.isEmpty()) return "";

        // 计算词频
        Map<String, Integer> wordFrequencies = calculateWordFrequencies(sentences);

        // 计算句子权重
        Map<String, Double> sentenceScores = calculateSentenceScores(sentences, wordFrequencies);

        // 选择关键句子
        List<String> selectedSentences = selectKeySentences(sentences, sentenceScores, ratio);

        // 生成连贯摘要
        return generateSummary(selectedSentences);
    }

    private static String preprocessText(String text) {
        return text.replaceAll("\\s+", " ")    // 合并空白字符
                .replaceAll("(?m)^\\s*", "") // 去除行首空白
                .trim();
    }

    private static List<String> splitSentences(String text) {
        // 支持中英文分句
        return Arrays.stream(text.split("[。！？!?]+\\s*"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    private static Map<String, Integer> calculateWordFrequencies(List<String> sentences) {
        Map<String, Integer> frequencies = new HashMap<>();
        for (String sentence : sentences) {
            for (String word : tokenize(sentence)) {
                if (!isStopWord(word)) {
                    frequencies.put(word, frequencies.getOrDefault(word, 0) + 1);
                }
            }
        }
        return frequencies;
    }

    private static Map<String, Double> calculateSentenceScores(List<String> sentences,
                                                               Map<String, Integer> wordFrequencies) {
        Map<String, Double> scores = new LinkedHashMap<>();
        int sentenceCount = sentences.size();

        for (int i = 0; i < sentenceCount; i++) {
            String sentence = sentences.get(i);
            List<String> words = tokenize(sentence);

            // 词频得分
            double frequencyScore = words.stream()
                    .mapToInt(word -> wordFrequencies.getOrDefault(word, 0))
                    .sum();

            // 位置得分（首尾句子权重更高）
            double positionWeight = 1.0;
            if (i == 0 || i == sentenceCount - 1) {
                positionWeight = 1.5;
            } else {
                positionWeight = 1.0 - (0.1 * Math.abs(sentenceCount/2 - i));
            }

            scores.put(sentence, frequencyScore * positionWeight);
        }
        return scores;
    }

    private static List<String> selectKeySentences(List<String> sentences,
                                                   Map<String, Double> sentenceScores,
                                                   float ratio) {
        int targetSize = Math.max(1, (int) (sentences.size() * ratio));

        return sentences.stream()
                .sorted(Comparator.comparingDouble(sentenceScores::get).reversed())
                .limit(targetSize)
                .sorted(Comparator.comparingInt(sentences::indexOf)) // 保持原顺序
                .collect(Collectors.toList());
    }

    private static String generateSummary(List<String> selectedSentences) {
        String summary = String.join("。 ", selectedSentences);
        if (!summary.endsWith("。")) summary += "。";
        return summary.replaceAll("。+", "。");  // 合并多余句号
    }


    private static List<String> tokenize(String sentence) {
        // 使用HanLP进行标准分词
        List<Term> termList = HanLP.segment(sentence);

        return termList.stream()
                .map(term -> term.word.toLowerCase()) // 统一转小写
                .filter(word -> !word.trim().isEmpty())
                .filter(word -> word.length() > 1 || word.matches("\\w")) // 保留单字母英文
                .collect(Collectors.toList());
    }

    private static boolean isStopWord(String word) {
        return CN_STOP_WORDS.contains(word) || EN_STOP_WORDS.contains(word);
    }

//    public static void main(String[] args) {
//        String text = "好的，用户需要我帮忙生成一个Java工具类，用于智能概括大段文本，同时保证语句流畅。首先，我得理解用户的具体需求。用户提到的“智能概要”可能是指生成简洁且保留主要信息的摘要，而不仅仅是简单的截断。因此，我需要考虑使用自然语言处理的技术或者现有的库来实现这一点。\n" +
//                "\n" +
//                "首先，考虑Java中是否有现成的库或者API可以处理文本摘要。我知道OpenAI的API可以生成摘要，但用户可能希望本地处理，避免网络请求。另外，Stanford CoreNLP可能有相关的模块，或者Apache OpenNLP。但如果是纯Java实现，可能需要依赖这些库。\n" +
//                "\n" +
//                "或者，用户可能想要一个基于规则的简单实现，比如提取关键句子。这时候可以考虑基于词频或者句子位置的方法。例如，TF-IDF或者TextRank算法。但TextRank需要构建句子之间的相似度矩阵，计算复杂度可能较高，对于大段文本处理时间可能较长。\n" +
//                "\n" +
//                "用户的需求是保证语句流畅，所以生成的摘要不能是断断续续的句子，需要连贯。因此，可能需要选择重要的句子，同时保持它们的顺序，这样摘要会更连贯。\n" +
//                "\n" +
//                "接下来，我需要确定工具类的结构。工具类应该是静态方法，接收文本和摘要长度参数。可能还需要处理不同的分割方式，比如按句子分割，或者按段落分割。\n";
//        System.out.println(summarize(text, 0.3f));
//    }
}
