# 上传和拖拽问题修复说明

## 已修复的问题

### 1. 拖拽排序不工作 ✅

**问题原因：**
- 长按延迟时间太短（200ms）
- 缺少触摸事件优化配置
- 没有明确指定拖拽手柄

**修复方案：**
- 增加长按延迟到 500ms，更容易触发
- 添加 `handle: '.drag-handle'` 配置，只能通过 ☰ 图标拖动
- 添加 `touchStartThreshold: 5` 允许 5px 移动误差
- 添加震动反馈（支持的设备）
- 优化 CSS：添加 `touch-action: none` 防止滚动干扰

**使用方法：**
- 在相册管理或分类管理页面
- **长按左侧的 ☰ 图标 0.5 秒**
- 感受到震动后开始拖动
- 松手完成排序

### 2. 大图片上传失败 ✅

**问题原因：**
- 服务器限制 50MB
- 没有针对不同大小图片的压缩策略

**修复方案：**

#### 前端优化
- 智能压缩策略：
  - **< 5MB**: 不压缩，直接上传
  - **5-10MB**: 轻度压缩（质量 85%，最大 5MB）
  - **10-20MB**: 中等压缩（质量 80%，最大 8MB）
  - **> 20MB**: 激进压缩（质量 75%，最大 10MB）

#### 后端优化
- 增加文件大小限制到 100MB
- 增加请求体限制到 100MB
- 增加字段大小限制
- 上传超时设置为 10 分钟

#### API 配置
- 已设置 10 分钟超时
- 已设置 `maxContentLength: Infinity`
- 已设置 `maxBodyLength: Infinity`

## 如果使用 Nginx 部署

需要在 Nginx 配置中添加以下设置：

```nginx
server {
    # 增加客户端请求体大小限制
    client_max_body_size 100M;
    
    # 增加超时时间
    client_body_timeout 600s;
    proxy_read_timeout 600s;
    proxy_connect_timeout 600s;
    proxy_send_timeout 600s;
    
    location /api/admin/upload {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # 上传接口特殊配置
        client_max_body_size 100M;
        proxy_request_buffering off;
    }
}
```

## 如果使用宝塔面板

1. 进入网站设置
2. 找到"配置文件"
3. 添加上述 Nginx 配置
4. 保存并重启 Nginx

## 测试方法

### 测试拖拽排序
1. 进入后台管理 → 相册管理 或 分类管理
2. 长按左侧 ☰ 图标 0.5 秒
3. 感受震动反馈后拖动
4. 松手完成排序
5. 刷新页面验证排序是否保存

### 测试大图片上传
1. 准备一张 10-20MB 的图片
2. 进入后台管理 → 照片管理
3. 选择相册
4. 点击"选择照片上传"
5. 观察压缩进度（0-30%）
6. 观察上传进度（30-100%）
7. 验证图片是否成功上传

## 性能说明

- **压缩速度**: 使用 Web Worker，不阻塞 UI
- **压缩质量**: 根据原图大小自动调整
- **上传速度**: 取决于网络带宽
- **建议**: 单次上传不超过 10 张大图片

## 注意事项

1. 拖拽时必须长按 ☰ 图标，不能点击其他区域
2. 大图片会自动压缩，可能损失部分质量
3. 如果上传超时，请减少图片数量或检查网络
4. 移动设备上拖拽体验更好（有震动反馈）
