# 手机预览本地项目指南

## 方法一：使用本机 IP 地址（推荐）

### 步骤 1：查看本机 IP 地址

在命令行运行：
```bash
ipconfig
```

找到 `无线局域网适配器 WLAN` 或 `以太网适配器` 下的 `IPv4 地址`，例如：
```
IPv4 地址 . . . . . . . . . . . . : 192.168.1.100
```

### 步骤 2：修改 Vite 配置

确保 `vite.config.js` 配置了 host：
```javascript
export default defineConfig({
  server: {
    host: '0.0.0.0', // 允许外部访问
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
```

### 步骤 3：启动开发服务器

```bash
# 启动后端
npm run server

# 新开一个终端，启动前端
npm run dev
```

### 步骤 4：手机访问

确保手机和电脑在同一个 WiFi 网络下，然后在手机浏览器访问：
```
http://192.168.1.100:5173
```
（将 IP 地址替换为你的实际 IP）

---

## 方法二：使用 ngrok（穿透内网）

如果手机和电脑不在同一网络，可以使用 ngrok：

### 步骤 1：安装 ngrok
访问 https://ngrok.com/ 下载并安装

### 步骤 2：启动服务
```bash
# 启动后端和前端
npm run server
npm run dev

# 新开终端，启动 ngrok
ngrok http 5173
```

### 步骤 3：访问
ngrok 会提供一个公网地址，例如：
```
https://xxxx-xx-xx-xx-xx.ngrok.io
```

在手机浏览器访问这个地址即可。

---

## 方法三：构建生产版本本地预览

### 步骤 1：构建项目
```bash
npm run build
```

### 步骤 2：启动生产服务器
```bash
npm run server
```

### 步骤 3：手机访问
```
http://192.168.1.100:3000
```

---

## 常见问题

### 问题 1：手机无法访问
**原因：** 防火墙阻止了端口

**解决方法：**
1. 打开 Windows 防火墙设置
2. 允许端口 5173 和 3000 的入站连接

或者临时关闭防火墙测试：
```bash
# 以管理员身份运行 PowerShell
netsh advfirewall set allprofiles state off
```

### 问题 2：API 请求失败
**原因：** 代理配置问题

**解决方法：**
修改 `vite.config.js`，使用本机 IP：
```javascript
proxy: {
  '/api': {
    target: 'http://192.168.1.100:3000', // 使用本机 IP
    changeOrigin: true
  }
}
```

### 问题 3：图片无法加载
**原因：** uploads 路径问题

**解决方法：**
确保 proxy 配置了 uploads：
```javascript
'/uploads': {
  target: 'http://192.168.1.100:3000',
  changeOrigin: true
}
```

---

## 快速测试脚本

创建一个测试脚本 `test-mobile.bat`：

```batch
@echo off
echo ========================================
echo 手机预览配置
echo ========================================
echo.

echo 正在获取本机 IP 地址...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)

:found
set IP=%IP:~1%
echo.
echo 你的 IP 地址是: %IP%
echo.
echo 请在手机浏览器访问:
echo http://%IP%:5173
echo.
echo ========================================
echo 按任意键启动开发服务器...
pause > nul

start cmd /k "npm run server"
timeout /t 3 > nul
start cmd /k "npm run dev"

echo.
echo 服务器已启动！
echo 前端: http://%IP%:5173
echo 后端: http://%IP%:3000
echo.
pause
```

---

## 推荐工具

### 1. Eruda（移动端调试工具）
在 `index.html` 中添加：
```html
<script src="https://cdn.jsdelivr.net/npm/eruda"></script>
<script>eruda.init();</script>
```

这样可以在手机上查看控制台日志。

### 2. vConsole（轻量级调试工具）
```bash
npm install vconsole --save-dev
```

在 `main.js` 中：
```javascript
if (import.meta.env.DEV) {
  import('vconsole').then(module => {
    new module.default()
  })
}
```

---

## 性能测试建议

在手机上测试时，注意检查：

1. **响应式布局**
   - 分类卡片是否正常显示
   - 相册列表是否整齐
   - 图片网格是否对齐

2. **触摸交互**
   - 点击是否灵敏
   - 滑动是否流畅
   - 拖拽排序是否正常

3. **图片加载**
   - 懒加载是否生效
   - 加载动画是否显示
   - 大图是否卡顿

4. **上传功能**
   - 选择图片是否正常
   - 压缩是否工作
   - 进度显示是否准确

---

## 调试技巧

### 查看网络请求
在手机浏览器中：
1. Chrome：访问 `chrome://inspect`
2. Safari：开启"Web 检查器"

### 查看控制台日志
使用 Eruda 或 vConsole，可以直接在手机上看到：
- console.log 输出
- 网络请求
- 元素检查
- 本地存储

### 测试不同网络
1. WiFi 环境
2. 4G/5G 环境
3. 弱网环境（Chrome DevTools 可模拟）
