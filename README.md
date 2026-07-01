# SkillNest 简易技能巢

> 博物馆式个人 Skill 作品集站 — 暖大地色系 · 五Tab详情页 · 规则引擎 · 心愿墙

基于业务需求书 v1.6 与技术设计文档 v1.6 完整开发。前端保留原有 Vite + React 19 + Tailwind 4 暖大地色系原型，后端使用 Node.js/Express + node:sqlite 实现全量 API。

## 技术栈

| 层 | 技术 | 说明 |
|---|---|---|
| 前端 | Vite 6 + React 19 + Tailwind CSS 4 | 暖大地色系设计系统 |
| 图标 | lucide-react | 统一图标库 |
| 动画 | motion (framer-motion) | 弹窗滑入/骨架屏/Toast |
| Markdown | react-markdown (轻量实现) | 博物 Tab SKILL.md 渲染 |
| 后端 | Node.js + Express 4 | RESTful API |
| 数据库 | node:sqlite (SQLite WAL) | 零外部依赖，Node v24 内置 |
| 密码 | node:crypto scryptSync | 替代 bcrypt，无额外依赖 |

## 快速启动

### 环境要求

- Node.js v22+ (推荐 v24，内置 `node:sqlite`)

### 步骤

```bash
# 1. 安装依赖
npm install

# 2. 初始化数据库并导入种子数据
npm run seed

# 3. 启动后端 API 服务 (端口 3001)
npm run server

# 4. 启动前端开发服务器 (端口 3000)
npm run dev
```

打开浏览器访问 http://localhost:3000

> Vite 已配置 `/api` 代理到 `http://localhost:3001`，前后端联调无需额外配置。

### 默认管理员凭据

用户名: `admin`  
密码: `admin123`

## npm 脚本

| 命令 | 说明 |
|---|---|
| `npm run dev` | 启动前端开发服务器 (端口 3000) |
| `npm run server` | 启动后端 API 服务 (端口 3001) |
| `npm run seed` | 初始化数据库 + 导入种子数据 |
| `npm run build` | 构建前端生产包 |
| `npm run lint` | TypeScript 类型检查 (tsc --noEmit) |

## 项目结构

```
skillnest/
├── src/                        # 前端源码
│   ├── App.tsx                 # 主应用 (路由/状态/页面)
│   ├── types.ts                # TypeScript 类型定义
│   ├── data.ts                 # 初始 fallback 数据
│   ├── index.css               # Tailwind 4 配置 + 设计 token
│   ├── env.d.ts                # 类型声明 (模块 stub)
│   ├── lib/
│   │   └── api.ts              # API 客户端封装
│   └── components/
│       ├── Navbar.tsx          # 顶部导航
│       ├── Footer.tsx          # 底部导航
│       ├── PageState.tsx       # 空/错/加载状态组件
│       ├── Toast.tsx           # 全局 Toast 通知
│       ├── MuseumTab.tsx       # 博物 Tab (Markdown 渲染)
│       ├── VersionTab.tsx      # 版本 Tab (Diff 视图)
│       ├── CommentTab.tsx      # 留言 Tab
│       ├── FileTab.tsx         # 文件 Tab (下载)
│       ├── RuleTab.tsx         # 规则 Tab
│       ├── WishWall.tsx        # 心愿墙
│       └── AdminPanel.tsx      # 管理后台
├── server/                     # 后端源码
│   ├── index.js                # Express 入口 (端口 3001)
│   ├── db.js                   # SQLite schema + 连接
│   ├── seed.js                 # 种子数据导入
│   ├── lib/
│   │   └── utils.js            # 工具函数 (密码/Diff/文件类型/敏感词)
│   ├── middleware/
│   │   └── auth.js             # 管理员鉴权中间件
│   └── routes/
│       ├── skills.js           # 技能 CRUD + 列表/详情
│       ├── versions.js         # 版本管理
│       ├── comments.js         # 留言 (敏感词+频率限制)
│       ├── wishes.js           # 心愿墙 (匿名)
│       ├── rules.js            # 规则引擎 + 扫描
│       ├── files.js            # 文件下载 (24h去重)
│       └── admin.js            # 管理员认证 + 统计
├── data/                       # SQLite 数据库文件 (自动创建)
│   └── skillnest.db
├── vite.config.ts              # Vite 配置 (含 /api 代理)
├── tsconfig.json               # TypeScript 配置
└── package.json
```

## API 接口

### 公开接口

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/health` | 健康检查 |
| GET | `/api/skills` | 技能列表 (搜索/分类/分页) |
| GET | `/api/skills/featured` | 精选技能 |
| GET | `/api/skills/categories` | 分类列表 |
| GET | `/api/skills/:id` | 技能详情 (含版本/留言/文件/Diff) |
| GET | `/api/skills/:skillId/versions` | 版本列表 |
| GET | `/api/skills/:skillId/comments` | 留言列表 |
| POST | `/api/skills/:skillId/comments` | 发布留言 (敏感词+30s频率限制) |
| GET | `/api/skills/:skillId/files` | 文件列表 |
| GET | `/api/files/:id/download` | 下载单个文件 (24h去重) |
| POST | `/api/skills/:skillId/download` | 打包下载 (24h去重) |
| GET | `/api/wishes` | 心愿墙列表 |
| POST | `/api/wishes` | 发布心愿 (匿名) |
| GET | `/api/rules` | 规则列表 |

### 管理员接口 (需 Bearer Token)

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/admin/login` | 管理员登录 |
| POST | `/api/admin/logout` | 退出登录 |
| GET | `/api/admin/session` | 验证会话 |
| GET | `/api/admin/stats` | 仪表盘统计 |
| POST | `/api/skills` | 创建技能 |
| PUT | `/api/skills/:id` | 修改技能 |
| DELETE | `/api/skills/:id` | 删除技能 |
| POST | `/api/skills/:skillId/versions` | 发布新版本 |
| DELETE | `/api/skills/:skillId/versions/:versionId` | 删除版本 |
| DELETE | `/api/skills/:skillId/comments/:commentId` | 删除留言 (软删除) |
| DELETE | `/api/wishes/:id` | 删除心愿 |
| POST | `/api/rules` | 创建规则 |
| PUT | `/api/rules/:id` | 修改规则 |
| DELETE | `/api/rules/:id` | 删除规则 |
| POST | `/api/rules/scan` | 规则引擎扫描 |

## 数据库表结构

| 表 | 说明 |
|---|---|
| admins | 管理员账户 (scrypt 哈希) |
| sessions | 登录会话 (24h 滑动过期) |
| categories | 技能分类 |
| skills | 技能主表 |
| versions | 版本档案 |
| files | 文件元数据 |
| diffs | 版本 Diff (LCS 算法) |
| comments | 留言 (支持软删除) |
| wishes | 心愿墙 (匿名) |
| rules | 规则引擎配置 |
| download_logs | 下载日志 (24h 去重 UNIQUE 约束) |
| settings | 系统配置 |

## 核心特性

- **博物馆式陈列**: 暖大地色系 + 强视觉展馆叙事风格
- **5Tab 详情页**: 博物(Markdown) / 版本(Diff) / 留言 / 文件 / 规则
- **规则引擎**: 关键词模式匹配 + 自动标签 + 扫描统计
- **24h 下载去重**: IP + Cookie + 日期联合唯一约束
- **五态交互**: 默认 / 加载 / 成功 / 业务失败 / 网络异常 + 禁用态
- **敏感词过滤**: 留言和心愿内容双重校验 (前后端)
- **频率限制**: 留言 30s/IP 限流
- **文件白名单**: 脚本/配置/归档/图片/文档类扩展名，禁止可执行文件

## 设计规范

- **主色**: brand-500 `#C4956A` (暖陶土)
- **底色**: neutral-50 `#FAF7F4` (奶油白)
- **圆角**: 柔和大圆角
- **文案**: 前台温暖口语化 vs 后台简洁专业
- **无障碍**: focus-visible / 语义标记 / 键盘导航 / 触控目标 44px+

## 种子数据

运行 `npm run seed` 后将导入:

- 3 个技能 (ZenAudio / Go WAL / SmartRule) 含完整版本/文件/Diff/留言
- 5 条规则 (AI标记/引擎审计/动效感官/安全合规/破坏预警)
- 3 条心愿
- 默认管理员 admin/admin123
