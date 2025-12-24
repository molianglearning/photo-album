@echo off
chcp 65001 >nul
echo ==========================================
echo 🚀 Vercel 部署脚本
echo ==========================================
echo.

echo ⚠️  重要提醒：
echo Vercel 是无服务器平台，数据不会持久化保存
echo 适合演示和测试使用，生产环境建议使用 Railway
echo.

echo 📦 1. 检查并安装依赖...
if not exist "node_modules\sqlite3" (
    echo 正在安装 SQLite3...
    call npm install sqlite3
) else (
    echo ✅ SQLite3 已安装
)

echo.
echo 🔧 2. 构建前端...
call npm run build
if errorlevel 1 (
    echo ❌ 构建失败，请检查错误信息
    pause
    exit /b 1
)

echo.
echo 🧪 3. 测试本地运行...
echo 启动本地服务器测试...
timeout /t 2 >nul
start /b npm run server
timeout /t 5 >nul

echo.
echo 🌐 4. 准备部署到 Vercel...
echo.
echo 请选择部署方式：
echo 1. 通过 Vercel 网站部署（推荐）
echo 2. 使用 Vercel CLI 部署
echo.
set /p choice=请输入选择 (1 或 2): 

if "%choice%"=="1" (
    echo.
    echo 📋 网站部署步骤：
    echo 1. 将代码推送到 GitHub
    echo 2. 访问 https://vercel.com
    echo 3. 导入你的 GitHub 仓库
    echo 4. 配置环境变量：
    echo    - NODE_ENV=production
    echo    - JWT_SECRET=随机密钥
    echo    - SUPER_PASSWORD=你的密码
    echo    - DB_PATH=/tmp/database.sqlite
    echo.
    echo 🔑 生成 JWT_SECRET：
    node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
    echo.
    echo 📤 推送代码到 GitHub...
    git add .
    git commit -m "配置 Vercel 部署"
    git push origin main
    echo.
    echo ✅ 代码已推送，请到 Vercel 网站完成部署
    start https://vercel.com
) else if "%choice%"=="2" (
    echo.
    echo 📦 安装 Vercel CLI...
    call npm install -g vercel
    echo.
    echo 🔐 登录 Vercel...
    call vercel login
    echo.
    echo 🚀 开始部署...
    call vercel --prod
) else (
    echo ❌ 无效选择
)

echo.
echo 📋 部署完成后的默认密码：
echo - 前台访问：user123
echo - 后台管理：admin123
echo - 超级密码：你设置的 SUPER_PASSWORD
echo.
pause