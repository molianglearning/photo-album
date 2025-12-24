# 快速修复指南

## 已修复的问题

### 1. ✅ 上传500错误 - 增强错误日志

**修改文件：** `server/routes/admin.js`

**改进：**
- 添加详细的控制台日志
- 显示上传的文件信息
- 显示具体的错误信息和堆栈
- 开发环境返回详细错误

**如何查看错误：**
1. 打开服务器控制台（运行 `npm run server` 的窗口）
2. 尝试上传图片
3. 查看控制台输出的详细错误信息

**常见500错误原因：**

#### 错误1：数据库连接失败
```
错误信息: Connection refused
```
**解决：** 检查数据库是否正常运行

#### 错误2：album_id 类型错误
```
错误信息: invalid input syntax for type integer
```
**解决：** 确保选择了相册

#### 错误3：文件系统权限
```
错误信息: EACCES: permission denied
```
**解决：** 检查 `server/uploads/` 目录权限

#### 错误4：磁盘空间不足
```
错误信息: ENOSPC: no space left on device
```
**解决：** 清理磁盘空间

### 2. ✅ 拖拽体验优化

**修改文件：**
- `src/views/admin/CategoryManage.vue`
- `src/views/admin/AlbumManage.vue`

**改进：**

#### 整个列表项都可拖拽
- ❌ 之前：只能拖拽小图标（☰）
- ✅ 现在：点击列表项任意位置都可以拖拽

#### 更大的拖拽手柄
- 图标大小：20px → 24px
- 点击区域：更大（40px 最小宽度）
- 内边距：4px → 8px

#### 更好的视觉反馈
- **选中状态**：浅灰背景 + 阴影
- **拖拽中**：蓝色虚线边框 + 半透明
- **拖拽预览**：白色背景 + 深阴影
- **动画时间**：150ms → 200ms（更流畅）

#### 强制回退模式
- 启用 `forceFallback: true`
- 在所有浏览器中表现一致
- 移动端体验更好

## 测试步骤

### 测试上传功能

1. **重启服务器**（重要！）
   ```bash
   # 停止服务器（Ctrl+C）
   # 重新启动
   npm run server
   ```

2. **打开服务器控制台**
   - 保持服务器控制台可见
   - 准备查看日志

3. **尝试上传**
   - 选择一张图片
   - 点击上传
   - 观察服务器控制台输出

4. **查看日志**
   ```
   === 开始上传照片 ===
   请求体: { album_id: '1' }
   文件数量: 1
   相册ID: 1
   上传文件列表:
     1. test.jpg (2.34MB)
   当前最大排序: 0
   上传成功，创建了 1 条记录
   ```

5. **如果失败**
   - 查看错误类型和信息
   - 根据错误信息排查

### 测试拖拽功能

1. **重启前端**（重要！）
   ```bash
   # 停止前端（Ctrl+C）
   # 重新启动
   npm run dev
   ```

2. **硬刷新浏览器**
   - 按 `Ctrl + Shift + R`

3. **进入分类管理**
   - 应该看到列表项

4. **测试拖拽**
   - 方法1：点击 ☰ 图标拖拽
   - 方法2：点击列表项任意位置拖拽
   - 方法3：点击文字部分拖拽

5. **观察视觉效果**
   - 选中时：浅灰背景
   - 拖拽时：蓝色虚线边框
   - 移动时：白色卡片跟随鼠标

## 常见问题

### Q1: 上传还是500错误

**步骤1：查看服务器日志**
```
=== 上传照片错误 ===
错误类型: SequelizeDatabaseError
错误信息: ...
```

**步骤2：根据错误类型处理**

如果是数据库错误：
```bash
# 重新同步数据库
# 停止服务器，删除数据库文件，重新启动
```

如果是文件系统错误：
```bash
# 检查 uploads 目录
dir server\uploads

# 如果不存在，创建它
mkdir server\uploads
```

### Q2: 拖拽还是不流畅

**尝试以下方法：**

1. **清除浏览器缓存**
   ```
   Ctrl + Shift + Delete
   ```

2. **检查控制台错误**
   - F12 打开控制台
   - 查看是否有 JavaScript 错误

3. **降低动画时间**
   修改代码：
   ```javascript
   animation: 100, // 从 200 改为 100
   ```

4. **禁用其他扩展**
   - 某些浏览器扩展可能影响拖拽

### Q3: 拖拽后排序没保存

**检查网络请求：**

1. 打开 Network 标签
2. 拖拽一个项目
3. 查找 `/api/admin/categories/sort` 请求
4. 检查请求状态和响应

**如果请求失败：**
- 检查是否登录
- 检查 token 是否有效
- 检查服务器是否运行

## 调试命令

### 查看上传目录
```bash
dir server\uploads
```

### 查看数据库文件
```bash
dir server\database.sqlite
```

### 测试API（在浏览器控制台）
```javascript
// 测试上传API
const formData = new FormData()
formData.append('album_id', '1')
formData.append('photos', document.querySelector('input[type=file]').files[0])

fetch('/api/admin/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
  },
  body: formData
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err))
```

## 性能优化建议

### 上传优化
1. 单次上传不超过 20 张图片
2. 每张图片建议 < 20MB
3. 使用 WiFi 而非移动网络
4. 关闭其他占用带宽的程序

### 拖拽优化
1. 列表项不超过 50 个
2. 关闭浏览器动画（如果卡顿）
3. 使用 Chrome 浏览器（性能最佳）

## 完整重启流程

如果问题持续存在，完整重启：

```bash
# 1. 停止所有服务
# 按 Ctrl+C 停止前端和后端

# 2. 清除缓存
npm cache clean --force

# 3. 重新安装依赖（可选）
# rmdir /s /q node_modules
# npm install

# 4. 重启服务
# 终端1
npm run server

# 终端2
npm run dev

# 5. 浏览器硬刷新
# Ctrl + Shift + R
```

## 联系支持

如果以上方法都无法解决，请提供：

### 上传问题
1. 服务器控制台的完整错误日志
2. 浏览器控制台的错误信息
3. 图片大小和格式
4. 操作系统和浏览器版本

### 拖拽问题
1. 浏览器控制台的错误信息
2. 是否能看到 ☰ 图标
3. 点击后的具体表现
4. 浏览器和操作系统版本
