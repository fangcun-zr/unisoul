//package generator.controller;
//
//import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
//import generator.domain.Topics;
//import generator.domain.HotTopics;
//import generator.service.TopicsService;
//import generator.service.HotTopicsService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/community/topics")
//public class TopicController {
//
//    @Autowired
//    private TopicsService topicsService;
//
//    @Autowired
//    private HotTopicsService hotTopicsService;
//
//    /**
//     * 发布话题
//     */
//    @PostMapping
//    public String createTopic(@RequestBody Topics topic) {
//        topicsService.save(topic);
//        return "话题发布成功！";
//    }
//
//    /**
//     * 获取热门话题
//     */
//    @GetMapping("/hot-topics")
//    public List<HotTopics> getHotTopics() {
//        return hotTopicsService.list();
//    }
//}