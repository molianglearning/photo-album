# 密码快速参考

## 📋 默认密码

| 类型 | 密码 | 用途 |
|------|------|------|
| 前台访问 | `user123` | 普通用户浏览相册 |
| 后台管理 | `admin123` | 管理员后台管理 |
| 超级密码 | `SuperAdmin@2024` | 紧急访问通道（前台+后台） |

## 🔍 查看密码

```bash
npm run show-passwords
```

## 🔄 重置密码

重置前台和后台密码为默认值：
```bash
npm run reset-password
```

## ✏️ 修改密码

### 修改常规密码（前台/后台）
1. 访问: http://your-domain/admin
2. 使用后台密码登录
3. 进入"密码管理"页面
4. 分别修改前台和后台密码

### 修改超级密码
编辑 `.env` 文件：
```env
SUPER_PASSWORD=你的新密码
```
然后重启服务器。

## 🆘 忘记密码？

### 情况 1: 忘记前台或后台密码
**方案 A**: 使用超级密码登录
- 直接使用 `SuperAdmin@2024` 登录

**方案 B**: 重置为默认密码
```bash
npm run reset-password
```

### 情况 2: 忘记超级密码
查看 `.env` 文件中的 `SUPER_PASSWORD` 配置：
```bash
# Windows
type .env | findstr SUPER_PASSWORD

# Linux/Mac
grep SUPER_PASSWORD .env
```

## ⚠️ 安全提示

1. **部署后立即修改所有默认密码**
2. **超级密码要设置得足够复杂**
3. **不要将 .env 文件提交到 Git**
4. **定期更换密码（建议 3-6 个月）**
5. **妥善保管密码，不要泄露**

## 📞 需要帮助？

查看完整安全文档: [SECURITY.md](./SECURITY.md)
