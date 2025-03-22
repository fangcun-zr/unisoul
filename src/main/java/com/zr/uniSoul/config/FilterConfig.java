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
        bean.addUrlPatterns("/*");
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }

    public static class SensitiveFilter implements Filter {
        private final SensitiveWordFilter filter;

        public SensitiveFilter(SensitiveWordFilter filter) {
            this.filter = filter;
        }

        @Override
        public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
                throws IOException, ServletException {
            HttpServletRequest req = (HttpServletRequest) request;
            chain.doFilter(new SensitiveRequestWrapper(req, filter), response);
        }
    }
}
