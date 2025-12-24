@echo off
chcp 65001 > nul
echo ========================================
echo 手机预览配置
echo ========================================
echo.

echo 正在获取本机 IP 地址...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)

:found
set IP=%IP:~1%
echo.
echo ========================================
echo 你的 IP 地址是: %IP%
echo ========================================
echo.
echo 请在手机浏览器访问:
echo.
echo   http://%IP%:5173
echo.
echo ========================================
echo.
echo 提示：
echo 1. 确保手机和电脑在同一个 WiFi 网络
echo 2. 如果无法访问，请检查防火墙设置
echo 3. 按 Ctrl+C 可以停止服务器
echo.
echo ========================================
echo.
echo 正在启动服务器...
echo.

REM 启动后端服务器
start "后端服务器 - 端口 3000" cmd /k "npm run server"

REM 等待 3 秒让后端启动
timeout /t 3 > nul

REM 启动前端开发服务器
start "前端服务器 - 端口 5173" cmd /k "npm run dev"

echo.
echo ========================================
echo 服务器已启动！
echo ========================================
echo.
echo 前端地址: http://%IP%:5173
echo 后端地址: http://%IP%:3000
echo.
echo 在手机浏览器中访问前端地址即可预览
echo.
pause
