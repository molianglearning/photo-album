import sequelize from '../config/database.js'
import Category from '../models/Category.js'
import Album from '../models/Album.js'

const addCoverImageFields = async () => {
  try {
    console.log('开始添加封面图片字段...')
    
    // 同步数据库模型（会自动添加缺失的字段）
    await sequelize.sync({ alter: true })
    
    console.log('✓ 封面图片字段添加成功')
    console.log('✓ 数据库结构已更新')
    
    process.exit(0)
  } catch (error) {
    console.error('添加封面图片字段失败:', error)
    process.exit(1)
  }
}

addCoverImageFields()
