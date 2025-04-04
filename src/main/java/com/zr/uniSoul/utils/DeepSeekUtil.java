package com.zr.uniSoul.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zr.uniSoul.pojo.dto.AnswerDTO;
import com.zr.uniSoul.pojo.entity.Options;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@Data
public class DeepSeekUtil {

    // 从配置注入API信息
    @Value("${ai.config.deepseek.apiKey}")
    private String apiKey;

    @Value("${ai.config.deepseek.baseUrl}")
    private String apiUrl;

    private final CloseableHttpClient httpClient = HttpClients.createDefault();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 生成心理评估报告
     * @param answerDTO 用户回答数据传输对象
     * @return DeepSeek生成的评估报告
     * @throws AssessmentException 自定义异常包含错误信息
     */
    public String generateAssessmentReport(AnswerDTO answerDTO) throws AssessmentException {
        try {
            // 1. 构建对话消息
            List<Map<String, String>> messages = buildMessages(answerDTO.getAnswers());

            // 2. 创建HTTP请求
            HttpPost httpPost = createRequest(messages);

            // 3. 执行请求并解析响应
            return executeAndParseResponse(httpPost);
        } catch (IOException e) {
            log.error("API调用IO异常: {}", e.getMessage());
            throw new AssessmentException("API通信异常，请检查网络连接");
        } catch (Exception e) {
            log.error("评估报告生成失败: {}", e.getMessage());
            throw new AssessmentException("系统处理异常，请联系管理员");
        }
    }

    /**
     * 构建对话消息结构
     */
    private List<Map<String, String>> buildMessages(List<Options> answers) {
        List<Map<String, String>> messages = new ArrayList<>();

        // 系统角色设定
        Map<String, String> systemMsg = new HashMap<>();
        systemMsg.put("role", "system");
        systemMsg.put("content", "你是一名专业心理医生，需要根据以下评估结果："
                + "1. 分析用户的潜在心理状态\n"
                + "2. 给出专业建议\n"
                + "3. 使用中文以正式但易懂的语气回答\n"
                + "4. 结果分为'分析结论'和'专业建议'两部分，各两部分" +
                "，并且不用完全把每一个回答都回复，应该是分析所有的整体问题与回答，然后得出'分析结论'和'专业建议'各200字左右\n" +
                "5.并且你的回复形式应该是对第一人称如称号'您'来回答，并且保持一定的关怀语气");
        messages.add(systemMsg);

        // 用户回答内容
        Map<String, String> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", buildUserContent(answers));
        messages.add(userMsg);

        return messages;
    }

    /**
     * 构建用户消息内容
     */
    private String buildUserContent(List<Options> answers) {
        StringBuilder sb = new StringBuilder("请分析以下心理评估结果：\n");
        for (int i = 0; i < answers.size(); i++) {
            Options option = answers.get(i);
            sb.append(String.format("%d. 问题：%s | 回答：%s\n",
                    i+1, option.getTopic(), option.getOptions()));
        }
        return sb.toString();
    }

    /**
     * 创建HTTP请求对象
     */
    private HttpPost createRequest(List<Map<String, String>> messages) throws IOException {
        HttpPost httpPost = new HttpPost(apiUrl);
        httpPost.setHeader("Content-Type", "application/json");
        httpPost.setHeader("Authorization", "Bearer " + apiKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "deepseek-chat");
        requestBody.put("messages", messages);
        requestBody.put("stream", false);  // 关闭流式传输
        requestBody.put("temperature", 0.7);  // 控制生成随机性

        StringEntity entity = new StringEntity(
                objectMapper.writeValueAsString(requestBody),
                StandardCharsets.UTF_8
        );
        httpPost.setEntity(entity);

        return httpPost;
    }

    /**
     * 执行请求并解析响应
     */
    private String executeAndParseResponse(HttpPost httpPost) throws IOException {
        try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
            int statusCode = response.getStatusLine().getStatusCode();

            if (statusCode != 200) {
                throw new IOException("API返回异常状态码: " + statusCode);
            }

            JsonNode rootNode = objectMapper.readTree(
                    response.getEntity().getContent()
            );

            // 解析响应结构
            JsonNode choices = rootNode.path("choices");
            if (choices.isEmpty()) {
                throw new IOException("API返回数据格式异常");
            }

            return choices.get(0)
                    .path("message")
                    .path("content")
                    .asText("未能获取有效响应");
        }
    }

    // 自定义异常类
    public static class AssessmentException extends Exception {
        public AssessmentException(String message) {
            super(message);
        }
    }
}