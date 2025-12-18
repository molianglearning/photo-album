import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')

console.log('📦 开始打包项目...\n')

// 1. 构建前端
console.log('1️⃣ 构建前端...')
try {
  execSync('npm run build', { stdio: 'inherit', cwd: rootDir })
  console.log('✅ 前端构建完成\n')
} catch (error) {
  console.error('❌ 前端构建失败')
  process.exit(1)
}

// 2. 创建打包目录
const packageDir = path.join(rootDir, 'package-release')
if (fs.existsSync(packageDir)) {
  fs.rmSync(packageDir, { recursive: true })
}
fs.mkdirSync(packageDir, { recursive: true })
console.log('2️⃣ 创建打包目录\n')

// 3. 复制必要文件
console.log('3️⃣ 复制文件...')
const filesToCopy = [
  'dist',
  'server',
  'package.json',
  'package-lock.json',
  '.env.example',
  'ecosystem.config.cjs',
  'README.md',
  'DEPLOYMENT.md',
  'SECURITY.md',
  'PASSWORDS.md'
]

function copyRecursive(src, dest) {
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true })
    }
    fs.readdirSync(src).forEach(file => {
      copyRecursive(path.join(src, file), path.join(dest, file))
    })
  } else {
    fs.copyFileSync(src, dest)
  }
}

filesToCopy.forEach(file => {
  const srcPath = path.join(rootDir, file)
  const destPath = path.join(packageDir, file)
  
  if (fs.existsSync(srcPath)) {
    copyRecursive(srcPath, destPath)
    console.log(`  ✓ ${file}`)
  }
})

// 4. 创建 .env 模板
fs.copyFileSync(
  path.join(rootDir, '.env.example'),
  path.join(packageDir, '.env')
)
console.log('  ✓ .env (从模板创建)')

// 5. 创建部署说明
const deployNote = `# 部署说明

## 📋 部署前准备

1. 安装 Node.js (>= 16)
2. 安装 PostgreSQL (>= 12) 或 MySQL (>= 5.7)
3. 安装 PM2: npm install -g pm2

## 🚀 快速部署

### 1. 安装依赖
\`\`\`bash
npm install --production
\`\`\`

### 2. 配置环境变量
编辑 .env 文件，修改以下配置：
- 数据库连接信息
- JWT_SECRET（必须修改）
- SUPER_PASSWORD（必须修改）

### 3. 初始化数据库
\`\`\`bash
npm run init-db
\`\`\`

### 4. 启动服务
\`\`\`bash
npm run pm2:start
\`\`\`

### 5. 查看状态
\`\`\`bash
npm run pm2:status
\`\`\`

## 📚 详细文档

- 完整部署指南: DEPLOYMENT.md
- 安全说明: SECURITY.md
- 密码管理: PASSWORDS.md
- 使用说明: README.md

## 🔑 默认密码

- 前台访问: user123
- 后台管理: admin123
- 超级密码: SuperAdmin@2024 (请立即修改)

查看密码: npm run show-passwords

## ⚠️ 重要提示

1. 部署后立即修改所有默认密码
2. 确保 .env 文件权限安全
3. 配置 HTTPS
4. 定期备份数据库
`

fs.writeFileSync(path.join(packageDir, 'DEPLOY.txt'), deployNote)
console.log('  ✓ DEPLOY.txt\n')

console.log('✅ 打包完成！')
console.log(`\n📁 打包文件位置: ${packageDir}`)
console.log('\n📝 下一步:')
console.log('  1. 将 package-release 目录上传到服务器')
console.log('  2. 在服务器上运行: npm install --production')
console.log('  3. 配置 .env 文件')
console.log('  4. 运行: npm run init-db')
console.log('  5. 运行: npm run pm2:start')
console.log('\n详细说明请查看 DEPLOYMENT.md 文件')
