# MicroBootCan — Local Development Guide

[CHARTER.md](../CHARTER.md) のエンジニアリング原則に基づくローカル開発手順。

## 構成方針（ハイブリッド）

| レイヤ | 実行場所 | 理由 |
|--------|----------|------|
| React (Vite) | ホスト | HMR・SWA CLI との公式連携 |
| Azure Functions | ホスト (`func start`) | SWA linked Functions の標準フロー |
| SWA CLI | ホスト (`swa start`) | 本番に近いプロキシ・認証ルート |
| Cosmos DB | Docker (Emulator) | オフライン開発・CI 再現性 |
| Azurite | Docker（任意） | Functions ローカルストレージ |
| Azure OpenAI | **モック**（local）/ Azure（dev） | 課金防止 |

```
pnpm dev  ──►  SWA CLI  ──►  Vite (5173) + Functions (7071)
                              │
                              ▼
                    Cosmos Emulator (Docker :8081)
```

## 前提ツール

```powershell
winget install OpenJS.NodeJS.LTS
winget install Microsoft.AzureCLI
winget install Microsoft.Azure.FunctionsCoreTools
winget install Docker.DockerDesktop   # Cosmos Emulator 用

npm install -g pnpm @azure/static-web-apps-cli
```

## 環境プロファイル

| プロファイル | `APP_ENV` | Cosmos | OpenAI | 用途 |
|-------------|-----------|--------|--------|------|
| **local** | `local` | Emulator (Docker) | モック（`AI_PROVIDER=mock`） | 日常開発・オフライン |
| **dev** | `dev` | Azure Cosmos（既存） | Gemini または Azure OpenAI | 結合確認 |
| **prod** | `prod` | Azure Cosmos | Azure OpenAI（Phase F） | SWA デプロイのみ |

`.env.example` をコピーして `.env.local` を作成する（Git 禁止）。

```powershell
cp .env.example .env.local
# APP_ENV=local を設定
```

## 起動手順

### 1. Docker（Cosmos Emulator）

```powershell
docker compose up -d
# Emulator 起動待ち（初回は 1〜2 分）
curl -k https://localhost:8081/_explorer/index.html
```

### 2. アプリ

```powershell
pnpm install
pnpm dev          # SWA CLI: フロント + API を一体起動
```

ブラウザ: `http://localhost:4280`（SWA CLI デフォルト）

### 3. 個別起動（デバッグ時）

```powershell
pnpm --filter web dev      # Vite のみ :5173
pnpm --filter api start    # Functions のみ :7071
swa start http://localhost:5173 --api-location api
```

## 認証（local）

| 環境 | 方式 |
|------|------|
| `local` | `DEV_AUTH_BYPASS=true` + 固定 dev ユーザー ID。**本番ビルドでは無効** |
| `dev` / `prod` | SWA Built-in Auth（Entra ID） |

## AI プロバイダ

`api/src/services/ai/` の `getAiProvider()` が `AI_PROVIDER` を解決する。

| `AI_PROVIDER` | 動作 |
|---------------|------|
| `mock`（省略時 + `APP_ENV=local`） | 決定論的ダミー応答。課金なし |
| `gemini` | Google Gemini REST（`GEMINI_API_KEY` 必須 — **従量課金、要承認**） |
| `azure` | Azure OpenAI REST（`AZURE_OPENAI_*` 必須） |

### OpenAI モック（local）

`APP_ENV=local` かつ `AI_PROVIDER=mock`（デフォルト）時:

- `match` API は固定 Top3 エントリ + サンプルドラフトを返す
- `embedding` API は決定論的ダミーベクトルを返す
- 実 Azure OpenAI 呼び出しは **行わない**

Azure OpenAI 結合確認: `.env.local` で `AI_PROVIDER=azure` と `AZURE_OPENAI_*` を設定。

## シードデータ

```powershell
pnpm db:seed    # Emulator に demo-data を投入（実装後）
```

シードは `packages/shared/demo-data/` の架空データのみ。個人データ禁止。

## トラブルシュート

| 症状 | 対処 |
|------|------|
| Cosmos Emulator 接続失敗 | Docker Desktop 起動確認、`docker compose logs cosmos-emulator` |
| Emulator SSL エラー | Node 側で `NODE_TLS_REJECT_UNAUTHORIZED=0`（**local のみ**） |
| Functions が Cosmos に繋がらない | `local.settings.json` の接続文字列確認 |
| SWA CLI 404 | `staticwebapp.config.json` の routes 確認 |

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
