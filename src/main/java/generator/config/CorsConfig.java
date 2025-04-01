package generator.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")         // 匹配所有接口
                .allowedOrigins("http://localhost:8080")       // 允许所有来源（或指定前端地址，如 "http://localhost:8080"）
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 允许的 HTTP 方法
                .allowedHeaders("*")       // 允许所有请求头
                .allowCredentials(false)   // 是否允许发送 Cookie
                .maxAge(3600);            // 预检请求缓存时间（秒）
    }
}