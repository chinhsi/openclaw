# 在 Zeabur 上部署 OpenClaw

這份指南將協助您在 Zeabur 平台上部署 OpenClaw Gateway。

## 🚀 快速開始

### 步驟 1：準備您的 Fork

1. 確保您已經 Fork 了 OpenClaw 專案到您的 GitHub 帳號
2. 將以下檔案加入到您的 Fork 根目錄：
   - `zeabur.json` - Zeabur 配置檔
   - `.env.example` - 環境變數範例

### 步驟 2：修改 package.json

在您的 `package.json` 的 `scripts` 部分，加入以下指令：

```json
"scripts": {
  // ...existing scripts...
  "start": "node scripts/run-node.mjs gateway",
  "build:zeabur": "pnpm install && pnpm ui:build && pnpm build"
}
```

### 步驟 3：提交更改

```bash
git add zeabur.json .env.example package.json
git commit -m "Add Zeabur deployment configuration"
git push origin main
```

### 步驟 4：在 Zeabur 上部署

1. 登入 [Zeabur Console](https://dash.zeabur.com)
2. 點擊「Create Project」創建新專案
3. 點擊「Deploy Service」→「Deploy from GitHub」
4. 授權 Zeabur 存取您的 GitHub
5. 選擇您的 `openclaw` repository
6. Zeabur 會自動偵測 Node.js 專案並開始部署

### 步驟 5：設定環境變數

在 Zeabur 服務設定中，點擊「Environment Variables」並設定：

#### 必要變數：
- `ANTHROPIC_API_KEY` - 您的 Anthropic API 金鑰（如果使用 Claude）
- `OPENAI_API_KEY` - 您的 OpenAI API 金鑰（如果使用 GPT）
- `SESSION_SECRET` - 一個強隨機字串用於 session 管理

#### 選用變數：
- `TELEGRAM_BOT_TOKEN` - Telegram Bot Token（如果要使用 Telegram）
- `DISCORD_BOT_TOKEN` - Discord Bot Token（如果要使用 Discord）
- `WHATSAPP_ENABLED` - 設為 `true` 啟用 WhatsApp

### 步驟 6：檢查部署狀態

1. 在 Zeabur Console 查看部署日誌
2. 等待狀態變為「Running」
3. 點擊提供的 URL 訪問您的 OpenClaw Gateway

## 📝 配置說明

### zeabur.json 結構

```json
{
  "build": {
    "node_version": "22",        // Node.js 版本
    "build_command": "...",      // 建置命令
    "output_dir": "dist"         // 輸出目錄
  },
  "run": {
    "start_command": "..."       // 啟動命令
  },
  "env": {
    // 環境變數預設值
  }
}
```

### 持久化存儲

OpenClaw 需要持久化存儲來保存配置和會話數據。在 Zeabur 中：

1. 點擊服務設定中的「Storage」
2. 添加 Volume Mount：
   - Mount Path: `/data/openclaw`
   - Size: 1GB（或根據需求調整）

## 🔧 故障排除

### 常見問題

1. **建置失敗**
   - 確保 Node.js 版本設為 22
   - 檢查是否有缺少的依賴

2. **啟動失敗**
   - 檢查環境變數是否正確設定
   - 查看 Zeabur 日誌找出錯誤訊息

3. **無法連接到服務**
   - 確認 PORT 環境變數設定正確
   - 檢查防火牆和網路設定

### 日誌查看

在 Zeabur Console 中：
1. 點擊您的服務
2. 選擇「Logs」標籤
3. 查看即時日誌輸出

## 📚 進階配置

### 使用自定義 openclaw.json

創建 `openclaw.json` 配置檔：

```json
{
  "agent": {
    "model": "anthropic/claude-opus-4-5"
  },
  "gateway": {
    "port": 3000,
    "host": "0.0.0.0"
  }
}
```

並在環境變數中設定：
- `OPENCLAW_CONFIG_PATH=/app/openclaw.json`

### 啟用多個頻道

在環境變數中設定對應的 Token 和啟用標誌：

```env
TELEGRAM_ENABLED=true
TELEGRAM_BOT_TOKEN=your_token

DISCORD_ENABLED=true
DISCORD_BOT_TOKEN=your_token
```

## 🆘 獲得幫助

- OpenClaw 文檔：https://github.com/openclaw/openclaw
- Zeabur 文檔：https://docs.zeabur.com
- 問題回報：在 GitHub 上開 issue

## 📄 授權

此部署指南遵循 OpenClaw 專案的授權條款。