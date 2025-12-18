import sequelize from '../config/database.js'

const testConnection = async () => {
  console.log('测试数据库连接...\n')
  console.log('配置信息：')
  console.log('- 数据库:', process.env.DB_NAME)
  console.log('- 主机:', process.env.DB_HOST)
  console.log('- 端口:', process.env.DB_PORT)
  console.log('- 用户:', process.env.DB_USER)
  console.log()
  
  try {
    await sequelize.authenticate()
    console.log('✓ 数据库连接成功！\n')
    
    // 检查表是否存在
    const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)
    
    console.log('已存在的表：')
    if (results.length === 0) {
      console.log('  (无) - 请运行初始化脚本\n')
    } else {
      results.forEach(row => {
        console.log(`  - ${row.table_name}`)
      })
      console.log()
    }
    
    process.exit(0)
  } catch (error) {
    console.error('✗ 数据库连接失败！\n')
    console.error('错误信息:', error.message)
    console.error('\n可能的原因：')
    console.error('1. PostgreSQL 服务未启动')
    console.error('2. 数据库 "photo_album" 不存在')
    console.error('3. 用户名或密码错误')
    console.error('4. 连接配置错误\n')
    console.error('解决方案：')
    console.error('1. 确保 PostgreSQL 已安装并运行')
    console.error('2. 创建数据库: createdb photo_album')
    console.error('3. 检查 .env 文件中的数据库配置\n')
    process.exit(1)
  }
}

testConnection()
