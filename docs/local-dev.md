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
| **local** | `local` | Emulator (Docker) | モック | 日常開発・オフライン |
| **dev** | `dev` | Azure Cosmos（既存） | Azure OpenAI（TPM 低） | 結合確認 |
| **prod** | `prod` | Azure Cosmos | Azure OpenAI | SWA デプロイのみ |

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

## OpenAI モック

`APP_ENV=local` 時:

- `match` API は固定 Top3 エントリ + サンプルドラフトを返す
- `embedding` API は決定論的ダミーベクトルを返す
- 実 Azure OpenAI 呼び出しは **行わない**

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

## 非公開ツール

ローカルスクレイパー等は `tools/private/`（`.gitignore`）またはリポジトリ外に配置。  
取得結果は CSV/JSON インポートでアプリへ渡す（[CHARTER.md](../CHARTER.md) 参照）。
