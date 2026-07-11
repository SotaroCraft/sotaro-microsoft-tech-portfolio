# MicroBootCan — Azure Setup Guide

Azure-native personal productivity PWA (Static Web Apps + Functions + Cosmos DB + OpenAI).

## Azure 基本設定（完了済み）

| 項目 | 値 |
|------|-----|
| サブスクリプション | Azure subscription 1 |
| リージョン | Japan East (`japaneast`) |
| リソースグループ | `rg-microbootcan-prod` |
| 月次予算 | **MicroBootCan-Monthly: ¥2,900**（80% / 100% アラート） |
| Cosmos DB | Free Tier 有効 |
| Application Insights | 有効 |

### デプロイ済みリソース

- **Cosmos DB**: `microbootcancosmosz6mnnh4iqiisc`
  - Database: `microbootcan`
  - Containers: `episodes`, `companies`, `applications`, `career`, `settings`
- **Log Analytics**: `microbootcan-law-z6mnnh4iqiisc`
- **Application Insights**: `microbootcan-ai-z6mnnh4iqiisc`
- **Azure OpenAI**: `microbootcan-openai-z6mnn`
  - Endpoint: `https://microbootcan-openai-z6mnn.openai.azure.com/`
  - デプロイ済みモデル:
    - `gpt-5-mini`（GlobalStandard, 10K TPM）
    - `text-embedding-3-small`（Standard, 10K TPM）

## 前提ツール

```powershell
winget install Microsoft.AzureCLI
winget install OpenJS.NodeJS.LTS
npm install -g pnpm
winget install Microsoft.Azure.FunctionsCoreTools
az login
```

## インフラの再デプロイ

```powershell
cd c:\Users\seq\apps\MicroBootCan

az deployment sub create `
  --location japaneast `
  --template-file infra/budget.bicep `
  --parameters budgetName=MicroBootCan-Monthly amount=2900

az deployment sub create `
  --location japaneast `
  --template-file infra/main.bicep `
  --parameters infra/main.bicepparam
```

## 次のステップ

1. ~~Azure OpenAI リソース + モデルデプロイ~~ ✅
2. Static Web Apps 作成 + GitHub Actions 連携（Bicep + workflow スキャフォールド済み — **デプロイは承認後**）
3. Entra ID App Registration + SWA 認証設定 → [auth-setup.md](auth-setup.md)
4. ~~アプリケーションコード（React + Functions）~~ Phase A–D スキャフォールド済み

## Static Web Apps + GitHub Actions

### Bicep

`infra/modules/static-web-app.bicep` が SWA（Free tier）と Functions 向け app settings を定義します。

| App setting | 用途 |
|-------------|------|
| `COSMOS_ENDPOINT` / `COSMOS_KEY` / `COSMOS_DATABASE` | Cosmos DB 接続（Bicep で Cosmos キーを注入） |
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | 可観測性 |
| `APP_ENV` | `prod` |
| `AI_PROVIDER` | `mock`（既定） / `gemini` / `azure` |
| `GEMINI_API_KEY` | Gemini API（Phase D — 空のまま可、後から Portal で設定） |
| `AZURE_OPENAI_*` | Azure OpenAI（Phase F まで任意） |

再デプロイ（**要承認 — SWA 作成で固定費 $0 Free tier、従量は Functions/Cosmos 既存分**）:

```powershell
az deployment sub create `
  --location japaneast `
  --template-file infra/main.bicep `
  --parameters infra/main.bicepparam `
  --parameters aiProvider=mock
```

### GitHub Actions workflow

[`.github/workflows/azure-static-web-apps.yml`](../.github/workflows/azure-static-web-apps.yml)

- `pnpm build` の後、SWA に `apps/web` + `api` をデプロイ
- PR プレビュー環境を自動作成（close 時に削除）

### 必須 GitHub Secrets

リポジトリ **Settings → Secrets and variables → Actions** に設定:

| Secret | 取得方法 |
|--------|----------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Azure Portal → Static Web App → **Manage deployment token** |
| `AZURE_CLIENT_ID` | Entra App Registration → Application (client) ID（認証有効化時） |
| `AZURE_CLIENT_SECRET` | Entra App Registration → Certificates & secrets（認証有効化時） |

任意（CI から Functions 設定を上書きしない場合は Azure Portal / Bicep で設定）:

| Secret | 用途 |
|--------|------|
| `GEMINI_API_KEY` | `AI_PROVIDER=gemini` 時のコンテキストマッチ（Phase D — **API 呼び出しは従量課金、要承認**） |

> **Note**: SWA デプロイトークンはシークレットとして扱い、リポジトリにコミットしない。

### SWA と GitHub の初回接続

1. Bicep で SWA リソース作成（または Portal で作成）
2. Deployment token を GitHub secret に登録
3. `main` へ push → workflow がビルド & デプロイ
4. [auth-setup.md](auth-setup.md) に従い Entra プロバイダを有効化

## AI プロバイダ（Phase D スキャフォールド）

| `AI_PROVIDER` | 説明 |
|---------------|------|
| `mock` | ローカル / コストゼロ既定。決定論的 embedding + ダミー draft |
| `gemini` | Google Gemini API（`GEMINI_API_KEY` 必須） |
| `azure` | 既存 Azure OpenAI デプロイ |

`POST /api/match` — 参照テキストに対するジャーナル Top-K コンテキストマッチ（認証必須）。

## GitHub Actions（Static Web Apps）

Workflow: [`.github/workflows/azure-static-web-apps.yml`](../.github/workflows/azure-static-web-apps.yml)

SWA リソース作成後、GitHub リポジトリに以下の **Repository secrets** を登録する。

| Secret | 説明 | 取得方法 |
|--------|------|----------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | SWA デプロイトークン | Azure Portal → Static Web App → **Manage deployment token** |

`GITHUB_TOKEN` は Actions が自動提供するため、手動登録は不要。

### SWA 作成（未実施の場合）

```powershell
az staticwebapp create `
  --name microbootcan-swa `
  --resource-group rg-microbootcan-prod `
  --location japaneast `
  --source https://github.com/SotaroCraft/sotaro-microsoft-tech-portfolio `
  --branch main `
  --app-location apps/web `
  --api-location api `
  --output-location dist `
  --login-with-github
```

作成後、Portal から deployment token をコピーし GitHub secrets に登録する。

## GitHub リポジトリ

https://github.com/SotaroCraft/sotaro-microsoft-tech-portfolio

## コスト設計

Azure 月次上限 **¥2,900**。無料枠サービスを活用し、変動費は主に Azure OpenAI の従量課金。
