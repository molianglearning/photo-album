import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未授权访问' })
  }
  
  const token = authHeader.split(' ')[1]
  
  if (!token || token === 'null' || token === 'undefined') {
    return res.status(401).json({ message: '未授权访问' })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    console.error('Token验证失败:', error.message)
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token已过期，请重新登录' })
    }
    res.status(401).json({ message: 'Token无效，请重新登录' })
  }
}

export const adminAuthMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '需要管理员权限' })
    }
    next()
  })
}
