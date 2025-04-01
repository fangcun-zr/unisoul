package com.zr.uniSoul.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.handler.WebSocketHandlerDecorator;
import org.springframework.web.socket.handler.WebSocketHandlerDecoratorFactory;

/**
 * WebSocket配置类
 * 用于配置WebSocket服务器端点和导出器
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private static final Logger log = LoggerFactory.getLogger(WebSocketConfig.class);

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        try {
            registry.addEndpoint("/api/websocket/chat")
                    .setAllowedOriginPatterns("http://localhost:[*]")  // 允许本地开发环境
                    .withSockJS()
                    .setStreamBytesLimit(512 * 1024)
                    .setHttpMessageCacheSize(1000)
                    .setDisconnectDelay(30 * 1000);
            log.info("WebSocket端点注册成功");
        } catch (Exception e) {
            log.error("WebSocket端点注册失败", e);
        }
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        try {
            registry.setApplicationDestinationPrefixes("/app");
            registry.enableSimpleBroker("/topic", "/queue");
            registry.setPreservePublishOrder(true);
            log.info("消息代理配置成功");
        } catch (Exception e) {
            log.error("消息代理配置失败", e);
        }
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        try {
            registration.setMessageSizeLimit(8192)
                    .setSendBufferSizeLimit(8192)
                    .setSendTimeLimit(10000)
                    .addDecoratorFactory(new WebSocketHandlerDecoratorFactory() {
                        @Override
                        public WebSocketHandler decorate(WebSocketHandler handler) {
                            return new WebSocketHandlerDecorator(handler) {
                                @Override
                                public void afterConnectionEstablished(WebSocketSession session) throws Exception {
                                    log.info("WebSocket连接建立: {}", session.getId());
                                    super.afterConnectionEstablished(session);
                                }

                                @Override
                                public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
                                    log.info("WebSocket连接关闭: {}, 状态: {}", session.getId(), closeStatus);
                                    super.afterConnectionClosed(session, closeStatus);
                                }
                            };
                        }
                    });
            log.info("WebSocket传输配置成功");
        } catch (Exception e) {
            log.error("WebSocket传输配置失败", e);
        }
    }
}
