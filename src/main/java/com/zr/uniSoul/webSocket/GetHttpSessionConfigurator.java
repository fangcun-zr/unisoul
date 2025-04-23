package com.zr.uniSoul.webSocket;

import javax.servlet.http.HttpSession;
import javax.websocket.HandshakeResponse;
import javax.websocket.server.HandshakeRequest;
import javax.websocket.server.ServerEndpointConfig;

public class GetHttpSessionConfigurator extends ServerEndpointConfig.Configurator {

    // 1. 从 Spring 容器获取端点实例（解决依赖注入问题）
    @Override
    public <T> T getEndpointInstance(Class<T> endpointClass) throws InstantiationException {
        return ApplicationContextProvider.getApplicationContext().getBean(endpointClass);
    }

    // 2. 获取 HttpSession 并存储到配置中（你已有的逻辑）
    @Override
    public void modifyHandshake(ServerEndpointConfig sec, HandshakeRequest request, HandshakeResponse response) {
        HttpSession httpSession = (HttpSession) request.getHttpSession();
        if (httpSession != null) {
            sec.getUserProperties().put(HttpSession.class.getName(), httpSession);
        }
    }
}
