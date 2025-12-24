# 大文件上传问题排查指南

## 已完成的优化

### 1. 前端配置 ✅
- API 超时：10秒 → 5分钟（300秒）
- 上传超时：默认 → 10分钟（600秒）
- 移除内容大小限制（maxContentLength/maxBodyLength: Infinity）

### 2. 后端配置 ✅
- Express body 限制：默认 → 50MB
- Multer 单文件限制：10MB → 50MB
- Multer 文件数量：默认 → 100个

### 3. 压缩优化 ✅
- 小文件阈值：2MB → 3MB（更多文件跳过压缩）
- 压缩目标：10MB → 15MB（更宽松）
- 压缩质量：90% → 85%（更激进）
- 增强错误处理和日志

### 4. 图片居中 ✅
- 灯箱图片垂直居中显示
- 保持左右铺满
- 支持上下滚动

## 测试步骤

### 测试 1：单张大图片（10-20MB）

1. 打开浏览器控制台（F12）
2. 选择一张 10-20MB 的图片
3. 观察控制台输出：
   ```
   文件名: 开始压缩 15.23MB...
   文件名: 压缩完成 15.23MB -> 8.45MB
   ```
4. 观察上传进度：0-30% 压缩，30-100% 上传
5. 检查是否成功

**预期结果：**
- 压缩时间：5-15秒
- 上传时间：10-30秒
- 总时间：< 1分钟

### 测试 2：批量中等图片（5-10张，每张5MB）

1. 选择 5-10 张图片
2. 观察每张图片的压缩日志
3. 观察总体上传进度
4. 检查是否全部成功

**预期结果：**
- 压缩时间：20-40秒
- 上传时间：30-60秒
- 总时间：< 2分钟

### 测试 3：极限测试（单张 30MB+）

1. 选择一张 30MB+ 的图片
2. 观察压缩效果
3. 观察上传时间
4. 检查是否成功

**预期结果：**
- 压缩后：< 15MB
- 上传时间：< 2分钟

## 常见错误和解决方法

### 错误 1：上传超时
```
上传超时，请检查网络或减少图片数量
```

**原因：**
- 网络速度太慢
- 图片太多或太大
- 服务器响应慢

**解决方法：**
1. 减少一次上传的图片数量（建议 < 20张）
2. 检查网络连接
3. 等待压缩完成后再上传

### 错误 2：文件太大
```
文件太大，请减少图片数量或大小
```

**原因：**
- 单个文件 > 50MB
- 总大小超过服务器限制

**解决方法：**
1. 单张图片建议 < 30MB
2. 批量上传建议总大小 < 200MB
3. 分批上传

### 错误 3：压缩失败
```
压缩 xxx.jpg 失败，将使用原文件上传
```

**原因：**
- 图片格式不支持
- 图片损坏
- 内存不足

**解决方法：**
1. 检查图片是否能正常打开
2. 尝试用其他工具重新保存图片
3. 关闭其他占用内存的程序

### 错误 4：网络错误
```
Network Error
```

**原因：**
- 网络断开
- 服务器未启动
- 防火墙阻止

**解决方法：**
1. 检查服务器是否运行
2. 检查网络连接
3. 检查防火墙设置

## 性能优化建议

### 1. 分批上传
```javascript
// 推荐：每次上传 10-20 张
// 不推荐：一次上传 50+ 张
```

### 2. 预先压缩
如果图片特别大（> 30MB），建议：
1. 使用专业工具预先压缩
2. 或者使用在线压缩工具
3. 然后再上传

### 3. 网络环境
- WiFi 优于 4G
- 有线网络优于 WiFi
- 避免在网络高峰期上传

### 4. 浏览器选择
推荐使用：
- Chrome（最佳）
- Edge（良好）
- Firefox（良好）
- Safari（一般）

## 调试技巧

### 1. 查看详细日志

打开浏览器控制台（F12），查看：

**压缩日志：**
```
文件名: 15.23MB - 跳过压缩
文件名: 开始压缩 25.67MB...
文件名: 压缩完成 25.67MB -> 12.34MB
```

**上传日志：**
```
上传失败: Error: timeout of 300000ms exceeded
错误详情: {...}
```

### 2. 网络面板

在控制台的 Network 标签：
1. 找到 `/api/admin/upload` 请求
2. 查看请求大小
3. 查看响应时间
4. 查看错误信息

### 3. 性能监控

在控制台的 Performance 标签：
1. 开始录制
2. 上传图片
3. 停止录制
4. 查看压缩和上传的时间分布

## 服务器端检查

### 1. 检查 uploads 目录权限
```bash
# Windows
icacls server/uploads
```

### 2. 检查磁盘空间
```bash
# Windows
dir server/uploads
```

### 3. 检查服务器日志
查看服务器控制台输出，看是否有错误信息

## 配置文件检查清单

### ✅ server/app.js
```javascript
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
```

### ✅ server/routes/admin.js
```javascript
const upload = multer({
  storage,
  limits: { 
    fileSize: 50 * 1024 * 1024,
    files: 100
  }
})
```

### ✅ src/api/index.js
```javascript
const api = axios.create({
  baseURL: '/api',
  timeout: 300000 // 5分钟
})

uploadPhotos(formData, onProgress) {
  return api.post('/admin/upload', formData, {
    timeout: 600000, // 10分钟
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  })
}
```

### ✅ src/views/admin/PhotoManage.vue
```javascript
const options = {
  maxSizeMB: 15,
  maxWidthOrHeight: 4096,
  initialQuality: 0.85
}
```

## 如果还是失败

### 方案 1：降低压缩质量
修改 `PhotoManage.vue`：
```javascript
const options = {
  maxSizeMB: 10, // 降低到 10MB
  maxWidthOrHeight: 3072, // 降低分辨率
  initialQuality: 0.75 // 降低质量到 75%
}
```

### 方案 2：增加超时时间
修改 `src/api/index.js`：
```javascript
uploadPhotos(formData, onProgress) {
  return api.post('/admin/upload', formData, {
    timeout: 1800000, // 30分钟
    // ...
  })
}
```

### 方案 3：使用分片上传
这需要更复杂的实现，但可以支持超大文件：
1. 将文件分成多个小块
2. 逐个上传
3. 服务器端合并

## 联系支持

如果以上方法都无法解决，请提供：
1. 图片大小和数量
2. 浏览器控制台的完整错误信息
3. 服务器控制台的日志
4. 网络环境（WiFi/4G/5G）
5. 操作系统和浏览器版本
