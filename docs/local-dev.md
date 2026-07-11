# MicroStarPlatform — Local Development Guide

[CHARTER.md](../CHARTER.md) のエンジニアリング原則に基づくローカル開発手順。

## 構成方針（本番同等）

ローカルと本番で **同じ API 面・同じ認証ゲート・同じ Cosmos コンテナ** を使う。

| レイヤ | 実行場所 | 本番との対応 |
|--------|----------|-------------|
| React (Vite) | ホスト `:5173` | SWA 静的ホスト |
| Azure Functions | ホスト `:7071`（`pnpm dev`） | SWA linked Functions |
| SWA CLI（任意） | `:4280`（`pnpm dev:swa`） | 本番 Entra / `/.auth` |
| Cosmos DB | Docker Emulator `:8081` | Azure Cosmos（同一コンテナ名） |
| Azurite | Docker | Functions ストレージ |
| AI | `AI_PROVIDER=mock` | 本番も当面 `mock` |

```
pnpm dev
  ├── ensure-local-settings + docker compose (Cosmos / Azurite)
  ├── api  build → func start (:7071)
  └── web  Vite (:5173) → proxy /api → :7071
           └── /.auth/* をローカルモック（本番 SWA と同等ゲート）
```

Entra 実ログインをローカルで試す場合:

```
pnpm dev:swa   # Vite + SWA CLI → http://localhost:4280
```

## 前提ツール

```powershell
winget install OpenJS.NodeJS.LTS
winget install Microsoft.AzureCLI
winget install Microsoft.Azure.FunctionsCoreTools
winget install Docker.DockerDesktop   # Cosmos Emulator + Azurite

npm install -g pnpm
```

## 環境プロファイル

| プロファイル | `APP_ENV` | Cosmos | OpenAI | 用途 |
|-------------|-----------|--------|--------|------|
| **local** | `local` | Emulator (Docker) | モック（`AI_PROVIDER=mock`） | 日常開発・オフライン |
| **dev** | `dev` | Azure Cosmos（既存） | Gemini または Azure OpenAI | 結合確認 |
| **prod** | `prod` | Azure Cosmos | Azure OpenAI（承認後） | SWA デプロイのみ |

`pnpm dev` 初回で `api/local.settings.json` が無ければ example から自動生成される（Git 禁止）。

## 起動手順

```powershell
pnpm install
pnpm dev          # Cosmos/Azurite + API + Vite（本番同等スタック）
```

ブラウザ: **http://localhost:5173/**

| コマンド | 内容 |
|----------|------|
| `pnpm dev` | 推奨。API + フロント。認証はローカルモック（`DEV_AUTH_BYPASS` + `/.auth` モック） |
| `pnpm dev:swa` | 本番と同じ SWA Entra。**http://localhost:4280** |
| `pnpm dev:web` / `dev:api` | 片方だけ（デバッグ用） |
| `pnpm dev:deps` | Docker のみ再起動 |

### 個別起動（デバッグ時）

```powershell
node scripts/ensure-local-settings.mjs
pnpm --filter @microstar/shared build
pnpm --filter @microstar/api build
pnpm --filter @microstar/api start    # :7071
pnpm --filter @microstar/web dev      # :5173
```

## 認証（local ↔ prod）

| 環境 | 方式 |
|------|------|
| `pnpm dev`（:5173） | API: `DEV_AUTH_BYPASS=true`。UI: Vite が `/.auth/me` をモックし `RequireAuth` でゲート（本番 SWA 相当） |
| `pnpm dev:swa`（:4280） | 本番と同じ SWA Built-in Auth（Entra）。`VITE_LOCAL_AUTH_BYPASS=false` 推奨 |
| **prod** | SWA Built-in Auth + `x-ms-client-principal` |

フロントの Entra / Graph クライアント ID は本番 CI と同じ値を `apps/web/.env.development` に置く。

## AI プロバイダ

`api/src/services/ai/` の `getAiProvider()` が `AI_PROVIDER` を解決する。

| `AI_PROVIDER` | 動作 |
|---------------|------|
| `mock`（省略時 + `APP_ENV=local`） | 決定論的ダミー応答。課金なし |
| `gemini` | Google Gemini REST（`GEMINI_API_KEY` 必須 — **従量課金、要承認**） |
| `azure` | Azure OpenAI REST（`AZURE_OPENAI_*` 必須） |

ローカル・本番とも当面 `mock`。有料 AI 切替は承認後。

## Cosmos コンテナ

初回 API 呼び出しで DB / コンテナを `createIfNotExists`（Bicep と同名）:

`episodes` · `companies` · `applications` · `career` · `settings` · `projects`

## トラブルシュート

| 症状 | 対処 |
|------|------|
| `/api/*` が HTTP 500 / proxy error | `pnpm dev` で API も起動しているか。旧 `vite` 単独は不可 |
| Cosmos Emulator 接続失敗 | Docker Desktop 起動、`docker compose logs cosmos-emulator` |
| `high demand in this region`（Emulator） | パーティション不足。`docker-compose.yml` の `AZURE_COSMOS_EMULATOR_PARTITION_COUNT` を上げ、`docker compose down -v && docker compose up -d` |
| `docker` が PATH に無い（Desktop 直後） | ターミナル / Cursor を再起動。または `C:\Program Files\Docker\Docker\resources\bin` を PATH に追加 |
| Emulator SSL エラー | `local.settings.json` の `NODE_TLS_REJECT_UNAUTHORIZED=0`（local のみ） |
| Functions ストレージ警告 | Azurite（`docker compose up -d`） |
| SWA CLI 404 | `staticwebapp.config.json` の routes 確認、`:4280` で開いているか |

## Azure Architecture Icons

Phase E 構成図用の Microsoft Azure Architecture Icons（714 SVG）を **リポジトリ外相当** のローカル専用パスに置く。

### 配置

```
resources/
└── Icons/
    ├── web/              # Static Web Apps 等
    ├── compute/          # Function Apps 等
    ├── databases/        # Cosmos DB 等
    ├── monitor/          # App Insights, Log Analytics 等
    ├── security/         # Entra 関連
    ├── general/          # Resource Groups, Budgets 等
    └── …（計 28 カテゴリ）
```

- **`resources/` は `.gitignore` 対象** — GitHub に 714 ファイルを載せない
- 初回 clone 後、`resources/` が無くても `apps/web/public/architecture-icons/` のデプロイ束で構成図は動作する
- フルセットは [Azure Architecture Icons](https://learn.microsoft.com/en-us/azure/architecture/icons/) から取得し、上記パスに展開

### アイコン同期（`pnpm sync:icons`）

レジストリ（`packages/shared/src/architecture/icon-registry.ts`）に登録された SVG のみ、マスター → デプロイ束へコピーする。

```powershell
pnpm sync:icons
# → apps/web/public/architecture-icons/ を更新
# 差分があれば git add & commit
```

**いつ実行するか**:

1. 新しい ARM `resourceType` を構成図に追加したとき（レジストリ更新後）
2. `resources/Icons/` を初めて配置したとき
3. Phase E 実装開始前の初期デプロイ束作成時

詳細: [project-status.md](project-status.md#アイコン戦略phase-e)

## 非公開ツール

ローカルスクレイパー等は `tools/private/`（`.gitignore`）またはリポジトリ外に配置。  
取得結果は CSV/JSON インポートでアプリへ渡す（[CHARTER.md](../CHARTER.md) 参照）。
