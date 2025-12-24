# 宝塔部署检查清单 ✅

## 📋 部署前检查

### 本地准备
- [ ] 已安装 Node.js 和 npm
- [ ] 项目代码完整无误
- [ ] 运行 `npm install` 安装依赖
- [ ] 运行 `npm run build` 构建前端
- [ ] 运行 `npm run package` 打包项目
- [ ] 压缩 `package-release` 文件夹

### 服务器准备
- [ ] 服务器已安装宝塔面板
- [ ] 宝塔已安装 Nginx
- [ ] 宝塔已安装 PostgreSQL 或 MySQL
- [ ] 宝塔已安装 Node.js (16+)
- [ ] 宝塔已安装 PM2 管理器

---

## 🗄️ 数据库配置

- [ ] 创建数据库 `photo_album_db`
- [ ] 创建数据库用户 `photo_user`
- [ ] 设置强密码
- [ ] 授予所有权限
- [ ] 记录数据库信息：
  ```
  类型: PostgreSQL / MySQL
  地址: localhost
  端口: 5432 / 3306
  库名: photo_album_db
  用户: photo_user
  密码: _______________
  ```

---

## 📤 文件上传

- [ ] 创建目录 `/www/wwwroot/photo-album`
- [ ] 上传压缩包到服务器
- [ ] 解压文件
- [ ] 设置目录权限 `chmod -R 755`
- [ ] 设置所有者 `chown -R www:www`

---

## ⚙️ 环境配置

- [ ] 创建 `.env` 文件
- [ ] 配置数据库连接信息
- [ ] 修改 `JWT_SECRET` 为随机字符串
- [ ] 修改 `SUPER_PASSWORD` 为强密码
- [ ] 设置 `NODE_ENV=production`
- [ ] 检查 `PORT=3000`

**示例 .env 配置：**
```env
NODE_ENV=production
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=photo_album_db
DB_USER=photo_user
DB_PASSWORD=你的数据库密码

JWT_SECRET=随机生成的长字符串
JWT_EXPIRE=7d

UPLOAD_PATH=./server/uploads
MAX_FILE_SIZE=10485760

SUPER_PASSWORD=你的超级密码
```

---

## 📦 安装依赖

在宝塔终端执行：
```bash
cd /www/wwwroot/photo-album
npm install --production
```

- [ ] 依赖安装成功
- [ ] 无错误提示

---

## 🎯 初始化数据库

```bash
cd /www/wwwroot/photo-album
npm run init-db
```

- [ ] 看到 "✓ 数据库连接成功"
- [ ] 看到 "✓ 数据表创建成功"
- [ ] 看到 "✓ 默认配置创建成功"
- [ ] 记录初始密码：
  ```
  前台密码: user123
  后台密码: admin123
  超级密码: (你在 .env 中设置的)
  ```

---

## 🚀 启动应用

### 方法 1：使用宝塔 PM2 管理器
- [ ] 打开 PM2 管理器
- [ ] 添加项目
- [ ] 项目名称: `photo-album`
- [ ] 启动文件: `/www/wwwroot/photo-album/server/app.js`
- [ ] 项目路径: `/www/wwwroot/photo-album`
- [ ] 点击启动

### 方法 2：命令行启动
```bash
cd /www/wwwroot/photo-album
pm2 start server/app.js --name photo-album -i 2
pm2 save
pm2 startup
```

- [ ] 应用启动成功
- [ ] `pm2 status` 显示 online
- [ ] `pm2 logs photo-album` 无错误

---

## 🌐 配置 Nginx

### 1. 添加网站
- [ ] 宝塔 → 网站 → 添加站点
- [ ] 域名: `your-domain.com` (或 IP)
- [ ] 根目录: `/www/wwwroot/photo-album/dist`
- [ ] PHP: 纯静态

### 2. 配置反向代理
点击网站 → 设置 → 配置文件，替换为：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /www/wwwroot/photo-album/dist;
    index index.html;
    
    # 前端路由
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API 代理
    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # 上传文件
    location /uploads {
        alias /www/wwwroot/photo-album/server/uploads;
        expires 30d;
    }
    
    client_max_body_size 20M;
}
```

- [ ] 配置已保存
- [ ] 重载 Nginx: `nginx -s reload`
- [ ] 无错误提示

---

## ✅ 测试验证

### 1. 检查服务
```bash
pm2 status
systemctl status nginx
```
- [ ] PM2 显示 online
- [ ] Nginx 正常运行

### 2. 访问网站
- [ ] 前台可访问: `http://your-domain.com`
- [ ] 后台可访问: `http://your-domain.com/admin`
- [ ] 页面正常显示，无 404 错误

### 3. 测试登录
- [ ] 前台登录成功 (密码: user123)
- [ ] 后台登录成功 (密码: admin123)
- [ ] 超级密码登录成功

### 4. 测试功能
- [ ] 可以创建分类
- [ ] 可以创建相册
- [ ] 可以上传照片
- [ ] 照片可以正常显示

---

## 🔒 安全加固

- [ ] 修改前台密码
- [ ] 修改后台密码
- [ ] 修改 .env 中的 SUPER_PASSWORD
- [ ] 修改 JWT_SECRET
- [ ] 配置 SSL 证书 (Let's Encrypt)
- [ ] 配置防火墙规则
- [ ] 关闭 3000 端口外网访问
- [ ] 设置定期备份任务

---

## 🎉 部署完成！

### 访问地址
- 前台: https://your-domain.com
- 后台: https://your-domain.com/admin

### 常用命令
```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs photo-album

# 重启应用
pm2 restart photo-album

# 重载 Nginx
nginx -s reload
```

### 下一步
1. 修改所有默认密码
2. 配置 HTTPS
3. 设置自动备份
4. 开始使用！

---

## ❓ 遇到问题？

### 数据库连接失败
1. 检查 .env 配置
2. 确认数据库服务运行
3. 检查用户权限

### 应用启动失败
1. 查看日志: `pm2 logs photo-album --err`
2. 手动测试: `node server/app.js`
3. 检查端口占用: `netstat -tlnp | grep 3000`

### 页面无法访问
1. 检查 Nginx 配置
2. 检查防火墙规则
3. 查看 Nginx 日志

### 文件上传失败
1. 检查目录权限
2. 检查 Nginx 上传大小限制
3. 查看应用日志

---

**部署文档**: DEPLOY_BAOTA.md
**技术支持**: 查看日志并根据错误信息排查
