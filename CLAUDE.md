
# CLAUDE.md

本文件为 Claude Code（claude.ai/code）在本仓库协作时的开发指引。

## 项目简介

欢迎使用抽奖系统（年会受控抽奖系统）——一款全屏黑金科技风格的抽奖/抽签工具。支持"受控抽奖"（必中名单、禁抽名单、权重概率），可离线运行，数据持久化于本地 localStorage。

## 开发命令

```bash
npm install          # 安装依赖
npm run dev          # 启动开发服务器 (http://localhost:5173)
npm run build        # TypeScript 编译 + Vite 打包（输出单一 HTML 文件）
npm run lint         # ESLint 代码校验
npm run preview      # 预览生产构建
npm run test         # 运行 Vitest 测试
npm run deploy:cf    # 部署到 Cloudflare Pages（需登录 wrangler）
```

## 架构说明

**技术栈**：React 19 + TypeScript + Tailwind CSS + Vite

**路由**：基于 Wouter 的 Hash 路由，支持 file:// 离线访问
- `/` - 展示页（抽奖动画）
- `/admin` - 管理后台（密码保护）

**状态管理**：Zustand + localStorage 持久化
- Store 文件：`src/store/useStore.ts`
- 持久化 key：`'lucky-draw-storage'`
- 多窗口轮询同步（展示端 500ms，管理端 1000ms）

**核心业务逻辑**：`src/lib/lottery-logic.ts`
- 权重随机算法
- 必中名单优先
- 禁抽名单过滤

**主要组件**：
- `src/pages/DisplayPage.tsx` —— 主抽奖展示页，实时同步
- `src/pages/AdminPage.tsx` —— 管理后台，奖项/人员管理
- `src/components/RollingBoard.tsx` —— 抽奖动画（欢迎/滚动模式）

**UI**：Shadcn/ui 组件，位于 `src/components/ui/`

## 代码规范

- 路径别名：import 使用 `@/` 前缀（映射到 `src/`）
- UI 组件：从 `@/components/ui` 导入
- 业务逻辑：放于 `@/lib`
- 自定义 hooks：放于 `@/hooks`
- 类型/接口：定义在 `@/lib/types.ts`

## 构建产物

最终打包输出为 `/dist` 下单文件 HTML，所有 CSS/JS/图片均内联，便于离线 U 盘分发。

## 部署

自动部署（GitHub Actions）：
- 推送到 `main` 分支自动触发 CI/CD
- Secret 需要在 GitHub 仓库设置 `CLOUDFLARE_API_TOKEN`

本地部署：
```bash
npm run build
npx wrangler pages deploy dist --project-name=choujiang
```

## 测试

使用 Vitest，命令：`npm run test`
