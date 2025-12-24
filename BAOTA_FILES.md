# 宝塔部署相关文件说明

## 📚 文档文件

### 1. 宝塔部署指南.md
**用途**: 快速开始指南，3 步完成部署
**适合**: 想快速了解部署流程的用户
**内容**:
- 快速开始（3 步部署）
- 环境变量配置
- 常用命令
- 常见问题

### 2. DEPLOY_BAOTA.md
**用途**: 详细的部署步骤文档
**适合**: 第一次部署，需要详细指导的用户
**内容**:
- 完整的 9 步部署流程
- 每一步的详细说明
- Nginx 配置示例
- 安全加固指南
- 故障排查方法

### 3. BAOTA_CHECKLIST.md
**用途**: 部署检查清单
**适合**: 确保每个步骤都正确完成
**内容**:
- 部署前检查项
- 数据库配置检查
- 文件上传检查
- 环境配置检查
- 功能测试检查
- 安全加固检查

---

## 🛠️ 脚本文件

### 4. baota-deploy.sh
**用途**: Linux 服务器自动部署脚本
**使用场景**: 在宝塔服务器上运行
**功能**:
- 自动检查环境
- 安装依赖
- 初始化数据库
- 启动应用
- 配置 PM2

**使用方法**:
```bash
cd /www/wwwroot/photo-album
bash baota-deploy.sh
```

### 5. baota-deploy.bat
**用途**: Windows 本地打包脚本
**使用场景**: 在本地 Windows 电脑运行
**功能**:
- 检查环境
- 安装依赖
- 构建前端
- 打包项目

**使用方法**:
```bash
# 双击运行或命令行执行
baota-deploy.bat
```

---

## 📋 配置文件

### 6. .env.example
**用途**: 环境变量配置模板
**更新内容**:
- 添加详细的中文注释
- PostgreSQL 和 MySQL 配置示例
- 安全提示和建议
- JWT_SECRET 生成方法

---

## 🔄 已更新文件

### 7. server/app.js
**更新内容**: 添加数据库自动初始化功能
**功能**:
- 应用启动时自动检查数据库
- 如果数据库为空，自动创建默认配置
- 无需手动运行 init-db 脚本

### 8. README.md
**更新内容**: 添加宝塔部署说明
**新增章节**:
- 生产部署
- 宝塔面板部署
- 其他部署方式
- 打包命令

---

## 📖 使用流程

### 本地准备（Windows）
1. 运行 `baota-deploy.bat` 打包项目
2. 压缩 `package-release` 文件夹
3. 准备上传到服务器

### 服务器部署（Linux）
1. 上传并解压文件到 `/www/wwwroot/photo-album`
2. 创建数据库
3. 配置 `.env` 文件
4. 运行 `bash baota-deploy.sh`
5. 配置 Nginx

### 验证和安全
1. 使用 `BAOTA_CHECKLIST.md` 检查每一项
2. 测试网站功能
3. 修改所有默认密码
4. 配置 SSL 证书

---

## 📂 文件位置

```
项目根目录/
├── 宝塔部署指南.md          # 快速开始
├── DEPLOY_BAOTA.md          # 详细步骤
├── BAOTA_CHECKLIST.md       # 检查清单
├── BAOTA_FILES.md           # 本文件
├── baota-deploy.sh          # Linux 部署脚本
├── baota-deploy.bat         # Windows 打包脚本
├── .env.example             # 环境变量模板
├── server/app.js            # 已更新（自动初始化）
└── README.md                # 已更新（添加部署说明）
```

---

## 🎯 推荐阅读顺序

### 第一次部署
1. **宝塔部署指南.md** - 了解整体流程
2. **DEPLOY_BAOTA.md** - 详细操作步骤
3. **BAOTA_CHECKLIST.md** - 逐项检查

### 快速部署
1. 运行 `baota-deploy.bat` 打包
2. 上传到服务器
3. 运行 `bash baota-deploy.sh`
4. 配置 Nginx

### 遇到问题
1. 查看 **DEPLOY_BAOTA.md** 的"常见问题"章节
2. 使用 **BAOTA_CHECKLIST.md** 检查遗漏项
3. 查看应用日志：`pm2 logs photo-album`

---

## 💡 提示

- 所有文档都包含中文说明，易于理解
- 脚本都有详细的输出信息，方便排查问题
- 检查清单可以打印出来，逐项勾选
- 遇到问题先查看日志，再参考文档

---

## 🔗 相关链接

- 宝塔面板官网: https://www.bt.cn/
- PostgreSQL 文档: https://www.postgresql.org/docs/
- PM2 文档: https://pm2.keymetrics.io/
- Nginx 文档: https://nginx.org/

---

**祝部署顺利！** 🚀
