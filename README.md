# Todo Telegram Mini App

一個簡單嘅任務清單 Mini App，喺 Telegram 入面即開即用。

## 特點

- ✅ 純前端，無需後端伺服器
- ✅ 支援 Telegram WebAuth
- ✅ 任務篩選（全部 / 今日 / 今週 / 過期）
- ✅ 日期時間過期提示
- ✅ 響應式設計

## 技術棧

- React 19
- TypeScript
- Vite
- Chakra UI v3
- Zustand (狀態管理)
- Axios (API 呼叫)

## 開發

```bash
# 安裝依賴
pnpm install

# 啟動開發伺服器
pnpm dev
```

## 環境變數

喺 `.env` 檔案度設定：

```bash
VITE_API_URL=your-api-url
```

## 結構

```bash
# 建構生產版本
pnpm build

# 預覽建構結果
pnpm preview
```

## 專案結構

```
src/
├── api/          # API 呼叫
├── components/    # React 組件
├── hooks/         # Custom hooks
├── stores/        # Zustand 狀態管理
├── types/         # TypeScript 類型定義
└── utils/         # 工具函數
```

## 授權

MIT License
