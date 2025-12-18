# 部署指南

## 📦 部署前准备

### 1. 环境要求
- Node.js >= 16
- PostgreSQL >= 12 (或 MySQL >= 5.7)
- PM2 (推荐)

### 2. 构建项目
```bash
npm run build
```

## 🚀 部署步骤

### 方式 1: 手动部署

#### 1. 上传文件到服务器
需要上传以下文件和目录：
```
photo-album/
├── dist/                    # 前端构建文件
├── server/                  # 后端代码
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── uploads/.gitkeep    # 保留此文件
│   └── app.js
├── node_modules/           # 或在服务器上运行 npm install
├── .env                    # 配置文件（需修改）
├── ecosystem.config.cjs    # PM2 配置
└── package.json
```

#### 2. 在服务器上安装依赖
```bash
npm install --production
```

#### 3. 配置环境变量
编辑 `.env` 文件：
```env
NODE_ENV=production
PORT=3000

# 数据库配置（修改为生产环境）
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT 密钥（必须修改）
JWT_SECRET=your_random_secret_key_here

# 超级密码（必须修改）
SUPER_PASSWORD=your_complex_super_password
```

#### 4. 初始化数据库
```bash
npm run init-db
```

#### 5. 启动服务
```bash
# 使用 PM2（推荐）
npm install -g pm2
npm run pm2:start

# 或直接启动
npm run server
```

### 方式 2: 使用 Docker（推荐）

#### 1. 创建 Dockerfile
已在项目中提供，直接使用。

#### 2. 构建镜像
```bash
docker build -t photo-album .
```

#### 3. 运行容器
```bash
docker-compose up -d
```

## 🌐 Nginx 配置

### 基础配置
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 客户端最大上传大小
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### HTTPS 配置（使用 Let's Encrypt）
```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

## 🔒 安全检查清单

部署前必须完成：

- [ ] 修改 `.env` 中的 `SUPER_PASSWORD`
- [ ] 修改 `.env` 中的 `JWT_SECRET`
- [ ] 修改数据库密码
- [ ] 运行 `npm run init-db` 初始化数据库
- [ ] 登录后台修改默认密码
- [ ] 配置 HTTPS
- [ ] 设置防火墙规则
- [ ] 配置数据库备份

## 📊 PM2 常用命令

```bash
# 启动应用
npm run pm2:start

# 查看状态
npm run pm2:status

# 查看日志
npm run pm2:logs

# 实时监控
pm2 monit

# 重启应用
npm run pm2:restart

# 停止应用
npm run pm2:stop

# 删除应用
npm run pm2:delete

# 保存 PM2 配置（开机自启）
pm2 save
pm2 startup
```

## 🔄 更新部署

### 1. 备份数据
```bash
# 备份数据库
pg_dump -U postgres photo_album > backup_$(date +%Y%m%d).sql

# 备份上传的图片
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz server/uploads/
```

### 2. 更新代码
```bash
# 拉取最新代码
git pull

# 安装依赖
npm install

# 构建前端
npm run build

# 重启服务
npm run pm2:restart
```

## 🐛 故障排查

### 1. 端口被占用
```bash
# Windows
netstat -ano | findstr :3000
taskkill /F /PID <进程ID>

# Linux
lsof -i :3000
kill -9 <进程ID>
```

### 2. 数据库连接失败
- 检查 `.env` 中的数据库配置
- 确认数据库服务已启动
- 检查防火墙规则
- 运行 `npm run test-db` 测试连接

### 3. 图片上传失败
```bash
# 检查上传目录权限
chmod 755 server/uploads
chown -R www-data:www-data server/uploads
```

### 4. 查看日志
```bash
# PM2 日志
npm run pm2:logs

# 或直接查看日志文件
tail -f logs/out.log
tail -f logs/err.log
```

## 📱 性能优化

### 1. 启用 Gzip 压缩（Nginx）
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
```

### 2. 静态资源缓存（Nginx）
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. 数据库优化
- 定期清理日志
- 优化查询索引
- 配置连接池

## 📞 需要帮助？

- 查看密码: `npm run show-passwords`
- 重置密码: `npm run reset-password`
- 测试数据库: `npm run test-db`
- 查看安全文档: [SECURITY.md](./SECURITY.md)
