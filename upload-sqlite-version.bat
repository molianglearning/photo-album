@echo off
chcp 65001 >nul
echo ==========================================
echo 🚀 上传 SQLite 版本到 GitHub
echo ==========================================
echo.

echo 📋 本次更新内容：
echo - ✅ 数据库从 PostgreSQL 迁移到 SQLite
echo - ✅ 支持 Vercel/Railway/Render 免费部署
echo - ✅ 添加一键部署脚本
echo - ✅ 优化移动端体验
echo.

echo 🔍 [1/5] 检查项目状态...
if not exist "package.json" (
    echo ❌ 错误：未找到 package.json 文件
    echo 请确保在项目根目录运行此脚本
    pause
    exit /b 1
)

echo ✅ 项目文件检查通过
echo.

echo 📦 [2/5] 检查依赖...
if not exist "node_modules\sqlite3" (
    echo 🔧 正在安装 SQLite3 依赖...
    call npm install sqlite3
) else (
    echo ✅ SQLite3 依赖已安装
)

echo.
echo 🏗️ [3/5] 构建项目...
call npm run build
if errorlevel 1 (
    echo ❌ 构建失败，请检查错误信息
    pause
    exit /b 1
)
echo ✅ 项目构建成功

echo.
echo 📝 [4/5] 提交更改到 Git...
git add .
git commit -m "feat: 迁移到 SQLite 数据库，支持免费平台部署

- 🗄️ 数据库从 PostgreSQL 迁移到 SQLite
- 🚀 支持 Vercel 一键部署
- 🆓 支持 Railway/Render 免费部署
- 📱 优化移动端预览体验
- 🔧 添加部署脚本和配置文件
- 📚 更新部署文档

部署平台支持：
- Vercel (推荐演示)
- Railway (推荐生产)
- Render (完全免费)
- 宝塔面板 (传统部署)"

echo.
echo 🌐 [5/5] 推送到 GitHub...
echo 仓库地址: https://github.com/molianglearing/photo-design.git
echo.
echo 注意: 如果弹出登录窗口，请登录你的 GitHub 账号
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ==========================================
    echo   🎉 上传成功！
    echo ==========================================
    echo.
    echo 📋 接下来可以：
    echo.
    echo 🚀 1. Vercel 部署 (最简单)
    echo    访问: https://vercel.com
    echo    导入仓库: https://github.com/molianglearing/photo-design
    echo.
    echo 🚂 2. Railway 部署 (推荐生产)
    echo    访问: https://railway.app
    echo    导入仓库: https://github.com/molianglearing/photo-design
    echo.
    echo 🎨 3. Render 部署 (完全免费)
    echo    访问: https://render.com
    echo    导入仓库: https://github.com/molianglearing/photo-design
    echo.
    echo 📱 4. 查看项目
    echo    GitHub: https://github.com/molianglearing/photo-design
    echo.
    echo 💡 提示: 部署时记得设置环境变量！
    echo    参考文件: .env.vercel 或 DEPLOY_VERCEL.md
    echo.
) else (
    echo.
    echo ==========================================
    echo   ❌ 上传失败
    echo ==========================================
    echo.
    echo 🔧 可能的解决方案:
    echo.
    echo 1. 检查网络连接
    echo 2. 验证 GitHub 身份认证
    echo 3. 确认仓库权限
    echo.
    echo 💡 建议使用 GitHub Desktop:
    echo    下载: https://desktop.github.com/
    echo.
    echo 🔑 或配置 Git 凭据:
    echo    git config --global user.name "你的用户名"
    echo    git config --global user.email "你的邮箱"
    echo.
)

echo.
echo 📚 相关文档:
echo - DEPLOY_VERCEL.md  (Vercel 部署指南)
echo - DEPLOY_FREE.md    (免费平台部署)
echo - README.md         (项目说明)
echo.
pause