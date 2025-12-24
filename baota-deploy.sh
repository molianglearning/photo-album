#!/bin/bash

# ==========================================
# 宝塔服务器部署脚本
# ==========================================
# 在服务器上运行此脚本快速部署应用
# 使用方法: bash baota-deploy.sh
# ==========================================

set -e

echo "🚀 开始部署私密相册系统..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 项目目录
PROJECT_DIR="/www/wwwroot/photo-album"

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ 错误: 请在项目根目录运行此脚本${NC}"
    exit 1
fi

# 1. 检查 Node.js
echo -e "${YELLOW}1️⃣ 检查 Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 未安装 Node.js，请先在宝塔面板安装 Node.js${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js 版本: $(node -v)${NC}"
echo ""

# 2. 检查 PM2
echo -e "${YELLOW}2️⃣ 检查 PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  未安装 PM2，正在安装...${NC}"
    npm install -g pm2
fi
echo -e "${GREEN}✅ PM2 已安装${NC}"
echo ""

# 3. 检查 .env 文件
echo -e "${YELLOW}3️⃣ 检查环境配置...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  未找到 .env 文件，从模板创建...${NC}"
    cp .env.example .env
    echo -e "${RED}⚠️  请编辑 .env 文件配置数据库信息！${NC}"
    echo -e "${RED}⚠️  必须修改: DB_PASSWORD, JWT_SECRET, SUPER_PASSWORD${NC}"
    echo ""
    read -p "是否现在编辑 .env 文件? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        nano .env || vi .env
    else
        echo -e "${RED}❌ 请手动编辑 .env 文件后重新运行此脚本${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✅ 环境配置文件存在${NC}"
echo ""

# 4. 安装依赖
echo -e "${YELLOW}4️⃣ 安装依赖...${NC}"
npm install --production
echo -e "${GREEN}✅ 依赖安装完成${NC}"
echo ""

# 5. 检查数据库连接
echo -e "${YELLOW}5️⃣ 测试数据库连接...${NC}"
if [ -f "server/scripts/test-db-connection.js" ]; then
    node server/scripts/test-db-connection.js || {
        echo -e "${RED}❌ 数据库连接失败，请检查 .env 配置${NC}"
        exit 1
    }
fi
echo -e "${GREEN}✅ 数据库连接成功${NC}"
echo ""

# 6. 初始化数据库
echo -e "${YELLOW}6️⃣ 初始化数据库...${NC}"
read -p "是否初始化数据库? (会创建表和默认数据) (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run init-db
    echo -e "${GREEN}✅ 数据库初始化完成${NC}"
    echo -e "${YELLOW}📝 默认密码:${NC}"
    echo -e "   前台: user123"
    echo -e "   后台: admin123"
    echo -e "   超级密码: 查看 .env 文件"
else
    echo -e "${YELLOW}⏭️  跳过数据库初始化${NC}"
fi
echo ""

# 7. 创建上传目录
echo -e "${YELLOW}7️⃣ 创建上传目录...${NC}"
mkdir -p server/uploads
chmod 755 server/uploads
echo -e "${GREEN}✅ 上传目录创建完成${NC}"
echo ""

# 8. 停止旧进程
echo -e "${YELLOW}8️⃣ 停止旧进程...${NC}"
pm2 stop photo-album 2>/dev/null || echo "没有运行中的进程"
pm2 delete photo-album 2>/dev/null || echo "没有需要删除的进程"
echo ""

# 9. 启动应用
echo -e "${YELLOW}9️⃣ 启动应用...${NC}"
pm2 start server/app.js --name photo-album -i 2
pm2 save
echo -e "${GREEN}✅ 应用启动成功${NC}"
echo ""

# 10. 设置开机自启
echo -e "${YELLOW}🔟 设置开机自启...${NC}"
pm2 startup | tail -n 1 | bash || echo "请手动运行 pm2 startup"
echo ""

# 11. 显示状态
echo -e "${YELLOW}📊 应用状态:${NC}"
pm2 status
echo ""

# 12. 显示日志
echo -e "${YELLOW}📋 最近日志:${NC}"
pm2 logs photo-album --lines 20 --nostream
echo ""

# 完成
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}📝 下一步:${NC}"
echo "1. 配置 Nginx 反向代理 (参考 DEPLOY_BAOTA.md)"
echo "2. 访问网站测试功能"
echo "3. 修改默认密码"
echo "4. 配置 SSL 证书"
echo "5. 设置定期备份"
echo ""
echo -e "${YELLOW}🔧 常用命令:${NC}"
echo "  查看状态: pm2 status"
echo "  查看日志: pm2 logs photo-album"
echo "  重启应用: pm2 restart photo-album"
echo "  停止应用: pm2 stop photo-album"
echo ""
echo -e "${YELLOW}📚 详细文档:${NC}"
echo "  宝塔部署: DEPLOY_BAOTA.md"
echo "  检查清单: BAOTA_CHECKLIST.md"
echo ""
