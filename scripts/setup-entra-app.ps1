# Phase B — Entra ID App Registration for MicroStarPlatform SWA
# Run after SWA is deployed. Requires: az login, Microsoft Graph permissions.
# Existing Azure display name may still be "MicroBootCan SWA".

param(
  [string]$SwaHostname = "ambitious-desert-0763df000.7.azurestaticapps.net",
  [string]$AppDisplayName = "MicroBootCan SWA",
  [string]$ResourceGroup = "rg-microbootcan-prod",
  [string]$StaticSiteName = "stapp-microbootcan-z6mnnh4iqiisc"
)

$ErrorActionPreference = "Stop"

$prodCallback = "https://$SwaHostname/.auth/login/aad/callback"
$localCallback = "http://localhost:4280/.auth/login/aad/callback"

Write-Host "Creating Entra App Registration: $AppDisplayName"
$app = az ad app create `
  --display-name $AppDisplayName `
  --sign-in-audience AzureADMyOrg `
  --web-redirect-uris $prodCallback $localCallback `
  | ConvertFrom-Json

$clientId = $app.appId
$tenantId = (az account show --query tenantId -o tsv)

Write-Host "Creating client secret (store securely — shown once)"
$secret = az ad app credential reset --id $clientId --append --display-name "swa-prod" --years 1 | ConvertFrom-Json
$clientSecret = $secret.password

Write-Host ""
Write-Host "=== Entra registration created ==="
Write-Host "Tenant ID:     $tenantId"
Write-Host "Client ID:     $clientId"
Write-Host "Client secret: $clientSecret"
Write-Host ""

Write-Host "Configure SWA Authentication in Azure Portal:"
Write-Host "  Static Web App -> Authentication -> Add identity provider -> Microsoft"
Write-Host "  Client ID: $clientId"
Write-Host "  Client secret: (paste secret above)"
Write-Host ""

Write-Host "Optional: set single-user allowlist on SWA app settings"
Write-Host "  ALLOWED_USER_EMAIL=you@example.com"
Write-Host ""

$setArgs = @(
  "staticwebapp", "appsettings", "set",
  "--name", $StaticSiteName,
  "--resource-group", $ResourceGroup,
  "--setting-names",
  "AZURE_CLIENT_ID=$clientId",
  "AZURE_CLIENT_SECRET=$clientSecret"
)
Write-Host "Applying AZURE_CLIENT_ID / AZURE_CLIENT_SECRET to SWA app settings..."
az @setArgs | Out-Null

Write-Host "Done. Redeploy or restart SWA if auth does not appear immediately."
