#!/bin/bash

echo "=========================================="
echo "🚀 免费平台部署准备脚本"
echo "=========================================="
echo

echo "📦 1. 安装 SQLite 依赖..."
npm uninstall pg pg-hstore
npm install sqlite3

echo
echo "🔧 2. 构建前端..."
npm run build

echo
echo "🗄️ 3. 测试 SQLite 数据库连接..."
npm run test-db

echo
echo "✅ 部署准备完成！"
echo
echo "📋 接下来的步骤："
echo "1. 将代码推送到 GitHub"
echo "2. 在 Railway/Render 等平台连接你的仓库"
echo "3. 设置环境变量："
echo "   - NODE_ENV=production"
echo "   - JWT_SECRET=随机生成的密钥"
echo "   - SUPER_PASSWORD=你的超级密码"
echo
echo "🌐 推荐的免费部署平台："
echo "- Railway: https://railway.app"
echo "- Render: https://render.com"
echo "- Vercel: https://vercel.com (仅前端)"
echo