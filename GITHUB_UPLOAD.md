# 上传到 GitHub 指南

## 方法 1: 使用 GitHub Desktop（最简单）

### 1. 下载 GitHub Desktop
访问: https://desktop.github.com/
下载并安装

### 2. 登录 GitHub 账号
打开 GitHub Desktop，登录你的 GitHub 账号

### 3. 添加本地仓库
- 点击 "File" → "Add local repository"
- 选择你的项目文件夹
- 点击 "Add repository"

### 4. 发布到 GitHub
- 点击 "Publish repository"
- 确认仓库名称为 `photo-design`
- 取消勾选 "Keep this code private"（如果想公开）
- 点击 "Publish repository"

完成！代码已上传到 GitHub。

---

## 方法 2: 使用命令行（需要配置）

### 1. 配置 Git 用户信息（首次使用）
```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub邮箱"
```

### 2. 生成 Personal Access Token
1. 访问: https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 勾选 `repo` 权限
4. 点击 "Generate token"
5. **复制生成的 token**（只显示一次）

### 3. 推送代码
```bash
# 添加远程仓库
git remote add origin https://github.com/molianglearing/photo-design.git

# 推送代码（会要求输入用户名和密码）
git push -u origin main
```

当要求输入密码时，输入你刚才复制的 **Personal Access Token**（不是 GitHub 密码）

---

## 方法 3: 使用 SSH（推荐，一次配置永久使用）

### 1. 生成 SSH 密钥
```bash
ssh-keygen -t ed25519 -C "你的邮箱"
```
一路回车即可

### 2. 复制公钥
```bash
# Windows
type %USERPROFILE%\.ssh\id_ed25519.pub

# Mac/Linux
cat ~/.ssh/id_ed25519.pub
```

### 3. 添加到 GitHub
1. 访问: https://github.com/settings/keys
2. 点击 "New SSH key"
3. 粘贴公钥内容
4. 点击 "Add SSH key"

### 4. 修改远程仓库地址为 SSH
```bash
git remote remove origin
git remote add origin git@github.com:molianglearing/photo-design.git
git push -u origin main
```

---

## 验证上传成功

访问你的仓库: https://github.com/molianglearing/photo-design

应该能看到所有代码文件。

---

## 常见问题

### Q: 提示 "Repository not found"
**A**: 检查仓库名称是否正确，确保已登录 GitHub 账号

### Q: 提示 "Permission denied"
**A**: 需要配置身份验证（使用 GitHub Desktop 或 Personal Access Token）

### Q: 推送很慢
**A**: 可能是网络问题，可以尝试：
- 使用 GitHub Desktop
- 配置代理
- 使用国内 Git 镜像

---

## 推荐方式

**新手**: 使用 GitHub Desktop（最简单，图形界面）
**熟练**: 使用 SSH（一次配置，永久使用）
