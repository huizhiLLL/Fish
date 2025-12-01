这是一份完整的项目结构指南和实施步骤，整合了 React (Next.js App Router)、Vercel Serverless Functions 和 Prisma (Neon DB) 的配置。


```markdown
# Vercel Serverless Project Guide (Next.js + Prisma + Neon)

本文档描述了一个基于 Next.js App Router 架构的全栈项目结构。该架构集成了 React 前端、Serverless API 后端以及 Prisma 数据库连接（使用 Neon Postgres）。

## 1. 📂 推荐项目文件结构

```plaintext
my-fullstack-app/
├── .env                  # 🔐 本地环境变量 (包含 DATABASE_URL, DIRECT_URL)
├── .gitignore            # git 忽略配置
├── package.json          # 项目依赖
├── next.config.js        # Next.js 配置
├── tsconfig.json         # TypeScript 配置
│
├── prisma/               # 🗄️ 数据库层
│   ├── schema.prisma     # 核心：数据库模型与连接配置
│   └── migrations/       # 数据库迁移历史
│
├── lib/                  # 🛠️ 工具库
│   └── prisma.ts         # 核心：Prisma Client 单例 (防止 Serverless 连接耗尽)
│
└── app/                  # 🚀 应用主入口 (App Router)
    │
    ├── layout.tsx        # 全局 HTML 布局
    ├── page.tsx          # 前端首页 (React 组件)
    │
    └── api/              # ⚡️ Serverless 函数入口 (后端)
        └── users/        # API 路由: /api/users
            └── route.ts  # 后端逻辑: 处理 GET/POST 请求
```

---

## 2. 📝 关键文件代码模板

### A. 数据库配置 (`prisma/schema.prisma`)
此配置确保 Prisma 在运行时使用连接池，在迁移时使用直连。

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  // Vercel 生产环境/本地开发运行时使用的 URL (带连接池)
  url       = env("DATABASE_URL")
  // 迁移数据库结构时使用的 URL (直连，不经过连接池)
  directUrl = env("DIRECT_URL")
}

// 示例模型
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

### B. Prisma 单例模式 (`lib/prisma.ts`)
**非常重要**：防止在开发环境的热重载(Hot Reload)或 Serverless 冷启动时创建过多数据库连接。

```typescript
import { PrismaClient } from '@prisma/client'

// 声明全局变量类型，防止 TypeScript 报错
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // 可选：开发模式下打印 SQL 日志
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### C. 后端 API 路由 (`app/api/users/route.ts`)
Serverless 函数的具体实现，Vercel 会自动将其部署为 Lambda 函数。

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // 👈 必须从这里导入

// GET: 获取所有用户
export async function GET() {
  try {
    const users = await prisma.user.findMany()
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

// POST: 创建新用户
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
      },
    })
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 })
  }
}
```

---

## 3. 🚀 实施与部署步骤

### 第一步：Neon 数据库准备
1. 在 Neon 控制台找到 **Connection Details**。
2. 复制 **Pooled URL** (开启 `Connection pooling` 开关)，这是 `DATABASE_URL`。
3. 复制 **Direct URL** (关闭 `Connection pooling` 开关)，这是 `DIRECT_URL`。

### 第二步：本地开发配置
1. 在项目根目录创建 `.env` 文件：
   ```env
   DATABASE_URL="postgres://user:pass@ep-pooler...neondb?pgbouncer=true"
   DIRECT_URL="postgres://user:pass@ep-direct...neondb"
   ```
2. 安装依赖并同步数据库：
   ```bash
   npm install prisma @prisma/client
   npx prisma generate
   npx prisma migrate dev --name init # 将 schema 同步到数据库
   ```

### 第三步：Vercel 部署配置
1. 将代码推送到 GitHub。
2. 在 Vercel 导入项目。
3. **关键：配置环境变量 (Environment Variables)**
   在 Vercel 项目设置中，添加以下两个变量（**不要**把 `.env` 文件提交到 GitHub）：
   - `DATABASE_URL`: 填入你的 Pooled URL
   - `DIRECT_URL`: 填入你的 Direct URL

### 第四步：构建与验证
1. Vercel 会自动识别 Next.js 并运行构建命令。
2. 构建过程中，Vercel 会自动执行 `prisma generate` 生成 Client 代码。
3. 部署完成后，访问 `https://你的域名/api/users` 即可测试 Serverless 函数是否连接成功。

---

## 4. ⚠️ 常见问题与最佳实践

1. **数据库迁移 (Migration) 怎么跑？**
   - **推荐**：在本地开发机上运行 `npx prisma migrate deploy` 来更新生产环境数据库结构（需要本地 `.env` 中的 `DIRECT_URL` 指向生产库）。
   - **不推荐**：在 Vercel Build Command 中运行迁移，因为这可能导致构建超时或权限问题。

2. **为什么需要两个 URL？**
   - **Prisma Client (运行时)** 需要连接池 (`DATABASE_URL`) 来处理高并发请求。
   - **Prisma Migrate (迁移时)** 需要直连 (`DIRECT_URL`) 来执行 DDL 语句（修改表结构），连接池通常不支持某些复杂的结构变更命令。
```