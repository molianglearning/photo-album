import dotenv from 'dotenv'
import sequelize from '../config/database.js'
import SiteConfig from '../models/SiteConfig.js'

dotenv.config()

const showPasswords = async () => {
  try {
    await sequelize.authenticate()
    console.log('数据库连接成功\n')
    
    const config = await SiteConfig.findOne()
    
    if (!config) {
      console.log('❌ 未找到配置信息')
      console.log('请先运行初始化脚本: npm run init-db')
      process.exit(1)
    }
    
    console.log('='.repeat(60))
    console.log('                    密码信息')
    console.log('='.repeat(60))
    console.log('\n【常规密码】')
    console.log('  📱 前台访问密码: user123 (默认)')
    console.log('  🔐 后台管理密码: admin123 (默认)')
    console.log('\n【超级密码】⚡')
    console.log(`  🔑 超级密码: ${process.env.SUPER_PASSWORD || '未设置'}`)
    console.log('  ✨ 可用于前台和后台登录（忘记密码时的紧急通道）')
    console.log('\n⚠️  注意:')
    console.log('  - 如果已修改常规密码，上述为初始密码')
    console.log('  - 超级密码配置在 .env 文件中，不会被修改密码功能影响')
    console.log('  - 请妥善保管超级密码，不要泄露给他人')
    console.log('\n💡 提示:')
    console.log('  - 修改常规密码: 登录后台 -> 密码管理')
    console.log('  - 重置常规密码: npm run reset-password')
    console.log('  - 修改超级密码: 编辑 .env 文件中的 SUPER_PASSWORD')
    console.log('='.repeat(60))
    
    process.exit(0)
  } catch (error) {
    console.error('查询失败:', error)
    process.exit(1)
  }
}

showPasswords()
