package com.zr.uniSoul.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
public class UserInterceptor implements HandlerInterceptor {
    //没用数据库，暂且用集合来存储已登录等用户，进行拦截。
    public static Map<String, String> onLineUsers = new ConcurrentHashMap<>();;



    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession httpSession = request.getSession();
        String username = (String) httpSession.getAttribute("user");
        log.info("进入拦截器"+"==="+"进入拦截器的用户是："+username);
        if(username != null && !onLineUsers.containsKey(username)){
            onLineUsers.put(username,username);
            log.info("已进入拦截器判断");
            log.info("已存储的用户01"+onLineUsers);
            return true;
        }else {
            log.info("已存储的用户02" + onLineUsers);
            log.info("未进入判断，进行重定向");
            httpSession.removeAttribute("user");
            response.sendRedirect("/loginerror");
            return false;
        }
    }
}

