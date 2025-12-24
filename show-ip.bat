@echo off
chcp 65001 > nul
echo.
echo ========================================
echo 本机 IP 地址查询
echo ========================================
echo.

ipconfig | findstr /c:"IPv4"

echo.
echo ========================================
echo 手机访问地址
echo ========================================
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)

:found
set IP=%IP:~1%
echo 前端开发服务器: http://%IP%:5173
echo 后端 API 服务器: http://%IP%:3000
echo.
echo 提示：确保手机和电脑在同一个 WiFi 网络
echo.
pause
