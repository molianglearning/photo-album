# 拖拽排序功能测试指南

## 功能说明

后台管理的分类和相册列表支持拖拽排序功能。

## 如何使用

### 1. 分类管理拖拽排序

1. 登录后台：`/admin/login`
2. 进入分类管理
3. 找到每个分类项左侧的 **☰** 图标（拖拽手柄）
4. 按住 **☰** 图标不放
5. 上下拖动到目标位置
6. 松开鼠标
7. 排序自动保存到服务器

### 2. 相册管理拖拽排序

1. 登录后台：`/admin/login`
2. 进入相册管理
3. 找到每个相册项左侧的 **☰** 图标
4. 按住 **☰** 图标不放
5. 上下拖动到目标位置
6. 松开鼠标
7. 排序自动保存到服务器

## 视觉效果

### 拖拽手柄
- 位置：每个列表项的最左侧
- 图标：☰（三条横线）
- 颜色：灰色 (#999)
- 鼠标悬停：变成抓手图标

### 拖拽中
- 被拖拽的项：半透明（opacity: 0.4）
- 背景：浅灰色 (#f0f0f0)
- 动画：150ms 平滑过渡

### 拖拽后
- 自动保存到服务器
- 前台页面立即生效
- 失败时自动回滚并提示

## 故障排查

### 问题 1：看不到拖拽手柄（☰）

**可能原因：**
- 浏览器缓存
- 代码未更新

**解决方法：**
1. 硬刷新页面：`Ctrl + Shift + R`（Windows）或 `Cmd + Shift + R`（Mac）
2. 清除浏览器缓存
3. 重启开发服务器：
   ```bash
   # 停止服务器（Ctrl+C）
   # 重新启动
   npm run dev
   ```

### 问题 2：拖拽手柄存在但无法拖动

**检查步骤：**

1. **检查 Sortable.js 是否安装**
   ```bash
   npm list sortablejs
   ```
   
   如果未安装：
   ```bash
   npm install sortablejs --save
   ```

2. **检查浏览器控制台**
   - 打开控制台（F12）
   - 查看是否有错误信息
   - 特别注意 Sortable 相关的错误

3. **检查网络请求**
   - 拖拽后查看 Network 标签
   - 应该有 `/api/admin/categories/sort` 或 `/api/admin/albums/sort` 请求
   - 检查请求是否成功（状态码 200）

### 问题 3：拖拽后排序没有保存

**检查步骤：**

1. **查看控制台日志**
   ```
   更新排序失败: Error: ...
   ```

2. **检查后端 API**
   - 确认服务器正在运行
   - 检查 `server/routes/admin.js` 中的排序 API

3. **检查数据库**
   - 确认 `sort_order` 字段存在
   - 检查数据是否更新

### 问题 4：拖拽卡顿或不流畅

**优化方法：**

1. **减少列表项数量**
   - 如果有很多分类/相册，可能会影响性能

2. **关闭其他标签页**
   - 释放浏览器内存

3. **使用更快的浏览器**
   - Chrome 性能最佳
   - Edge 次之

## 代码验证

### 检查分类管理代码

打开 `src/views/admin/CategoryManage.vue`，确认以下内容：

1. **导入 Sortable**
   ```javascript
   import Sortable from 'sortablejs'
   ```

2. **拖拽手柄在模板中**
   ```vue
   <div class="drag-handle">☰</div>
   ```

3. **initSortable 函数存在**
   ```javascript
   const initSortable = () => {
     sortableInstance = Sortable.create(el, {
       animation: 150,
       handle: '.drag-handle',
       // ...
     })
   }
   ```

4. **在 loadCategories 中调用**
   ```javascript
   await nextTick()
   initSortable()
   ```

### 检查相册管理代码

打开 `src/views/admin/AlbumManage.vue`，确认相同的内容。

### 检查后端 API

打开 `server/routes/admin.js`，确认排序 API 存在：

```javascript
// 更新分类排序
router.post('/admin/categories/sort', adminAuthMiddleware, async (req, res) => {
  try {
    const { orders } = req.body
    // ...
  }
})

// 更新相册排序
router.post('/admin/albums/sort', adminAuthMiddleware, async (req, res) => {
  try {
    const { orders } = req.body
    // ...
  }
})
```

## 测试步骤

### 完整测试流程

1. **准备测试数据**
   - 创建至少 3 个分类
   - 每个分类下创建至少 2 个相册

2. **测试分类排序**
   - 进入分类管理
   - 拖动第一个分类到最后
   - 刷新页面，检查顺序是否保持
   - 访问前台，检查分类顺序是否更新

3. **测试相册排序**
   - 进入相册管理
   - 拖动第一个相册到最后
   - 刷新页面，检查顺序是否保持
   - 访问前台对应分类，检查相册顺序是否更新

4. **测试错误处理**
   - 停止后端服务器
   - 尝试拖拽排序
   - 应该看到"更新排序失败"提示
   - 列表应该自动回滚到原来的顺序

## 样式检查

### CSS 样式应该包含

```css
.drag-handle {
  font-size: 20px;
  color: #999;
  cursor: grab;
  user-select: none;
  padding: 4px;
}

.drag-handle:active {
  cursor: grabbing;
}

.sortable-ghost {
  opacity: 0.4;
  background: #f0f0f0;
}

.list-item {
  cursor: move;
  transition: background 0.2s;
}

.list-item:hover {
  background: #fafafa;
}
```

## 浏览器兼容性

| 浏览器 | 版本 | 支持情况 |
|--------|------|---------|
| Chrome | 60+ | ✅ 完全支持 |
| Edge | 79+ | ✅ 完全支持 |
| Firefox | 55+ | ✅ 完全支持 |
| Safari | 11+ | ✅ 完全支持 |
| IE | 11 | ⚠️ 部分支持 |

## 移动端测试

在手机上测试拖拽排序：

1. **触摸拖拽**
   - 长按拖拽手柄
   - 上下移动
   - 松开手指

2. **注意事项**
   - 移动端拖拽可能不如桌面端流畅
   - 建议在桌面端进行排序操作
   - 移动端主要用于查看和内容管理

## 快速修复脚本

如果拖拽功能完全不工作，运行以下命令：

```bash
# 1. 重新安装依赖
npm install sortablejs --save

# 2. 清除缓存
npm cache clean --force

# 3. 重新安装所有依赖
rm -rf node_modules
npm install

# 4. 重启开发服务器
npm run dev
```

## 调试技巧

### 1. 添加调试日志

在 `initSortable` 函数中添加：

```javascript
const initSortable = () => {
  console.log('初始化拖拽排序...')
  
  const el = document.querySelector('.list')
  console.log('找到列表元素:', el)
  
  if (!el) {
    console.error('未找到 .list 元素')
    return
  }
  
  sortableInstance = Sortable.create(el, {
    // ...
    onEnd: async (evt) => {
      console.log('拖拽结束:', evt.oldIndex, '->', evt.newIndex)
      // ...
    }
  })
  
  console.log('拖拽排序初始化完成')
}
```

### 2. 检查元素

在浏览器控制台运行：

```javascript
// 检查 Sortable 是否加载
console.log(window.Sortable)

// 检查列表元素
console.log(document.querySelector('.list'))

// 检查拖拽手柄
console.log(document.querySelectorAll('.drag-handle'))
```

### 3. 手动测试 API

在控制台运行：

```javascript
// 测试排序 API
fetch('/api/admin/categories/sort', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
  },
  body: JSON.stringify({
    orders: [
      { id: 1, sort_order: 0 },
      { id: 2, sort_order: 1 }
    ]
  })
})
.then(res => res.json())
.then(data => console.log(data))
```

## 总结

拖拽排序功能已经完整实现，包括：

- ✅ 前端拖拽交互（Sortable.js）
- ✅ 视觉反馈（拖拽手柄、动画效果）
- ✅ 后端 API（保存排序）
- ✅ 错误处理（失败回滚）
- ✅ 前台同步（排序立即生效）

如果功能不工作，请按照本文档的故障排查步骤逐一检查。
