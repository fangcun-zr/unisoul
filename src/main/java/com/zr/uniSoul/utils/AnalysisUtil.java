package com.zr.uniSoul.utils;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@Component
public class AnalysisUtil {
    public static String calculateAverages(List<String> dataList) {
        Gson gson = new Gson();
        Map<String, Double> sumMap = new HashMap<>();
        int count = 0;

        for (String dataStr : dataList) {
            try {
                // 确保字符串是有效的JSON对象
                String trimmedStr = dataStr.trim();
                if (!trimmedStr.startsWith("{")) {
                    trimmedStr = "{" + trimmedStr + "}";
                }
                // 解析为Map<String, Object>
                Map<String, Object> currentMap = gson.fromJson(trimmedStr, new TypeToken<Map<String, Object>>(){}.getType());

                // 遍历当前条目的所有键值对，更新总和
                for (Map.Entry<String, Object> entry : currentMap.entrySet()) {
                    String key = entry.getKey();
                    Object value = entry.getValue();
                    double numValue = 0.0;
                    if (value instanceof Number) {
                        numValue = ((Number) value).doubleValue();
                    } else {
                        System.err.println("警告: 键 '" + key + "' 的值不是数字类型，已视为0");
                    }
                    sumMap.put(key, sumMap.getOrDefault(key, 0.0) + numValue);
                }
                count++;
            } catch (Exception e) {
                System.err.println("解析错误: 字符串 '" + dataStr + "' 格式无效，已跳过");
            }
        }

        // 计算平均值
        Map<String, Double> averageMap = new HashMap<>();
        if (count > 0) {
            for (Map.Entry<String, Double> entry : sumMap.entrySet()) {
                double average = Math.round(entry.getValue() / count * 100.0) / 100.0;
                averageMap.put(entry.getKey(), average);
//                double average = entry.getValue() / count;
//                averageMap.put(entry.getKey(), average);
            }
        }

        return gson.toJson(averageMap);
    }
}
