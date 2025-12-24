# 免费部署指南 - SQLite 版本

本指南介绍如何将使用 SQLite 数据库的私密相册系统部署到免费平台。

## 🎯 推荐的免费部署平台

### 1. Railway (推荐) ⭐
- **优势**: 支持文件存储、自动部署、简单配置
- **限制**: 每月 $5 免费额度，约 500 小时运行时间
- **适合**: 中小型项目，偶尔使用

### 2. Render
- **优势**: 完全免费的静态站点 + 后端服务
- **限制**: 免费版会休眠，冷启动较慢
- **适合**: 演示项目、个人使用

### 3. Vercel (仅前端)
- **优势**: 极快的 CDN，无限带宽
- **限制**: 不支持持久化文件存储，需要配合其他后端
- **适合**: 纯前端部署 + 外部 API

## 🚀 Railway 部署步骤

### 准备工作
1. 确保已安装 SQLite 依赖：
```bash
npm install sqlite3
```

2. 更新环境变量（.env）：
```env
NODE_ENV=production
PORT=3000
DB_PATH=
JWT_SECRET=your_random_secret_key_change_this
SUPER_PASSWORD=your_super_password
```

### 部署步骤
1. 访问 [Railway.app](https://railway.app)
2. 使用 GitHub 账号登录
3. 点击 "New Project" → "Deploy from GitHub repo"
4. 选择你的项目仓库
5. Railway 会自动检测并部署

### 环境变量配置
在 Railway 项目设置中添加：
- `NODE_ENV`: `production`
- `JWT_SECRET`: 随机生成的密钥
- `SUPER_PASSWORD`: 你的超级密码
- `DB_PATH`: 留空（使用默认路径）

## 🔧 Render 部署步骤

### 1. 创建 render.yaml 配置
```yaml
services:
  - type: web
    name: photo-album
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm run server
    envVars:
      - key: NODE_ENV
        value: production
      - key: JWT_SECRET
        generateValue: true
      - key: SUPER_PASSWORD
        value: your_super_password
```

### 2. 部署步骤
1. 访问 [Render.com](https://render.com)
2. 连接 GitHub 仓库
3. 选择 "Web Service"
4. 配置构建和启动命令
5. 设置环境变量

## 📁 文件存储注意事项

### SQLite 数据库
- 数据库文件会保存在服务器本地
- Railway: 支持持久化存储
- Render: 免费版重启后可能丢失数据

### 上传的图片文件
- 建议使用云存储服务（如 Cloudinary、AWS S3）
- 或者使用支持持久化存储的平台

## 🔄 数据迁移

如果你之前使用 PostgreSQL，需要导出数据：

### 1. 导出现有数据
```bash
# 如果有现有的 PostgreSQL 数据
npm run export-data  # 需要创建导出脚本
```

### 2. 重新安装依赖
```bash
npm install
```

### 3. 初始化 SQLite 数据库
```bash
npm run server
# 首次运行会自动创建数据库和默认配置
```

## 🛠️ 故障排除

### 常见问题
1. **数据库文件权限问题**
   - 确保应用有写入权限
   - 检查 DB_PATH 配置

2. **依赖安装失败**
   - 删除 node_modules 重新安装
   - 检查 Node.js 版本兼容性

3. **部署后无法访问**
   - 检查 PORT 环境变量
   - 确认防火墙设置

### 调试命令
```bash
# 测试数据库连接
npm run test-db

# 查看日志
npm run pm2:logs

# 重置密码
npm run reset-password
```

## 💡 优化建议

1. **启用 GZIP 压缩**
2. **配置 CDN 加速**
3. **定期备份数据库文件**
4. **监控资源使用情况**

## 🔐 安全提醒

- 修改默认密码
- 使用强随机 JWT_SECRET
- 定期更新依赖包
- 启用 HTTPS（平台通常自动提供）