# Imagine Architect

Grok Imagine 提示词工坊。用对话或对话框组装电影级提示词，复制到 Imagine，或直接出静帧。

## 功能

- **对话框**：写画面、选风格和画幅，一键复制或出图
- **对话**：中文描述场景，扩成英文电影级提示词
- **组装台**：风格、光影增强、镜头语法、四段弧线
- **分镜**：一段描述生成 4 条可分别复制的提示词
- **模板**：24 条电影级场景
- **图库**：出图结果与试验日志保存在本地

## 本地运行

需要 Node 22。出图功能需要服务端环境变量 `XAI_API_KEY`。

```bash
npm install
npm run dev
```

默认 `http://localhost:8080`。

```bash
npm run build
npm run typecheck
```

## 技术栈

React 19 · TanStack Start · Tailwind v4 · Zustand · xAI Imagine API
