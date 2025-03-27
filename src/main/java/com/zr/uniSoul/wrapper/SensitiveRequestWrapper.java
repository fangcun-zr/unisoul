package com.zr.uniSoul.wrapper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.io.IOUtils;
import com.zr.uniSoul.filter.SensitiveWordFilter;
import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * HTTP请求包装器
 * 功能：重写参数获取方法，实现敏感词过滤
 */
public class SensitiveRequestWrapper extends HttpServletRequestWrapper {
    private final SensitiveWordFilter filter;
    private byte[] body;

    public SensitiveRequestWrapper(HttpServletRequest request, SensitiveWordFilter filter) throws IOException {
        super(request);
        this.filter = filter;
        if ("POST".equalsIgnoreCase(request.getMethod())) {
            body = IOUtils.toByteArray(request.getInputStream());
            String contentType = request.getContentType();
            if (contentType != null && contentType.contains("application/json")) {
                String json = new String(body, StandardCharsets.UTF_8);
                json = filterJson(json);
                body = json.getBytes(StandardCharsets.UTF_8);
            }
        }
    }

    private String filterJson(String json) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(json);

            processJsonNode(rootNode); // 递归处理所有节点
            return mapper.writeValueAsString(rootNode);
        } catch (IOException e) {
            // 解析失败时返回原始内容
            return json;
        }
    }

        /**
         * 递归处理JSON节点
         * @param node 当前处理的JSON节点
         */
        private void processJsonNode(JsonNode node){
            if (node.isObject()) {
                // 处理对象类型
                ObjectNode objectNode = (ObjectNode) node;
                objectNode.fields().forEachRemaining(entry -> {
                    JsonNode value = entry.getValue();
                    if (value.isTextual()) {
                        // 字符串类型：执行过滤
                        String filtered = filter.filter(value.asText());
                        objectNode.put(entry.getKey(), filtered);
                    } else if (value.isContainerNode()) {
                        // 容器类型（对象/数组）：递归处理
                        processJsonNode(value);
                    }
                });
            } else if (node.isArray()) {
                // 处理数组类型
                ArrayNode arrayNode = (ArrayNode) node;
                for (int i = 0; i < arrayNode.size(); i++) {
                    JsonNode element = arrayNode.get(i);
                    if (element.isTextual()) {
                        // 字符串元素：执行过滤
                        String filtered = filter.filter(element.asText());
                        arrayNode.set(i, filtered);
                    } else if (element.isContainerNode()) {
                        // 嵌套结构：递归处理
                        processJsonNode(element);
                    }
                }
            }
        }

    @Override
    public String getParameter(String name) {
        String value = super.getParameter(name);
        return value != null ? filter.filter(value) : null;
    }

    @Override
    public ServletInputStream getInputStream() {
        return new CachedInputStream(new ByteArrayInputStream(body != null ? body : new byte[0]));
    }

    private static class CachedInputStream extends ServletInputStream {
        private final ByteArrayInputStream bis;

        public CachedInputStream(ByteArrayInputStream bis) {
            this.bis = bis;
        }

        @Override public int read() { return bis.read(); }
        @Override public boolean isFinished() { return bis.available() == 0; }
        @Override public boolean isReady() { return true; }
        @Override public void setReadListener(ReadListener listener) {}
    }
}