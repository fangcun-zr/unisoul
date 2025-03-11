package com.zr.uniSoul.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
public class AiConsultUtil {

    // 从配置注入API信息
    @Value("${ai.config.deepseek.apiKey}")
    private String apiKey;

    @Value("${ai.config.deepseek.baseUrl}")
    private String apiUrl;

    private final CloseableHttpClient httpClient = HttpClients.createDefault();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 生成回复（新增history参数）
     * @param history 完整对话历史（包含用户和AI的交替消息）
     * @param newQuestion 用户新问题
     */
    public String getReply(List<Map<String, String>> history, String newQuestion)
            throws AssessmentException {


            // 构建包含历史的消息列表
            List<Map<String, String>> messages = buildMessages(history, newQuestion);

            // 创建请求对象
        HttpPost httpPost = null;
        try {
            httpPost = createRequest(messages);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        // 执行请求并解析
        try {
            return executeAndParseResponse(httpPost);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

    /**
     * 构建包含历史的消息结构
     */
    private List<Map<String, String>> buildMessages(
            List<Map<String, String>> history,
            String newQuestion
    ) {
        List<Map<String, String>> messages = new ArrayList<>();

        // 系统消息（只在首轮添加）
        if (history.isEmpty()) {
            messages.add(Map.of(
                    "role", "system",
                    "content", "你是一名专业的心理咨询师..."
            ));
        }

        // 添加历史对话
        messages.addAll(history);

        // 添加新问题
        messages.add(Map.of(
                "role", "user",
                "content", newQuestion
        ));

        return messages;
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
