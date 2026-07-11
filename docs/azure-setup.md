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
2. Static Web Apps 作成 + GitHub Actions 連携
3. Entra ID App Registration + SWA 認証設定
4. アプリケーションコード（React + Functions）

## GitHub リポジトリ

https://github.com/SotaroCraft/sotaro-microsoft-tech-portfolio

## コスト設計

Azure 月次上限 **¥2,900**。無料枠サービスを活用し、変動費は主に Azure OpenAI の従量課金。
