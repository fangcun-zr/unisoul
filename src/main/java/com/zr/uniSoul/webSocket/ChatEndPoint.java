package com.zr.uniSoul.webSocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zr.uniSoul.pojo.entity.Message;
import com.zr.uniSoul.service.PrivateLetterService;
import com.zr.uniSoul.utils.MessageUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import javax.servlet.http.HttpSession;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
@Slf4j
@ServerEndpoint(value = "/chat",configurator = GetHttpSessionConfigurator.class)
@Component
public class ChatEndPoint {
    @Autowired
    private PrivateLetterService privateLetterService;
    //用线程安全的map来保存当前用户
    private static Map<String,ChatEndPoint> onLineUsers = new ConcurrentHashMap<>();
    //声明一个session对象，通过该对象可以发送消息给指定用户，不能设置为静态，每个ChatEndPoint有一个session才能区分.(websocket的session)
    private Session session;
    //保存当前登录浏览器的用户
    private HttpSession httpSession;

    //建立连接时发送系统广播
    @OnOpen
    public void onOpen(Session session, EndpointConfig config){
        this.session = session;
        HttpSession httpSession = (HttpSession) config.getUserProperties().get(HttpSession.class.getName());
        log.info("httpSession:{}",httpSession.getAttributeNames());
        this.httpSession = httpSession;
        String username = (String) httpSession.getAttribute("username");
        log.info("上线用户名称："+username);
        onLineUsers.put(username,this);
        log.info("目前在线用户：",onLineUsers.keySet());
        String message = MessageUtils.getMessage(true,null,getNames());
        broadcastAllUsers(message);
    }
    //获取当前登录的用户
    private Set<String> getNames(){
        return onLineUsers.keySet();
    }
    //发送系统消息
    private void broadcastAllUsers(String message){
        try{
            Set<String> names = onLineUsers.keySet();
            for(String name : names){
                ChatEndPoint chatEndPoint = onLineUsers.get(name);
                chatEndPoint.session.getBasicRemote().sendText(message);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }
    //用户之间的信息发送
    @OnMessage
    public void onMessage(String message,Session session){
        try{
            ObjectMapper mapper = new ObjectMapper();
            log.info(message);
            Message mess = mapper.readValue(message,Message.class);
            String toName = mess.getToName();
            String data = mess.getMessage();
            String username = mess.getFromName();
            log.info(username + "向"+toName+"发送的消息：" + data);
            privateLetterService.storeMessage(username,toName,data);
            String resultMessage = MessageUtils.getMessage(false,username,data);
            if(StringUtils.hasLength(toName)) {
                onLineUsers.get(toName).session.getBasicRemote().sendText(resultMessage);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }
    //用户断开连接的断后操作
    @OnClose
    public void onClose(Session session){
        String username = (String) httpSession.getAttribute("username");
        log.info("离线用户："+ username);
        if (username != null){
            onLineUsers.remove(username);
//            UserInterceptor.onLineUsers.remove(username);
        }
        httpSession.removeAttribute("username");
        String message = MessageUtils.getMessage(true,null,getNames());
        broadcastAllUsers(message);
    }
}
