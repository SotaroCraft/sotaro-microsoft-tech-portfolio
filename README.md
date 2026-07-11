# MicroBootCan

Azure-native personal productivity PWA — milestone tracking, achievement journal, and pipeline management. Built as a full-stack portfolio sample on Static Web Apps, Functions, Cosmos DB, and OpenAI.

## Live Demo

Coming soon — `https://<app-name>.azurestaticapps.net`

## Features (MVP)

- Milestone countdown to a configurable target date
- Structured achievement journal with Azure OpenAI context matching
- Metrics & bilingual summary dashboard
- Opportunity pipeline tracker (kanban)

## Architecture

- **Frontend**: React + Fluent UI + Vite → Azure Static Web Apps
- **API**: Azure Functions (TypeScript)
- **Database**: Azure Cosmos DB (Free Tier)
- **Auth**: Microsoft Entra ID
- **AI**: Azure OpenAI
- **IaC**: Bicep
- **CI/CD**: GitHub Actions

## Azure Setup

See [docs/azure-setup.md](docs/azure-setup.md).

## Local Development

See [docs/local-dev.md](docs/local-dev.md).

## Architecture

See [docs/monorepo-overview.md](docs/monorepo-overview.md).

## GitHub Push (SotaroCraft)

This repo uses a dedicated SSH host alias. See [docs/github-push.md](docs/github-push.md).

## Project Charter

See [CHARTER.md](CHARTER.md) for privacy rules, public copy guidelines, and engineering principles.

## Cost Budget

Monthly Azure cap: **¥2,900**.

## Repository

Part of [sotaro-microsoft-tech-portfolio](https://github.com/SotaroCraft/sotaro-microsoft-tech-portfolio).
