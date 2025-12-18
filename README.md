# 私密相册管理系统

一个基于密码访问的私密相册网站，移动端优先设计，简洁易用。

## 技术栈

- **前端**: Vue 3 + Vue Router + Pinia
- **后端**: Node.js + Express + Sequelize
- **数据库**: PostgreSQL

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置数据库

确保已安装 PostgreSQL，然后创建数据库：

```bash
createdb photo_album
```

修改 `.env` 文件中的数据库配置：

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=photo_album
DB_USER=postgres
DB_PASSWORD=your_password
```

### 3. 初始化数据库

```bash
npm run init-db
```

**默认密码（请务必记住）：**
- 🔑 前台访问密码: `user123`
- 🔐 后台管理密码: `admin123`
- ⚡ 超级密码: `SuperAdmin@2024` （可用于前台和后台，配置在 .env 文件中）

**查看所有密码：**
```bash
npm run show-passwords
```

**忘记常规密码？重置为默认密码：**
```bash
npm run reset-password
```

**超级密码说明：**
- 超级密码是紧急访问通道，即使忘记了常规密码也能登录
- 超级密码配置在 `.env` 文件的 `SUPER_PASSWORD` 变量中
- 可以同时用于前台和后台登录
- 不会被"密码管理"功能修改，始终有效
- 建议部署后立即修改为复杂密码

### 4. 启动项目

开发模式（前后端同时启动）：

```bash
npm run dev
```

或分别启动：

```bash
# 终端1 - 启动后端
npm run server

# 终端2 - 启动前端
npm run dev
```

### 5. 访问应用

- 前台: http://localhost:5173
- 后台: http://localhost:5173/admin
- 后端API: http://localhost:3000

默认登录信息：
- 前台密码: `user123`
- 后台密码: `admin123`

## 项目结构

```
photo-album/
├── server/              # 后端代码
│   ├── config/         # 配置文件
│   ├── models/         # 数据模型
│   ├── routes/         # 路由
│   ├── middleware/     # 中间件
│   ├── scripts/        # 脚本
│   └── uploads/        # 上传文件（自动创建）
├── src/                # 前端代码
│   ├── views/          # 页面组件
│   │   └── frontend/   # 前台页面
│   ├── router/         # 路由配置
│   ├── stores/         # 状态管理
│   └── api/            # API接口
└── package.json
```

## 功能特点

### 前台功能
- ✅ 密码登录访问
- ✅ 分类浏览
- ✅ 相册列表
- ✅ 照片展示（网格布局）
- ✅ 图片灯箱查看
- ✅ 移动端优化

### 后台功能
- ✅ 管理员登录
- ✅ 数据统计仪表盘
- ✅ 站点设置
- ✅ 密码管理（前台/后台密码）
- ✅ 分类管理（增删改）
- ✅ 相册管理（增删改）
- ✅ 照片上传与管理
- ✅ 批量上传照片
- ✅ 批量删除照片

## 设计特点

- 移动端优先设计
- 极简风格，专注内容
- 响应式布局
- 流畅的交互体验

## 使用说明

### 前台使用
1. 访问 http://localhost:5173
2. 输入密码 `user123` 登录
3. 浏览分类、相册和照片
4. 点击照片可放大查看

### 后台使用
1. 访问 http://localhost:5173/admin
2. 输入管理员密码 `admin123` 登录
3. 在仪表盘查看统计信息
4. 管理分类、相册和照片
5. 修改站点设置和密码

### 上传照片
1. 进入后台 → 照片管理
2. 选择要上传到的相册
3. 点击"选择照片上传"
4. 可一次选择多张照片
5. 等待上传完成

## 后续优化

可以继续添加的功能：
1. 拖拽排序功能
2. 图片标签系统
3. 搜索功能
4. 图片编辑功能
5. 更多优化...

## 注意事项

- 确保 PostgreSQL 服务已启动
- 首次运行需要执行数据库初始化脚本
- 生产环境请修改 `.env` 中的密钥和密码
- 上传的图片存储在 `server/uploads` 目录
