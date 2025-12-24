@echo off
chcp 65001 >nul
echo ========================================
echo   上传项目到 GitHub
echo ========================================
echo.

echo [1/3] 检查 Git 状态...
git status
echo.

echo [2/3] 准备推送到 GitHub...
echo 仓库地址: https://github.com/molianglearing/photo-design.git
echo.

echo [3/3] 开始推送...
echo 注意: 如果弹出登录窗口，请登录你的 GitHub 账号
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   ✓ 上传成功！
    echo ========================================
    echo.
    echo 访问你的仓库:
    echo https://github.com/molianglearing/photo-design
    echo.
) else (
    echo.
    echo ========================================
    echo   ✗ 上传失败
    echo ========================================
    echo.
    echo 可能的原因:
    echo 1. 网络连接问题
    echo 2. 需要身份验证
    echo 3. 仓库权限问题
    echo.
    echo 建议: 下载并使用 GitHub Desktop
    echo https://desktop.github.com/
    echo.
)

pause
