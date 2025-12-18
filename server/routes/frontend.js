import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import Category from '../models/Category.js'
import Album from '../models/Album.js'
import Photo from '../models/Photo.js'
import SiteConfig from '../models/SiteConfig.js'

const router = express.Router()

// 获取站点配置（公开接口，用于显示标题和描述，不需要认证）
router.get('/site-config', async (req, res) => {
  try {
    const config = await SiteConfig.findOne()
    
    if (!config) {
      return res.json({ 
        data: { 
          site_title: '', 
          site_description: '' 
        } 
      })
    }
    
    res.json({ 
      data: {
        site_title: config.site_title,
        site_description: config.site_description
      }
    })
  } catch (error) {
    console.error('获取站点配置错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 获取所有分类
router.get('/categories', authMiddleware, async (req, res) => {
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

// 获取单个分类信息
router.get('/categories/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    
    const category = await Category.findByPk(id)
    
    if (!category) {
      return res.status(404).json({ message: '分类不存在' })
    }
    
    res.json({ data: category })
  } catch (error) {
    console.error('获取分类信息错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 获取分类下的相册
router.get('/albums', authMiddleware, async (req, res) => {
  try {
    const { category_id } = req.query
    
    if (!category_id) {
      return res.status(400).json({ message: '缺少分类ID' })
    }
    
    const albums = await Album.findAll({
      where: { category_id },
      order: [['sort_order', 'ASC'], ['id', 'ASC']]
    })
    
    res.json({ data: albums })
  } catch (error) {
    console.error('获取相册错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 获取单个相册信息
router.get('/albums/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    
    const album = await Album.findByPk(id)
    
    if (!album) {
      return res.status(404).json({ message: '相册不存在' })
    }
    
    res.json({ data: album })
  } catch (error) {
    console.error('获取相册信息错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 获取相册内的照片
router.get('/photos', authMiddleware, async (req, res) => {
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

export default router
