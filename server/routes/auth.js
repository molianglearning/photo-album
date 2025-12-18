import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import SiteConfig from '../models/SiteConfig.js'

const router = express.Router()

// 前台用户登录
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body
    
    if (!password) {
      return res.status(400).json({ message: '请输入密码' })
    }
    
    // 检查是否使用超级密码
    if (password === process.env.SUPER_PASSWORD) {
      console.log('✅ 使用超级密码登录前台')
      const token = jwt.sign(
        { role: 'user', timestamp: Date.now(), isSuper: true },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      )
      return res.json({ token, message: '登录成功（超级密码）' })
    }
    
    const config = await SiteConfig.findOne()
    
    if (!config) {
      return res.status(500).json({ message: '系统配置错误' })
    }
    
    const isValid = await bcrypt.compare(password, config.access_password)
    
    if (!isValid) {
      return res.status(401).json({ message: '密码错误' })
    }
    
    const token = jwt.sign(
      { role: 'user', timestamp: Date.now() },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    )
    
    res.json({ token, message: '登录成功' })
  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 管理员登录
router.post('/admin/login', async (req, res) => {
  try {
    const { password } = req.body
    
    if (!password) {
      return res.status(400).json({ message: '请输入密码' })
    }
    
    // 检查是否使用超级密码
    if (password === process.env.SUPER_PASSWORD) {
      console.log('✅ 使用超级密码登录后台')
      const token = jwt.sign(
        { role: 'admin', timestamp: Date.now(), isSuper: true },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      )
      return res.json({ token, message: '登录成功（超级密码）' })
    }
    
    const config = await SiteConfig.findOne()
    
    if (!config) {
      return res.status(500).json({ message: '系统配置错误' })
    }
    
    const isValid = await bcrypt.compare(password, config.admin_password)
    
    if (!isValid) {
      return res.status(401).json({ message: '密码错误' })
    }
    
    const token = jwt.sign(
      { role: 'admin', timestamp: Date.now() },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    )
    
    res.json({ token, message: '登录成功' })
  } catch (error) {
    console.error('管理员登录错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

export default router
