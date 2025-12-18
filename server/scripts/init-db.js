import bcrypt from 'bcrypt'
import sequelize from '../config/database.js'
import SiteConfig from '../models/SiteConfig.js'
import Category from '../models/Category.js'
import Album from '../models/Album.js'
import Photo from '../models/Photo.js'

const initDatabase = async () => {
  try {
    console.log('开始初始化数据库...')
    
    // 连接数据库
    await sequelize.authenticate()
    console.log('✓ 数据库连接成功')
    
    // 同步模型（创建表）
    await sequelize.sync({ force: true })
    console.log('✓ 数据表创建成功')
    
    // 创建默认配置
    const accessPassword = await bcrypt.hash('user123', 10)
    const adminPassword = await bcrypt.hash('admin123', 10)
    
    await SiteConfig.create({
      site_title: '我的私密相册',
      site_description: '欢迎来到我的私密相册',
      access_password: accessPassword,
      admin_password: adminPassword
    })
    console.log('✓ 默认配置创建成功')
    console.log('  前台密码: user123')
    console.log('  后台密码: admin123')
    
    // 创建示例数据
    const category1 = await Category.create({
      name: '旅行回忆',
      description: '记录美好的旅行时光',
      sort_order: 0
    })
    
    const category2 = await Category.create({
      name: '生活日常',
      description: '日常生活的点点滴滴',
      sort_order: 1
    })
    
    console.log('✓ 示例分类创建成功')
    
    await Album.create({
      category_id: category1.id,
      name: '海边之旅',
      description: '2024年夏天的海边旅行',
      sort_order: 0
    })
    
    await Album.create({
      category_id: category1.id,
      name: '山间徒步',
      description: '登山的美好回忆',
      sort_order: 1
    })
    
    await Album.create({
      category_id: category2.id,
      name: '美食记录',
      description: '品尝过的美味',
      sort_order: 0
    })
    
    console.log('✓ 示例相册创建成功')
    
    console.log('\n数据库初始化完成！')
    console.log('请运行以下命令启动服务：')
    console.log('  npm run dev    # 开发模式')
    console.log('  npm run server # 仅启动后端')
    
    process.exit(0)
  } catch (error) {
    console.error('初始化失败:', error)
    process.exit(1)
  }
}

initDatabase()
