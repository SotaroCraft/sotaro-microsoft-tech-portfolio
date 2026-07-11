# Add Microsoft Graph delegated permissions for MicroStarPlatform Inbox import.
# Scopes: User.Read, Calendars.Read, Mail.Read
# Requires: az login with Application.ReadWrite.All (or Global Admin) for the tenant.
# Expected cost: ¥0 (directory config only — no new Azure resources).

param(
  [Parameter(Mandatory = $false)]
  [string]$AppId = "",

  [Parameter(Mandatory = $false)]
  [string]$AppDisplayName = "MicroBootCan SWA",

  # SPA redirect URIs for MSAL (in addition to SWA /.auth callbacks)
  [string[]]$SpaRedirectUris = @(
    "https://ambitious-desert-0763df000.7.azurestaticapps.net",
    "http://localhost:5173",
    "http://localhost:4280"
  ),

  [switch]$GrantAdminConsent
)

$ErrorActionPreference = "Stop"

Write-Host "=== Graph delegated permissions (Calendar + Mail) ==="

if (-not $AppId) {
  Write-Host "Looking up app by display name: $AppDisplayName"
  $AppId = az ad app list --display-name $AppDisplayName --query "[0].appId" -o tsv
  if (-not $AppId) {
    throw "App registration not found. Pass -AppId <client-id> or create via setup-entra-app.ps1 first."
  }
}

Write-Host "App (client) ID: $AppId"

# Microsoft Graph resource app ID (well-known)
$graphAppId = "00000003-0000-0000-c000-000000000000"

# Delegated permission IDs (Microsoft Graph)
# User.Read:     e1fe6dd8-ba31-4d61-89e7-88639da4683d
# Calendars.Read: 465a38f9-76de-40b7-af7e-c85bdbcb9912
# Mail.Read:     570282fd-fa83-4638-ae09-2c7a15cde000
$userRead = "e1fe6dd8-ba31-4d61-89e7-88639da4683d"
$calendarsRead = "465a38f9-76de-40b7-af7e-c85bdbcb9912"
$mailRead = "570282fd-fa83-4638-ae09-2c7a15cde000"

Write-Host "Fetching current requiredResourceAccess..."
$appJson = az ad app show --id $AppId -o json | ConvertFrom-Json
$existing = @($appJson.requiredResourceAccess)

$graphEntry = $existing | Where-Object { $_.resourceAppId -eq $graphAppId } | Select-Object -First 1
$needed = @(
  @{ id = $userRead; type = "Scope" },
  @{ id = $calendarsRead; type = "Scope" },
  @{ id = $mailRead; type = "Scope" }
)

if (-not $graphEntry) {
  $existing += @{
    resourceAppId  = $graphAppId
    resourceAccess = $needed
  }
} else {
  $access = @($graphEntry.resourceAccess)
  foreach ($perm in $needed) {
    if (-not ($access | Where-Object { $_.id -eq $perm.id })) {
      $access += $perm
    }
  }
  $graphEntry.resourceAccess = $access
  $existing = @($existing | Where-Object { $_.resourceAppId -ne $graphAppId }) + $graphEntry
}

$tmp = New-TemporaryFile
($existing | ConvertTo-Json -Depth 8 -Compress) | Set-Content -Path $tmp.FullName -Encoding utf8
Write-Host "Updating requiredResourceAccess..."
az ad app update --id $AppId --required-resource-accesses "@$($tmp.FullName)" | Out-Null
Remove-Item $tmp.FullName -Force

Write-Host "Ensuring SPA redirect URIs for MSAL..."
# UTF-8 no BOM JSON file — inline --body breaks on Windows PowerShell escaping
$objectId = az ad app show --id $AppId --query id -o tsv
$spaPath = Join-Path $env:TEMP "microstar-spa-redirects.json"
$utf8 = New-Object System.Text.UTF8Encoding $false
$spaJson = (@{ spa = @{ redirectUris = @($SpaRedirectUris) } } | ConvertTo-Json -Depth 5 -Compress)
[System.IO.File]::WriteAllText($spaPath, $spaJson, $utf8)
az rest --method PATCH `
  --uri "https://graph.microsoft.com/v1.0/applications/$objectId" `
  --headers "Content-Type=application/json" `
  --body "@$spaPath" | Out-Null
Remove-Item $spaPath -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Delegated permissions requested on app registration:"
Write-Host "  User.Read, Calendars.Read, Mail.Read"
Write-Host "SPA redirect URIs:"
$SpaRedirectUris | ForEach-Object { Write-Host "  $_" }

if ($GrantAdminConsent) {
  Write-Host "Granting admin consent..."
  az ad app permission admin-consent --id $AppId
  Write-Host "Admin consent granted."
} else {
  Write-Host ""
  Write-Host "Next (Portal or CLI):"
  Write-Host "  1. Azure Portal → App registrations → $AppDisplayName → API permissions"
  Write-Host "  2. Confirm Microsoft Graph delegated: User.Read, Calendars.Read, Mail.Read"
  Write-Host "  3. Click 'Grant admin consent' (or have each user consent on first MSAL popup)"
  Write-Host "  4. Authentication → SPA platform: ensure redirect URIs above are listed"
  Write-Host "  5. Web env: VITE_ENTRA_CLIENT_ID=$AppId  VITE_ENTRA_TENANT_ID=<tenant>  VITE_GRAPH_USE_MOCK=false"
  Write-Host ""
  Write-Host "Or re-run with -GrantAdminConsent if you have rights."
}

Write-Host ""
Write-Host "Estimated cost: immediate JPY 0 / added fixed JPY 0 (directory config only)"
