import bcrypt from 'bcrypt'
import sequelize from '../config/database.js'
import SiteConfig from '../models/SiteConfig.js'

const checkPassword = async () => {
  try {
    await sequelize.authenticate()
    console.log('数据库连接成功\n')
    
    const config = await SiteConfig.findOne()
    
    if (!config) {
      console.log('❌ 未找到配置，请先运行初始化脚本：')
      console.log('   node server/scripts/init-db.js\n')
      process.exit(1)
    }
    
    console.log('站点配置信息：')
    console.log('- 站点标题:', config.site_title)
    console.log('- 站点描述:', config.site_description)
    console.log('\n密码验证测试：')
    
    // 测试前台密码
    const testUserPassword = 'user123'
    const userValid = await bcrypt.compare(testUserPassword, config.access_password)
    console.log(`- 前台密码 "${testUserPassword}":`, userValid ? '✓ 正确' : '✗ 错误')
    
    // 测试管理员密码
    const testAdminPassword = 'admin123'
    const adminValid = await bcrypt.compare(testAdminPassword, config.admin_password)
    console.log(`- 后台密码 "${testAdminPassword}":`, adminValid ? '✓ 正确' : '✗ 错误')
    
    console.log('\n如果密码不正确，请运行重置脚本：')
    console.log('   node server/scripts/reset-password.js\n')
    
    process.exit(0)
  } catch (error) {
    console.error('检查失败:', error.message)
    process.exit(1)
  }
}

checkPassword()
