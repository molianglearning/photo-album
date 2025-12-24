import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import sequelize from './config/database.js'
import authRoutes from './routes/auth.js'
import frontendRoutes from './routes/frontend.js'
import adminRoutes from './routes/admin.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
// 增加请求体大小限制到 100MB
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '100mb', parameterLimit: 50000 }))

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// API 路由
app.use('/api', authRoutes)
app.use('/api', frontendRoutes)
app.use('/api', adminRoutes)

// 生产环境：提供前端静态文件
if (process.env.NODE_ENV === 'production') {
  // 提供前端构建后的静态文件
  app.use(express.static(path.join(__dirname, '../dist')))
  
  // 所有非 API 请求都返回 index.html，支持前端路由
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })
}

// 数据库连接和启动服务器
const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log('数据库连接成功')
    
    // 自动同步数据库表结构
    await sequelize.sync({ alter: true })
    console.log('数据库同步完成')
    
    // 检查是否需要初始化默认数据
    const { default: SiteConfig } = await import('./models/SiteConfig.js')
    const configCount = await SiteConfig.count()
    
    if (configCount === 0) {
      console.log('检测到数据库为空，开始初始化...')
      const bcrypt = (await import('bcrypt')).default
      
      // 创建默认配置
      const accessPassword = await bcrypt.hash('user123', 10)
      const adminPassword = await bcrypt.hash('admin123', 10)
      
      await SiteConfig.create({
        site_title: '我的私密相册',
        site_description: '欢迎来到我的私密相册',
        access_password: accessPassword,
        admin_password: adminPassword
      })
      
      console.log('✓ 数据库初始化完成')
      console.log('  前台密码: user123')
      console.log('  后台密码: admin123')
      console.log(`  超级密码: ${process.env.SUPER_PASSWORD || '未设置'}`)
    }
    
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('启动失败:', error)
    process.exit(1)
  }
}

startServer()
