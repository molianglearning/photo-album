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
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
    
    await sequelize.sync()
    console.log('数据库同步完成')
    
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('启动失败:', error)
    process.exit(1)
  }
}

startServer()
