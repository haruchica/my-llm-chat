## 概要
WEBブラウザ上でGoogleのLLMを使用して雑談できる。
無料枠の都合でGoogleのLLMを使用

# TypeScript × Next.js × LLM Chat

Next.js（App Router）と OpenAI API を使ったデモアプリ。

- フロントエンド: Next.js + React + TypeScript
- API: Next.js API Routes（`app/api/chat/route.ts`）
- LLM: GEMINI API

---

## 環境

- Node.js **20以上** 開発時はNVMを使用
- npm（Node.js に同梱）
- 任意のエディタ（VS Code 推奨）
- Google LLM API Key

## 環境構築
cd my-llm-chat
npx create-next-app@latest my-llm-chat --typescript

envにAPIキー設定

## ローカル用メモ
http://localhost:3000

