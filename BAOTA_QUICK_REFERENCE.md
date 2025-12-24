# 🚀 宝塔部署快速参考

## 📋 部署前准备清单

```
✅ 服务器已安装宝塔面板
✅ 宝塔已安装: Nginx + PostgreSQL + Node.js + PM2
✅ 本地已打包项目 (npm run package)
✅ 已创建数据库: photo_album_db
✅ 已记录数据库密码
```

---

## ⚡ 3 步快速部署

### 1️⃣ 本地打包
```bash
baota-deploy.bat
# 或
npm run package
```

### 2️⃣ 上传服务器
```
上传到: /www/wwwroot/photo-album
解压文件
```

### 3️⃣ 服务器部署
```bash
cd /www/wwwroot/photo-album
bash baota-deploy.sh
```

---

## 🔧 核心配置

### .env 文件（必须配置）
```env
NODE_ENV=production
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=photo_album_db
DB_USER=photo_user
DB_PASSWORD=你的数据库密码

JWT_SECRET=随机字符串32位以上
SUPER_PASSWORD=你的超级密码
```

### Nginx 配置（核心部分）
```nginx
location / {
    try_files $uri $uri/ /index.html;
}

location /api {
    proxy_pass http://127.0.0.1:3000;
}

location /uploads {
    alias /www/wwwroot/photo-album/server/uploads;
}

client_max_body_size 20M;
```

---

## 🎯 常用命令

### PM2 管理
```bash
pm2 status                  # 查看状态
pm2 logs photo-album        # 查看日志
pm2 restart photo-album     # 重启
pm2 stop photo-album        # 停止
```

### 数据库管理
```bash
npm run init-db            # 初始化
npm run show-passwords     # 查看密码
npm run test-db            # 测试连接
```

### Nginx 管理
```bash
nginx -t                   # 测试配置
nginx -s reload            # 重载
```

---

## 🔑 默认密码

```
前台: user123
后台: admin123
超级: SuperAdmin@2024 (在 .env 中)
```

**⚠️ 部署后立即修改！**

---

## ❓ 快速排查

### 数据库连接失败
```bash
npm run test-db
cat .env | grep DB_
systemctl status postgresql
```

### 应用启动失败
```bash
pm2 logs photo-album --err
node server/app.js
```

### 页面 404
```bash
ls -la dist/
nginx -t
systemctl status nginx
```

### 文件上传失败
```bash
ls -la server/uploads
chmod 755 server/uploads
```

---

## 📚 详细文档

| 文档 | 用途 |
|------|------|
| 宝塔部署指南.md | 快速开始 |
| DEPLOY_BAOTA.md | 详细步骤 |
| BAOTA_CHECKLIST.md | 检查清单 |
| BAOTA_FILES.md | 文件说明 |

---

## 🔒 安全检查

```
✅ 修改前台密码
✅ 修改后台密码
✅ 修改 SUPER_PASSWORD
✅ 修改 JWT_SECRET
✅ 配置 SSL 证书
✅ 设置定期备份
✅ 关闭 3000 端口外网访问
```

---

## 📞 获取帮助

1. 查看日志: `pm2 logs photo-album`
2. 查看文档: `DEPLOY_BAOTA.md`
3. 检查清单: `BAOTA_CHECKLIST.md`

---

## 🎉 部署完成后

访问: `https://your-domain.com`
后台: `https://your-domain.com/admin`

**记得修改所有默认密码！** 🔐
