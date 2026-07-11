# MicroStarPlatform

Azure-native personal productivity PWA for collecting **daily micro-achievements** (DMTA → STAR). Built as a full-stack portfolio sample on Static Web Apps, Functions, Cosmos DB, and OpenAI.

Formerly known as *MicroBootCan* (Azure resource IDs retain the `microbootcan-*` prefix).

## Live Demo

https://ambitious-desert-0763df000.7.azurestaticapps.net

## Features (MVP)

- Milestone countdown to a configurable target date
- Structured achievement journal with Azure OpenAI context matching
- Metrics & bilingual summary dashboard
- Opportunity pipeline tracker (kanban)

## Product idea

Run short **Design → Make → Test → Analyze** loops, then keep the ones that matter as **STAR** (Situation / Task / Action / Result) records — *stars you collect*.

## Architecture

- **Frontend**: React + Fluent UI + Vite → Azure Static Web Apps
- **API**: Azure Functions (TypeScript)
- **Database**: Azure Cosmos DB (Free Tier)
- **Auth**: Microsoft Entra ID
- **AI**: Azure OpenAI
- **IaC**: Bicep
- **CI/CD**: GitHub Actions

## Packages

| Package | Name |
|---------|------|
| Root | `microstarplatform` |
| Web | `@microstar/web` |
| API | `@microstar/api` |
| Shared | `@microstar/shared` |

## Azure Setup

See [docs/azure-setup.md](docs/azure-setup.md).

## Local Development

See [docs/local-dev.md](docs/local-dev.md).

## Monorepo

See [docs/monorepo-overview.md](docs/monorepo-overview.md).

## GitHub Push (SotaroCraft)

This repo uses a dedicated SSH host alias. See [docs/github-push.md](docs/github-push.md).

## Project Charter

See [CHARTER.md](CHARTER.md) for privacy rules, public copy guidelines, MicroStar doctrine, and engineering principles.

## Cost Budget

Monthly Azure cap: **¥2,900**.

## Repository

Part of [sotaro-microsoft-tech-portfolio](https://github.com/SotaroCraft/sotaro-microsoft-tech-portfolio).
