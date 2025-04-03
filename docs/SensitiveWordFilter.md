# 敏感词过滤系统实现说明

## 1. 概述

本项目实现了一个高效的敏感词过滤系统，主要用于过滤用户输入的文本内容，以防止不适当的语言出现。该系统采用了前缀树（Trie）数据结构，结合Spring框架，实现了高性能的敏感词检测和过滤功能。

## 2. 核心组件

### 2.1 SensitiveWordFilter 类

位置：`src/main/java/com/zr/uniSoul/filter/SensitiveWordFilter.java`

这是敏感词过滤的核心类，主要功能包括：

- 初始化敏感词库
- 提供敏感词过滤方法
- 支持从数据库动态更新敏感词库

关键方法：
```java
public String filter(String text) {
    // 实现敏感词过滤逻辑
}
```

### 2.2 SensitiveWordRepository 接口

位置：`src/main/java/com/zr/uniSoul/mapper/SensitiveWordRepository.java`

这个接口定义了与数据库交互的方法，用于获取和更新敏感词列表。

### 2.3 SensitiveWord 实体类

位置：`src/main/java/com/zr/uniSoul/pojo/entity/SensitiveWord.java`

定义了敏感词的数据结构，用于数据库映射和业务逻辑处理。

## 3. 配置和集成

### 3.1 FilterConfig 类

位置：`src/main/java/com/zr/uniSoul/config/FilterConfig.java`

这个配置类负责注册敏感词过滤器，使其能够自动应用于所有的 HTTP 请求。

关键代码：
```java
@Bean
public FilterRegistrationBean<SensitiveFilter> registerFilter(SensitiveWordFilter filter) {
    FilterRegistrationBean<SensitiveFilter> bean = new FilterRegistrationBean<>();
    bean.setFilter(new SensitiveFilter(filter));
    bean.addUrlPatterns("/*");
    return bean;
}
```

### 3.2 SensitiveRequestWrapper 类

位置：`src/main/java/com/zr/uniSoul/wrapper/SensitiveRequestWrapper.java`

这个类扩展了 HttpServletRequestWrapper，用于在请求处理过程中自动应用敏感词过滤。它能够处理不同类型的请求内容，包括表单数据、JSON 数据等。

## 4. 动态更新机制

### 4.1 SensitiveWordReloader 类

位置：`src/main/java/com/zr/uniSoul/reloader/SensitiveWordReloader.java`

这个类实现了敏感词库的动态更新功能：

```java
public class SensitiveWordReloader {
    private final SensitiveWordFilter filter;

    public SensitiveWordReloader(SensitiveWordFilter filter) {
        this.filter = filter;
    }

    public void reload() {
        filter.reloadFromDatabase();
    }
}
```

## 5. 使用示例

### 5.1 在控制器中使用

位置：`src/main/java/com/zr/uniSoul/controller/SensitiveWordController.java`

```java
@GetMapping("/filter")
public FilterResponse filterSensitiveWords(@RequestParam String psychology_content) {
    String filteredContent = sensitiveWordFilter.filter(psychology_content);
    return new FilterResponse(filteredContent);
}
```

## 6. 性能优化

- 使用前缀树（Trie）数据结构，提高大规模文本的过滤效率
- 采用懒加载策略，仅在首次使用时初始化敏感词库
- 支持动态更新，无需重启应用即可更新敏感词库

## 7. 注意事项

- 敏感词库的更新应考虑并发安全性
- 定期维护和更新敏感词库，以应对新出现的不当用语
- 考虑添加日志记录功能，跟踪敏感词过滤的使用情况和效果

## 8. 未来优化方向

1. 引入机器学习模型，提高敏感词识别的准确性和灵活性
2. 实现分布式敏感词过滤系统，提高系统的扩展性
3. 添加敏感词管理界面，方便管理员实时添加、删除和修改敏感词

通过以上设计和实现，本项目的敏感词过滤系统能够有效地过滤不当内容，保护用户体验，同时保持了高效性和灵活性。