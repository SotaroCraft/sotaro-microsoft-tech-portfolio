# MicroBootCan Azure Basic Setup Script
# Requires: Azure CLI 2.x, logged in via `az login`

$ErrorActionPreference = "Stop"

$Location = "japaneast"
$ResourceGroup = "rg-microbootcan-prod"
$BudgetName = "MicroBootCan-Monthly"
$BudgetAmount = 2900

Write-Host "=== MicroBootCan Azure Setup ===" -ForegroundColor Cyan

# Verify login
$account = az account show 2>$null | ConvertFrom-Json
if (-not $account) {
    Write-Host "Not logged in. Running az login..." -ForegroundColor Yellow
    az login
    $account = az account show | ConvertFrom-Json
}

Write-Host "Subscription: $($account.name) ($($account.id))" -ForegroundColor Green

# Register required resource providers
$providers = @(
    "Microsoft.DocumentDB",
    "Microsoft.Insights",
    "Microsoft.OperationalInsights",
    "Microsoft.Web",
    "Microsoft.CognitiveServices"
)

Write-Host "`nRegistering resource providers..." -ForegroundColor Cyan
foreach ($provider in $providers) {
    $state = az provider show --namespace $provider --query "registrationState" -o tsv
    if ($state -ne "Registered") {
        Write-Host "  Registering $provider..." -ForegroundColor Yellow
        az provider register --namespace $provider --wait | Out-Null
    } else {
        Write-Host "  $provider already registered" -ForegroundColor DarkGray
    }
}

# Deploy budget
Write-Host "`nDeploying Cost Management budget (JPY $BudgetAmount/month)..." -ForegroundColor Cyan
$userEmail = az ad signed-in-user show --query mail -o tsv
if (-not $userEmail) {
    $userEmail = az ad signed-in-user show --query userPrincipalName -o tsv
}

$infraDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
az deployment sub create `
    --location $Location `
    --template-file "$infraDir/budget.bicep" `
    --parameters budgetName=$BudgetName amount=$BudgetAmount "contactEmails=['$userEmail']"

# Deploy main infrastructure
Write-Host "`nDeploying main infrastructure (RG + Cosmos DB + App Insights)..." -ForegroundColor Cyan
az deployment sub create `
    --location $Location `
    --template-file "$infraDir/main.bicep" `
    --parameters "@$infraDir/main.bicepparam"

Write-Host "`n=== Setup Complete ===" -ForegroundColor Green
Write-Host "Resource Group: $ResourceGroup"
Write-Host "Budget: $BudgetName ($BudgetAmount JPY/month)"
Write-Host "`nNext: Deploy Azure OpenAI manually if available in your region."
Write-Host "  az cognitiveservices account list-kinds --location $Location"
