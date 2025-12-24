# 上传到 GitHub 完整指南

## 🎯 推荐方法：使用 GitHub Desktop（最简单）

### 下载和安装
1. 访问：https://desktop.github.com/
2. 下载 Windows 版本
3. 安装并打开

### 使用步骤
1. **登录 GitHub**
   - 打开 GitHub Desktop
   - 点击 "Sign in to GitHub.com"
   - 在浏览器中登录你的 GitHub 账号
   - 授权 GitHub Desktop

2. **添加本地仓库**
   - 点击 "File" → "Add local repository"
   - 点击 "Choose..." 按钮
   - 选择你的项目文件夹：
     ```
     D:\360MoveData\Users\moliang\Desktop\Daily Development\AI project\25.12\相册设计
     ```
   - 点击 "Add repository"

3. **发布到 GitHub**
   - 点击顶部的 "Publish repository" 按钮
   - 在弹出窗口中：
     - Name: photo-design
     - Description: 私密相册管理系统
     - 取消勾选 "Keep this code private"（如果想公开）
   - 点击 "Publish repository"

4. **等待上传完成**
   - GitHub Desktop 会自动上传所有文件
   - 完成后会显示 "Last fetched just now"

5. **验证**
   - 访问：https://github.com/molianglearing/photo-design
   - 应该能看到所有代码文件

---

## 🔧 备选方法：使用命令行（需要 Token）

### 步骤 1: 生成 Personal Access Token

1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 设置：
   - Note: `photo-design-upload`
   - Expiration: `90 days`
   - 勾选权限：`repo`（全部勾选）
4. 点击 "Generate token"
5. **立即复制 token**（只显示一次！）

### 步骤 2: 推送代码

在项目目录打开命令行，执行：

```bash
# 1. 确认远程仓库
git remote -v

# 2. 如果没有 origin，添加它
git remote add origin https://github.com/molianglearing/photo-design.git

# 3. 推送代码
git push -u origin main
```

当提示输入用户名和密码时：
- Username: `molianglearing`
- Password: **粘贴你刚才复制的 Token**（不是 GitHub 密码）

---

## 🌐 备选方法：使用 Gitee（国内访问快）

如果 GitHub 访问慢，可以先传到 Gitee，再同步到 GitHub：

### 1. 注册 Gitee
访问：https://gitee.com/

### 2. 创建仓库
- 点击右上角 "+"
- 选择 "新建仓库"
- 仓库名称：photo-design
- 点击 "创建"

### 3. 推送到 Gitee
```bash
git remote add gitee https://gitee.com/你的用户名/photo-design.git
git push -u gitee main
```

### 4. 从 Gitee 导入到 GitHub
1. 访问：https://github.com/new/import
2. 输入 Gitee 仓库地址
3. 点击 "Begin import"

---

## ❓ 常见问题

### Q1: GitHub Desktop 下载很慢
**解决**：使用国内镜像下载
- 访问：https://github.com/desktop/desktop/releases
- 下载最新的 `.exe` 文件

### Q2: 推送时提示 "Permission denied"
**解决**：
1. 确保已登录 GitHub 账号
2. 使用 Personal Access Token 而不是密码
3. 或使用 GitHub Desktop

### Q3: 推送时提示 "Repository not found"
**解决**：
1. 检查仓库名称是否正确
2. 确保仓库已创建
3. 检查用户名拼写

### Q4: 网络连接失败
**解决**：
1. 检查网络连接
2. 尝试使用 GitHub Desktop
3. 或使用 Gitee 作为中转

---

## ✅ 验证上传成功

访问你的仓库：https://github.com/molianglearing/photo-design

应该能看到：
- ✅ README.md
- ✅ package.json
- ✅ server/ 文件夹
- ✅ src/ 文件夹
- ✅ 其他所有文件

---

## 📞 需要帮助？

如果遇到问题：
1. 截图错误信息
2. 说明使用的方法
3. 我会帮你解决
