package com.zr.uniSoul.config;

import com.zr.uniSoul.filter.SensitiveWordFilter;
import com.zr.uniSoul.wrapper.SensitiveRequestWrapper;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * 过滤器全局配置
 */
@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<SensitiveFilter> registerFilter(SensitiveWordFilter filter) {
        FilterRegistrationBean<SensitiveFilter> bean = new FilterRegistrationBean<>();
        bean.setFilter(new SensitiveFilter(filter));
        // 拦截所有路径
        bean.addUrlPatterns("/*");
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }

    public static class SensitiveFilter implements Filter {
        private final SensitiveWordFilter filter;
        private final String[] excludePaths;

        public SensitiveFilter(SensitiveWordFilter filter) {
            this.filter = filter;
            // 直接在构造函数中定义需要排除的路径
            this.excludePaths = new String[]{"/columns/create", "/static","/zhxt/publish","/columns/updateColumn"};
        }

        @Override
        public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
                throws IOException, ServletException {
            HttpServletRequest req = (HttpServletRequest) request;
            String path = req.getRequestURI();

            // 检查是否为排除的路径
            if (isExcluded(path)) {
                chain.doFilter(request, response);
            } else {
                chain.doFilter(new SensitiveRequestWrapper(req, filter), response);
            }
        }

        private boolean isExcluded(String path) {
            for (String excludePath : excludePaths) {
                if (path.startsWith(excludePath)) {
                    return true;
                }
            }
            return false;
        }
    }
}