import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt'
import { adminAuthMiddleware } from '../middleware/auth.js'
import SiteConfig from '../models/SiteConfig.js'
import Category from '../models/Category.js'
import Album from '../models/Album.js'
import Photo from '../models/Photo.js'
import { Op } from 'sequelize'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

import fs from 'fs'

// 确保 uploads 目录存在
const uploadsDir = path.join(__dirname, '../uploads/')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
  console.log('创建 uploads 目录:', uploadsDir)
}

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 再次确保目录存在
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    // 处理中文文件名
    const ext = path.extname(file.originalname) || '.jpg'
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext
    cb(null, uniqueName)
  }
})

const upload = multer({
  storage,
  limits: { 
    fileSize: 100 * 1024 * 1024, // 单个文件最大 100MB（前端会压缩）
    files: 100, // 最多 100 个文件
    fieldSize: 100 * 1024 * 1024 // 字段大小限制
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('只允许上传图片文件'))
    }
  }
})

// 获取统计信息
router.get('/admin/stats', adminAuthMiddleware, async (req, res) => {
  try {
    const categories = await Category.count()
    const albums = await Album.count()
    const photos = await Photo.count()
    
    res.json({
      data: { categories, albums, photos }
    })
  } catch (error) {
    console.error('获取统计错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 站点设置
router.get('/admin/settings', adminAuthMiddleware, async (req, res) => {
  try {
    const config = await SiteConfig.findOne()
    
    if (!config) {
      return res.status(404).json({ message: '配置不存在' })
    }
    
    res.json({
      data: {
        site_title: config.site_title,
        site_description: config.site_description
      }
    })
  } catch (error) {
    console.error('获取设置错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.put('/admin/settings', adminAuthMiddleware, async (req, res) => {
  try {
    const { site_title, site_description } = req.body
    
    const config = await SiteConfig.findOne()
    
    if (!config) {
      return res.status(404).json({ message: '配置不存在' })
    }
    
    await config.update({ site_title, site_description })
    
    res.json({ message: '保存成功' })
  } catch (error) {
    console.error('更新设置错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 修改密码
router.post('/admin/change-password', adminAuthMiddleware, async (req, res) => {
  try {
    const { type, old_password, new_password } = req.body
    
    if (!type || !old_password || !new_password) {
      return res.status(400).json({ message: '参数不完整' })
    }
    
    const config = await SiteConfig.findOne()
    
    if (!config) {
      return res.status(404).json({ message: '配置不存在' })
    }
    
    // 验证旧密码
    const passwordField = type === 'access' ? 'access_password' : 'admin_password'
    const isValid = await bcrypt.compare(old_password, config[passwordField])
    
    if (!isValid) {
      return res.status(401).json({ message: '旧密码错误' })
    }
    
    // 更新密码
    const hashedPassword = await bcrypt.hash(new_password, 10)
    await config.update({ [passwordField]: hashedPassword })
    
    res.json({ message: '密码修改成功' })
  } catch (error) {
    console.error('修改密码错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 分类管理
router.get('/admin/categories', adminAuthMiddleware, async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['sort_order', 'ASC'], ['id', 'ASC']]
    })
    
    res.json({ data: categories })
  } catch (error) {
    console.error('获取分类错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.post('/admin/categories', adminAuthMiddleware, async (req, res) => {
  try {
    const { name, description, cover_image } = req.body
    
    if (!name) {
      return res.status(400).json({ message: '分类名称不能为空' })
    }
    
    const maxOrder = await Category.max('sort_order') || 0
    
    const category = await Category.create({
      name,
      description,
      cover_image,
      sort_order: maxOrder + 1
    })
    
    res.json({ data: category, message: '创建成功' })
  } catch (error) {
    console.error('创建分类错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.put('/admin/categories/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, cover_image } = req.body
    
    if (!name) {
      return res.status(400).json({ message: '分类名称不能为空' })
    }
    
    const category = await Category.findByPk(id)
    
    if (!category) {
      return res.status(404).json({ message: '分类不存在' })
    }
    
    await category.update({ name, description, cover_image })
    
    res.json({ data: category, message: '更新成功' })
  } catch (error) {
    console.error('更新分类错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.delete('/admin/categories/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    
    const category = await Category.findByPk(id)
    
    if (!category) {
      return res.status(404).json({ message: '分类不存在' })
    }
    
    await category.destroy()
    
    res.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除分类错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 更新分类排序
router.post('/admin/categories/sort', adminAuthMiddleware, async (req, res) => {
  try {
    const { orders } = req.body
    
    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ message: '参数错误' })
    }
    
    // 批量更新排序
    await Promise.all(
      orders.map(item => 
        Category.update(
          { sort_order: item.sort_order },
          { where: { id: item.id } }
        )
      )
    )
    
    res.json({ message: '排序更新成功' })
  } catch (error) {
    console.error('更新分类排序错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 相册管理
router.get('/admin/albums', adminAuthMiddleware, async (req, res) => {
  try {
    const albums = await Album.findAll({
      order: [['sort_order', 'ASC'], ['id', 'ASC']]
    })
    
    // 获取每个相册的照片数量
    const albumsWithCount = await Promise.all(
      albums.map(async (album) => {
        const photoCount = await Photo.count({ where: { album_id: album.id } })
        return {
          ...album.toJSON(),
          photo_count: photoCount
        }
      })
    )
    
    console.log('=== 获取相册列表 ===')
    console.log('相册数量:', albumsWithCount.length)
    
    res.json({ data: albumsWithCount })
  } catch (error) {
    console.error('获取相册错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.post('/admin/albums', adminAuthMiddleware, async (req, res) => {
  try {
    const { name, category_id, description, cover_image } = req.body
    
    if (!name || !category_id) {
      return res.status(400).json({ message: '相册名称和分类不能为空' })
    }
    
    const maxOrder = await Album.max('sort_order', {
      where: { category_id }
    }) || 0
    
    const album = await Album.create({
      name,
      category_id,
      description,
      cover_image,
      sort_order: maxOrder + 1
    })
    
    res.json({ data: album, message: '创建成功' })
  } catch (error) {
    console.error('创建相册错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.put('/admin/albums/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { name, category_id, description, cover_image } = req.body
    
    console.log('=== 更新相册请求 ===')
    console.log('相册ID:', id)
    console.log('请求数据:', { name, category_id, description, cover_image })
    
    if (!name || !category_id) {
      return res.status(400).json({ message: '相册名称和分类不能为空' })
    }
    
    const album = await Album.findByPk(id)
    
    if (!album) {
      return res.status(404).json({ message: '相册不存在' })
    }
    
    console.log('更新前的相册数据:', album.toJSON())
    
    await album.update({ name, category_id, description, cover_image })
    
    console.log('更新后的相册数据:', album.toJSON())
    
    res.json({ data: album, message: '更新成功' })
  } catch (error) {
    console.error('更新相册错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.delete('/admin/albums/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    
    const album = await Album.findByPk(id)
    
    if (!album) {
      return res.status(404).json({ message: '相册不存在' })
    }
    
    await album.destroy()
    
    res.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除相册错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 更新相册排序
router.post('/admin/albums/sort', adminAuthMiddleware, async (req, res) => {
  try {
    const { orders } = req.body
    
    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ message: '参数错误' })
    }
    
    // 批量更新排序
    await Promise.all(
      orders.map(item => 
        Album.update(
          { sort_order: item.sort_order },
          { where: { id: item.id } }
        )
      )
    )
    
    res.json({ message: '排序更新成功' })
  } catch (error) {
    console.error('更新相册排序错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 照片管理
router.get('/admin/photos', adminAuthMiddleware, async (req, res) => {
  try {
    const { album_id } = req.query
    
    if (!album_id) {
      return res.status(400).json({ message: '缺少相册ID' })
    }
    
    const photos = await Photo.findAll({
      where: { album_id },
      order: [['sort_order', 'ASC'], ['id', 'ASC']]
    })
    
    res.json({ data: photos })
  } catch (error) {
    console.error('获取照片错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.post('/admin/upload', adminAuthMiddleware, (req, res, next) => {
  // 使用 multer 中间件并捕获错误
  upload.array('photos', 50)(req, res, (err) => {
    if (err) {
      console.error('=== Multer 上传错误 ===')
      console.error('错误类型:', err.name)
      console.error('错误信息:', err.message)
      console.error('错误代码:', err.code)
      
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: '文件太大，单个文件不能超过 100MB' })
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ message: '文件数量超过限制（最多50个）' })
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ message: '文件字段名错误' })
      }
      return res.status(500).json({ message: '文件上传失败: ' + err.message })
    }
    next()
  })
}, async (req, res) => {
  try {
    console.log('=== 开始处理上传 ===')
    console.log('请求体:', req.body)
    console.log('文件数量:', req.files?.length || 0)
    
    const { album_id } = req.body
    
    if (!album_id) {
      console.error('错误: 缺少相册ID')
      return res.status(400).json({ message: '缺少相册ID' })
    }
    
    if (!req.files || req.files.length === 0) {
      console.error('错误: 没有上传文件')
      return res.status(400).json({ message: '没有上传文件' })
    }
    
    console.log('相册ID:', album_id)
    console.log('上传文件列表:')
    req.files.forEach((file, i) => {
      console.log(`  ${i + 1}. ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)}MB)`)
    })
    
    const maxOrder = await Photo.max('sort_order', {
      where: { album_id }
    }) || 0
    
    console.log('当前最大排序:', maxOrder)
    
    const photos = await Promise.all(
      req.files.map((file, index) => 
        Photo.create({
          album_id,
          file_name: file.filename,
          original_name: file.originalname,
          file_size: file.size,
          sort_order: maxOrder + index + 1
        })
      )
    )
    
    console.log('上传成功，创建了', photos.length, '条记录')
    res.json({ data: photos, message: '上传成功' })
  } catch (error) {
    console.error('=== 数据库保存错误 ===')
    console.error('错误类型:', error.name)
    console.error('错误信息:', error.message)
    console.error('错误堆栈:', error.stack)
    res.status(500).json({ message: '保存失败: ' + error.message })
  }
})

// 上传封面图片
router.post('/admin/upload-cover', adminAuthMiddleware, upload.single('cover'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '没有上传文件' })
    }
    
    res.json({ 
      data: { 
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`
      }, 
      message: '上传成功' 
    })
  } catch (error) {
    console.error('上传封面错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.delete('/admin/photos', adminAuthMiddleware, async (req, res) => {
  try {
    const { ids } = req.body
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: '参数错误' })
    }
    
    await Photo.destroy({
      where: {
        id: {
          [Op.in]: ids
        }
      }
    })
    
    res.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除照片错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 更新照片排序
router.post('/admin/photos/sort', adminAuthMiddleware, async (req, res) => {
  try {
    const { orders } = req.body
    
    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ message: '参数错误' })
    }
    
    // 批量更新排序
    await Promise.all(
      orders.map(item => 
        Photo.update(
          { sort_order: item.sort_order },
          { where: { id: item.id } }
        )
      )
    )
    
    res.json({ message: '排序更新成功' })
  } catch (error) {
    console.error('更新照片排序错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

export default router
