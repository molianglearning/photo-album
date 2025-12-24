@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ==========================================
REM 宝塔服务器部署脚本 (Windows 版本)
REM ==========================================
REM 在本地 Windows 打包后上传到服务器
REM 使用方法: baota-deploy.bat
REM ==========================================

echo.
echo ========================================
echo 🚀 私密相册系统 - 宝塔部署准备
echo ========================================
echo.

REM 检查 Node.js
echo [1/5] 检查 Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未安装 Node.js，请先安装
    pause
    exit /b 1
)
node -v
echo ✅ Node.js 已安装
echo.

REM 检查 npm
echo [2/5] 检查 npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未安装 npm
    pause
    exit /b 1
)
npm -v
echo ✅ npm 已安装
echo.

REM 安装依赖
echo [3/5] 安装依赖...
if not exist "node_modules" (
    echo 正在安装依赖，请稍候...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
)
echo ✅ 依赖已安装
echo.

REM 构建前端
echo [4/5] 构建前端...
echo 正在构建，请稍候...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 前端构建失败
    pause
    exit /b 1
)
echo ✅ 前端构建完成
echo.

REM 打包项目
echo [5/5] 打包项目...
call npm run package
if %errorlevel% neq 0 (
    echo ❌ 项目打包失败
    pause
    exit /b 1
)
echo ✅ 项目打包完成
echo.

REM 显示打包结果
echo ========================================
echo 🎉 打包完成！
echo ========================================
echo.
echo 📁 打包文件位置: package-release\
echo.
echo 📝 下一步操作:
echo.
echo 1. 压缩 package-release 文件夹
echo    右键 package-release → 发送到 → 压缩文件
echo.
echo 2. 上传到宝塔服务器
echo    - 登录宝塔面板
echo    - 文件管理 → 上传
echo    - 上传到 /www/wwwroot/photo-album
echo.
echo 3. 在服务器解压文件
echo.
echo 4. 在宝塔终端执行:
echo    cd /www/wwwroot/photo-album
echo    bash baota-deploy.sh
echo.
echo 📚 详细文档:
echo    - DEPLOY_BAOTA.md (完整部署指南)
echo    - BAOTA_CHECKLIST.md (检查清单)
echo.
echo ========================================
echo.

REM 询问是否打开文件夹
set /p open="是否打开 package-release 文件夹? (Y/N): "
if /i "%open%"=="Y" (
    start explorer package-release
)

pause
