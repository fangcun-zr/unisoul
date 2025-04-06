package com.zr.uniSoul.service.impl;


import com.zr.uniSoul.common.R;
import com.zr.uniSoul.event.MessageEvent;
import com.zr.uniSoul.pojo.dto.MessageConsultDTO;
import com.zr.uniSoul.pojo.entity.ConsultMessage;
import com.zr.uniSoul.pojo.entity.User;
import com.zr.uniSoul.pojo.vo.MessageConsultVO;
import com.zr.uniSoul.service.MessageConsultService;
import com.zr.uniSoul.mapper.MessageConsultMapper;
import com.zr.uniSoul.utils.AiConsultUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 消息服务实现类，实现了消息服务接口的方法。
 */
@Service
@Slf4j
public class MessageConsultServiceImpl implements MessageConsultService {
    @Autowired
    private MessageConsultMapper messageMapper;

    public MessageConsultServiceImpl(MessageConsultMapper messageMapper) {
        this.messageMapper = messageMapper;
    }
    @Autowired
    private AiConsultUtil aiConsultUtil;

    /**
     * 生成返回的消息
     * @param question
     * @param session
     * @return
     */

    @Override
    public String getReply(String question, HttpSession session) {
        try {

            // 2. 获取对话历史（从Session）
            List<Map<String, String>> history = getChatHistory(session);

            // 3. 调用AI服务
            String reply = aiConsultUtil.getReply(history, question);

            // 4. 更新对话历史（同时保存用户提问和AI回复）
            updateHistory(session, question, reply);

//            log.info("AI回复: {}", reply);
            return reply;
        } catch (Exception e) {
            return e.getMessage();
        }
    }

    /**
     * 获取用户信息
     * @param userId
     * @return
     */
    @Override
    public User getUserInformation(String userId) {
        return messageMapper.getUserInformation(userId);
    }

    /**
     * 获取或初始化对话历史
     */
    @SuppressWarnings("unchecked")
    private List<Map<String, String>> getChatHistory(HttpSession session) {
        List<Map<String, String>> history =
                (List<Map<String, String>>) session.getAttribute("chatHistory");

        if (history == null) {
            history = new ArrayList<>();
            session.setAttribute("chatHistory", history);
        }
        return history;
    }

    /**
     * 更新并限制历史记录长度
     */
    private void updateHistory(HttpSession session, String question, String reply) {
        List<Map<String, String>> history = getChatHistory(session);

        // 添加用户提问
        history.add(Map.of(
                "role", "user",
                "content", question
        ));

        // 添加AI回复
        history.add(Map.of(
                "role", "assistant",
                "content", reply
        ));

        // 控制历史长度（保留最近5轮对话）
        int maxHistory = 12; // 6轮对话=12条记录（用户+AI各一条）
        if (history.size() > maxHistory) {
            // 移除最早的1轮对话（2条记录）
            history.subList(0, 2).clear();
        }
    }
}
