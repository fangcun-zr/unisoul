# UniSoul - 心理健康咨询平台

UniSoul是一个基于Spring Boot的心理健康咨询平台，旨在为用户提供专业的心理健康服务、在线咨询和社区互动功能。

## 🌟 主要功能

- 👨‍⚕️ **在线心理咨询**
  - 预约咨询服务
  - AI智能咨询
  - 实时消息交互
  - WebSocket即时通讯

- 📝 **心理测评系统**
  - 专业心理评估(接入deepSeek的API)
  - 个性化报告生成
  - 多维度分析

- 🏛 **专栏系统**
  - 心理健康文章
  - 专家专栏
  - 用户互动评论

- 👥 **社区互动**
  - 话题讨论
  - 用户评论
  - 点赞互动
  - 内容举报

- 🛡 **内容管理**
  - 敏感词过滤（前缀树）
  - 内容审核
  - 用户管理
  - 数据统计

## 🔧 技术栈

### 后端技术
- Spring Boot (项目框架)
- MyBatis-Plus/MyBatis (ORM框架)
- WebSocket (实时通讯)
- Spring Security（权限校验）
- Redis (热缓存)
- MySQL (数据库)

### 前端技术
- HTML5
- CSS3
- JavaScript
- AJAX (异步请求)
- WebSocket
- node.js打包

### 第三方服务
- 阿里云OSS对象存储 (对平台的文件进行存储)
- 邮件服务 (用户注册验证)
- AI咨询服务 (deepSeek)

## 🚀 快速开始

1. **环境要求**
   - JDK 17+
   - MySQL 5.7+
   - Maven 3.6+

2. **启动项目**
   ```bash
   # 克隆项目
   git clone [项目地址]

   # 进入项目目录
   cd UniSoul

   # 编译打包
   mvn clean package

   # 运行项目
   java -jar target/UniSoul.jar
   ```

3. **访问系统**
   - 打开浏览器访问（本地项目运行）: `http://localhost:8080/UniSoul/html/login.html`  
   - 打开浏览器访问（访问部署）: `http://112.124.56.137:7070/html/login.html`

## 📁 项目结构

```
src/main/java/com/zr/uniSoul/
├── common/          # 通用类
├── config/          # 配置类
├── controller/      # 控制器
├── event/          # 事件处理
├── filter/         # 过滤器
├── listener/       # 监听器
├── mapper/         # 数据访问层
├── pojo/           # 数据模型
├── service/        # 业务逻辑层
├── utils/          # 工具类
└── webSocket/      # WebSocket处理
```

## 🔐 安全特性

- 敏感词过滤系统
- 请求包装器安全处理
- WebSocket安全配置
- 数据访问控制

## 🤝 贡献指南

欢迎提交问题和改进建议！请遵循以下步骤：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

[选择合适的开源许可证]

## 👥 联系我们

如有任何问题或建议，请通过以下方式联系我们：
- 项目Issues
- [联系方式]

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！