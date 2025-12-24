# 宝塔面板部署指南

## 📋 部署前准备

### 1. 服务器要求
- 操作系统：Linux (推荐 CentOS 7+ / Ubuntu 18.04+)
- 内存：至少 1GB
- 已安装宝塔面板 (https://www.bt.cn/)

### 2. 宝塔面板安装软件
登录宝塔面板，在"软件商店"安装以下软件：
- ✅ Nginx 1.20+
- ✅ PostgreSQL 12+ (或 MySQL 5.7+)
- ✅ Node.js 16+ (推荐 18.x)
- ✅ PM2 管理器

---

## 🗄️ 第一步：配置数据库

### 1. 创建数据库
在宝塔面板 → 数据库 → PostgreSQL (或 MySQL)：

**PostgreSQL 配置：**
- 数据库名：`photo_album_db`
- 用户名：`photo_user`
- 密码：`设置一个强密码`
- 权限：所有权限

**MySQL 配置（如果使用 MySQL）：**
- 数据库名：`photo_album_db`
- 用户名：`photo_user`
- 密码：`设置一个强密码`
- 访问权限：本地服务器

### 2. 记录数据库信息
```
数据库类型：PostgreSQL (或 mysql)
数据库地址：localhost (或 127.0.0.1)
数据库端口：5432 (PostgreSQL) 或 3306 (MySQL)
数据库名称：photo_album_db
用户名：photo_user
密码：[你设置的密码]
```

---

## 📦 第二步：准备部署包

### 方案 A：在本地打包（推荐）

1. **在本地项目目录运行**：
```bash
# 安装依赖
npm install

# 构建前端
npm run build

# 打包项目
npm run package
```

2. **打包完成后**，会在 `package-release` 目录生成部署包，包含：
   - `dist/` - 前端构建文件
   - `server/` - 后端代码
   - `package.json` - 依赖配置
   - `.env.example` - 环境变量模板

3. **压缩部署包**：
```bash
# Windows
压缩 package-release 文件夹为 photo-album.zip

# Linux/Mac
cd package-release
tar -czf photo-album.tar.gz .
```

### 方案 B：直接上传整个项目
如果本地打包失败，可以直接上传整个项目文件夹。

---

## 🚀 第三步：上传到服务器

### 1. 创建网站目录
在宝塔面板 → 文件，创建目录：
```
/www/wwwroot/photo-album
```

### 2. 上传文件
- 点击"上传"按钮
- 上传 `photo-album.zip` 或 `photo-album.tar.gz`
- 解压到 `/www/wwwroot/photo-album`

### 3. 设置目录权限
```bash
# 在宝塔终端执行
cd /www/wwwroot/photo-album
chmod -R 755 .
chown -R www:www .
```

---

## ⚙️ 第四步：配置环境变量

### 1. 创建 .env 文件
在 `/www/wwwroot/photo-album` 目录下创建 `.env` 文件：

```bash
# 在宝塔面板 → 文件 → 创建文件 .env
```

### 2. 填写配置（重要！）

**如果使用 PostgreSQL：**
```env
NODE_ENV=production
PORT=3000

# PostgreSQL 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=photo_album_db
DB_USER=photo_user
DB_PASSWORD=你的数据库密码

# JWT 密钥（必须修改！）
JWT_SECRET=your_random_secret_key_change_this_in_production_12345
JWT_EXPIRE=7d

# 文件上传配置
UPLOAD_PATH=./server/uploads
MAX_FILE_SIZE=10485760

# 超级密码（紧急登录用）
SUPER_PASSWORD=SuperAdmin@2024
```

**如果使用 MySQL：**
需要修改 `server/config/database.js`，将 `dialect: 'postgres'` 改为 `dialect: 'mysql'`

---

## 📝 第五步：安装依赖

在宝塔面板 → 终端，执行：

```bash
cd /www/wwwroot/photo-album

# 安装生产依赖
npm install --production

# 或者安装所有依赖
npm install
```

---

## 🎯 第六步：初始化数据库

### 方法 1：运行初始化脚本（推荐）
```bash
cd /www/wwwroot/photo-album
npm run init-db
```

看到以下输出表示成功：
```
✓ 数据库连接成功
✓ 数据表创建成功
✓ 默认配置创建成功
  前台密码: user123
  后台密码: admin123
```

### 方法 2：自动初始化
如果脚本失败，直接启动应用，它会自动初始化（已配置自动初始化功能）。

---

## 🔧 第七步：配置 PM2 启动

### 1. 使用宝塔 PM2 管理器

在宝塔面板 → PM2 管理器 → 添加项目：

- **项目名称**：`photo-album`
- **启动文件**：`/www/wwwroot/photo-album/server/app.js`
- **项目路径**：`/www/wwwroot/photo-album`
- **运行模式**：`cluster` (集群模式)
- **实例数量**：`2` (根据服务器配置)

### 2. 或使用命令行启动

```bash
cd /www/wwwroot/photo-album

# 启动应用
pm2 start server/app.js --name photo-album -i 2

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
```

### 3. 查看运行状态
```bash
pm2 status
pm2 logs photo-album
```

---

## 🌐 第八步：配置 Nginx 反向代理

### 1. 添加网站
在宝塔面板 → 网站 → 添加站点：
- **域名**：`your-domain.com` (或使用 IP)
- **根目录**：`/www/wwwroot/photo-album/dist`
- **PHP 版本**：纯静态

### 2. 配置反向代理
点击网站 → 设置 → 反向代理 → 添加反向代理：

**配置名称**：`photo-album-api`
**目标 URL**：`http://127.0.0.1:3000`
**发送域名**：`$host`

**或手动编辑 Nginx 配置**：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 改成你的域名或 IP
    
    root /www/wwwroot/photo-album/dist;
    index index.html;
    
    # 前端静态文件
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API 反向代理
    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 上传文件访问
    location /uploads {
        alias /www/wwwroot/photo-album/server/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # 文件上传大小限制
    client_max_body_size 20M;
}
```

### 3. 重载 Nginx
```bash
nginx -t
nginx -s reload
```

---

## ✅ 第九步：验证部署

### 1. 检查服务状态
```bash
# 查看 PM2 状态
pm2 status

# 查看应用日志
pm2 logs photo-album --lines 50

# 查看 Nginx 状态
systemctl status nginx
```

### 2. 访问网站
- 前台：`http://your-domain.com` 或 `http://服务器IP`
- 后台：`http://your-domain.com/admin`

### 3. 测试登录
使用初始密码登录：
- 前台密码：`user123`
- 后台密码：`admin123`
- 超级密码：`SuperAdmin@2024`

---

## 🔒 安全加固（重要！）

### 1. 修改默认密码
登录后台 → 密码管理 → 修改所有密码

### 2. 修改超级密码
编辑 `.env` 文件，修改 `SUPER_PASSWORD`

### 3. 配置 SSL 证书
在宝塔面板 → 网站 → SSL → Let's Encrypt 免费证书

### 4. 配置防火墙
- 开放端口：80, 443
- 关闭端口：3000 (不要对外暴露)

### 5. 定期备份
在宝塔面板 → 计划任务 → 添加备份任务：
- 备份网站文件
- 备份数据库

---

## 🛠️ 常用维护命令

### PM2 管理
```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs photo-album

# 重启应用
pm2 restart photo-album

# 停止应用
pm2 stop photo-album

# 删除应用
pm2 delete photo-album
```

### 更新应用
```bash
cd /www/wwwroot/photo-album

# 备份当前版本
cp -r . ../photo-album-backup

# 上传新版本文件并覆盖

# 安装新依赖
npm install --production

# 重启应用
pm2 restart photo-album
```

### 查看日志
```bash
# PM2 日志
pm2 logs photo-album

# Nginx 日志
tail -f /www/wwwroot/photo-album/logs/access.log
tail -f /www/wwwroot/photo-album/logs/error.log
```

---

## ❓ 常见问题

### 1. 数据库连接失败
- 检查 `.env` 中的数据库配置是否正确
- 确认数据库服务是否启动：`systemctl status postgresql`
- 检查数据库用户权限

### 2. 应用启动失败
```bash
# 查看详细错误
pm2 logs photo-album --err

# 手动启动测试
cd /www/wwwroot/photo-album
node server/app.js
```

### 3. 文件上传失败
- 检查 `server/uploads` 目录权限：`chmod 755 server/uploads`
- 检查 Nginx 上传大小限制：`client_max_body_size`

### 4. 前端页面空白
- 检查 Nginx 配置中的 `root` 路径是否正确
- 检查 `dist` 目录是否存在且有文件

### 5. API 请求 404
- 检查 Nginx 反向代理配置
- 确认后端服务是否运行：`pm2 status`

---

## 📞 技术支持

如遇到问题：
1. 查看 PM2 日志：`pm2 logs photo-album`
2. 查看 Nginx 错误日志
3. 检查 `.env` 配置是否正确
4. 确认所有服务都在运行

---

## 🎉 部署完成！

现在你可以：
- ✅ 访问前台相册
- ✅ 登录后台管理
- ✅ 上传照片
- ✅ 管理分类和相册

记得修改默认密码并配置 SSL 证书！
