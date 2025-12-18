# 🚀 超简单部署指南

## 免费部署平台对比

| 平台 | 难度 | 数据库 | 免费额度 | 推荐度 |
|------|------|--------|----------|--------|
| **Vercel** | ⭐ 最简单 | 需外接 | 无限 | ⭐⭐⭐⭐⭐ |
| **Railway** | ⭐⭐ 简单 | ✅ 内置 | $5/月 | ⭐⭐⭐⭐⭐ |
| **Render** | ⭐⭐ 简单 | ✅ 内置 | 有限制 | ⭐⭐⭐⭐ |
| **Zeabur** | ⭐ 最简单 | ✅ 内置 | 有限制 | ⭐⭐⭐⭐ |

---

## 🎯 方案 1: Railway（最推荐）

### 为什么选 Railway？
- ✅ 一键部署，超级简单
- ✅ 自带 PostgreSQL 数据库
- ✅ 每月 $5 免费额度
- ✅ 自动 HTTPS
- ✅ 支持文件上传

### 部署步骤（5分钟搞定）

#### 1. 注册 Railway
访问: https://railway.app
用 GitHub 账号登录

#### 2. 创建新项目
- 点击 "New Project"
- 选择 "Deploy from GitHub repo"
- 选择你的项目仓库

#### 3. 添加数据库
- 点击 "New" → "Database" → "Add PostgreSQL"
- Railway 会自动配置数据库连接

#### 4. 配置环境变量
在项目设置中添加：
```
NODE_ENV=production
JWT_SECRET=your_random_secret_key
SUPER_PASSWORD=your_super_password
```

#### 5. 初始化数据库
在 Railway 控制台运行：
```bash
npm run init-db
```

#### 6. 完成！
Railway 会自动部署，给你一个域名，比如：
`https://your-app.railway.app`

---

## 🎯 方案 2: Vercel + Supabase

### 为什么选这个组合？
- ✅ 完全免费
- ✅ 部署超简单
- ✅ Supabase 提供免费 PostgreSQL

### 部署步骤

#### 1. 部署数据库到 Supabase
1. 访问: https://supabase.com
2. 创建新项目
3. 获取数据库连接字符串

#### 2. 部署应用到 Vercel
1. 访问: https://vercel.com
2. 导入 GitHub 仓库
3. 配置环境变量：
   ```
   DATABASE_URL=你的Supabase连接字符串
   JWT_SECRET=随机密钥
   SUPER_PASSWORD=超级密码
   ```
4. 点击 Deploy

#### 3. 初始化数据库
在 Vercel 控制台运行：
```bash
npm run init-db
```

---

## 🎯 方案 3: Render（稳定可靠）

### 部署步骤

#### 1. 注册 Render
访问: https://render.com
用 GitHub 登录

#### 2. 创建 Web Service
- 点击 "New +" → "Web Service"
- 连接 GitHub 仓库
- 配置：
  - Build Command: `npm install && npm run build`
  - Start Command: `npm run server`

#### 3. 添加 PostgreSQL
- 点击 "New +" → "PostgreSQL"
- 创建数据库
- 复制连接字符串

#### 4. 配置环境变量
在 Web Service 设置中添加：
```
DATABASE_URL=你的数据库连接字符串
NODE_ENV=production
JWT_SECRET=随机密钥
SUPER_PASSWORD=超级密码
```

#### 5. 初始化数据库
部署完成后，在 Shell 中运行：
```bash
npm run init-db
```

---

## 🎯 方案 4: Zeabur（国内访问快）

### 为什么选 Zeabur？
- ✅ 中文界面
- ✅ 国内访问快
- ✅ 一键部署
- ✅ 自带数据库

### 部署步骤

#### 1. 注册 Zeabur
访问: https://zeabur.com
用 GitHub 登录

#### 2. 创建项目
- 点击 "创建项目"
- 选择 "从 GitHub 导入"
- 选择你的仓库

#### 3. 添加 PostgreSQL
- 点击 "添加服务"
- 选择 "PostgreSQL"

#### 4. 配置环境变量
```
NODE_ENV=production
JWT_SECRET=随机密钥
SUPER_PASSWORD=超级密码
```

#### 5. 部署完成
Zeabur 会自动部署并提供域名

---

## 📝 部署后必做

无论选择哪个平台，部署后都要：

1. ✅ 运行 `npm run init-db` 初始化数据库
2. ✅ 访问后台修改默认密码
3. ✅ 测试上传功能
4. ✅ 绑定自定义域名（可选）

---

## 🆘 遇到问题？

### 数据库连接失败
检查环境变量中的数据库连接字符串是否正确

### 图片上传失败
某些平台不支持文件系统存储，需要使用对象存储（如 AWS S3、阿里云 OSS）

### 端口错误
确保使用环境变量 `PORT`，不要硬编码端口号

---

## 💡 我的推荐

**新手首选**: Railway
- 最简单，一键部署
- 自带数据库
- 有免费额度

**完全免费**: Vercel + Supabase
- 两个都是免费的
- 需要配置两个平台

**国内用户**: Zeabur
- 中文界面
- 访问速度快
- 支持支付宝

---

## 📞 需要帮助？

如果部署遇到问题，可以：
1. 查看平台的官方文档
2. 检查环境变量配置
3. 查看部署日志
4. 运行 `npm run show-passwords` 查看密码
