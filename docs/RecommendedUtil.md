# RecommendedUtil 智能推荐工具类文档

## 简介

`RecommendedUtil` 是一个基于语义相似度的智能推荐工具类，主要用于平台内容个性化推荐。它结合了自然语言处理（NLP）和推荐系统技术，提供了标签匹配、内容相似度计算和多维度文章排序等功能。

## 核心特性

- 基于词向量的语义相似度计算
- 动态标签评分系统
- 多维度文章排序
- 智能化的内容推荐

## 技术栈

- Spring Framework
- Deeplearning4j (用于词向量处理)
- Jackson (JSON处理)
- Lombok
- 腾讯AI Lab中文词向量模型

## 主要功能

### 1. 词向量模型初始化

```java
@PostConstruct
public void initWord2VecModel()
```

- 自动加载预训练的中文词向量模型
- 模型路径：`src/main/resources/Tencent_AILab_ChineseEmbedding/Tencent_AILab_ChineseEmbedding.txt`
- Spring Bean 初始化时自动执行

### 2. 标签解析

```java
public List<String> analyticalTags(String tags)
```

**功能**：将 JSON 格式的标签字符串解析为标签列表

**示例**：
```json
输入: ["心理", "焦虑"]
输出: List<String> 包含 "心理", "焦虑"
```

### 3. 标签得分更新

```java
public String updateTagScores(List<String> tags, String jsonInput, int score)
```

**功能**：更新标签权重得分

**特性**：
- 支持直接匹配和语义相似度匹配
- 相似度阈值：0.6（可配置）
- 自动处理新增标签

**示例**：
```json
输入:
- tags: ["心理咨询"]
- jsonInput: {"心理":85, "学习":75}
- score: 10

输出: {"心理":95, "学习":75}  // "心理咨询"与"心理"匹配
```

### 4. 文章智能排序

```java
public List<Article> sortArticles(List<Article> articles, String jsonInput)
```

**功能**：多维度综合排序文章列表

**排序维度与权重**：
- 标签匹配得分：45%
- 更新时间新鲜度：11%
- 浏览数：11%
- 点赞数：11%
- 收藏数：11%
- 评论数：11%

## 核心算法

### 1. 语义相似度计算

```java
private double calculateSemanticSimilarity(String tag1, String tag2)
```

**算法流程**：
1. 中文分词
2. 词向量获取
3. 计算平均向量
4. 余弦相似度计算

### 2. 归一化处理

支持多种数据类型的归一化处理：

```java
private double normalize(double value, double min, double max)
private double normalize(long value, long min, long max)
private double normalize(int value, int min, int max)
```

**特点**：
- 将不同维度的指标统一到 [0,1] 区间
- 处理边界情况（如所有值相等）
- 支持多种数据类型

## 使用示例

### 1. 标签更新示例

```java
RecommendedUtil util = new RecommendedUtil();

// 初始标签得分
String initialScores = "{\"心理\":85, \"学习\":75}";

// 新增标签
List<String> newTags = Arrays.asList("心理咨询", "学习方法");
String updatedScores = util.updateTagScores(newTags, initialScores, 10);

// 输出更新后的得分
System.out.println(updatedScores);
```

### 2. 文章排序示例

```java
RecommendedUtil util = new RecommendedUtil();

// 用户标签权重
String userTags = "{\"心理\":85, \"学习\":75}";

// 获取排序后的文章列表
List<Article> sortedArticles = util.sortArticles(articleList, userTags);
```

## 性能优化

1. **预计算优化**
   - 缓存词向量模型
   - 批量计算文章评分指标

2. **Stream API 优化**
   - 使用并行流处理大量数据
   - 链式操作减少中间集合创建

3. **内存优化**
   - 避免重复创建对象
   - 使用基本数据类型数组

## 注意事项

1. **依赖配置**
   - 确保词向量模型文件存在
   - 检查模型文件路径配置

2. **性能考虑**
   - 大量文章排序时注意性能
   - 考虑增加缓存机制

3. **扩展建议**
   - 可配置权重参数
   - 支持自定义排序规则

## 维护建议

1. **模型更新**
   - 定期更新词向量模型
   - 监控模型加载性能

2. **参数调优**
   - 根据实际使用效果调整相似度阈值
   - 优化排序权重分配

3. **监控指标**
   - 记录算法执行时间
   - 统计推荐准确率

## 版本信息

- 版本：1.0
- 作者：fangcun
- 更新日期：2025/04/01