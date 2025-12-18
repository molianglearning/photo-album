import bcrypt from 'bcrypt'
import sequelize from '../config/database.js'
import SiteConfig from '../models/SiteConfig.js'

const resetPassword = async () => {
  try {
    await sequelize.authenticate()
    console.log('数据库连接成功\n')
    
    const config = await SiteConfig.findOne()
    
    if (!config) {
      console.log('❌ 未找到配置，请先运行初始化脚本：')
      console.log('   node server/scripts/init-db.js\n')
      process.exit(1)
    }
    
    console.log('正在重置密码...\n')
    
    // 重置密码
    const accessPassword = await bcrypt.hash('user123', 10)
    const adminPassword = await bcrypt.hash('admin123', 10)
    
    await config.update({
      access_password: accessPassword,
      admin_password: adminPassword
    })
    
    console.log('✓ 密码重置成功！')
    console.log('- 前台访问密码: user123')
    console.log('- 后台管理密码: admin123\n')
    
    process.exit(0)
  } catch (error) {
    console.error('重置失败:', error.message)
    process.exit(1)
  }
}

resetPassword()
