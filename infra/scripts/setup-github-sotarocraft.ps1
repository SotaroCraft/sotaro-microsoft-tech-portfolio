# MicroStarPlatform — GitHub push as SotaroCraft (this repo only)
#
# Uses SSH host alias `github-sotarocraft` so other projects keep using your default GitHub account.
# Run once from repo root:
#   .\infra\scripts\setup-github-sotarocraft.ps1

$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$SshDir = Join-Path $env:USERPROFILE ".ssh"
$KeyPath = Join-Path $SshDir "id_ed25519_sotarocraft"
$ConfigPath = Join-Path $SshDir "config"
$HostAlias = "github-sotarocraft"
$Remote = "git@${HostAlias}:SotaroCraft/sotaro-microsoft-tech-portfolio.git"

Write-Host "=== MicroStarPlatform: SotaroCraft GitHub setup ===" -ForegroundColor Cyan

# 1. SSH key (SotaroCraft only)
New-Item -ItemType Directory -Force -Path $SshDir | Out-Null

if (-not (Test-Path $KeyPath)) {
  Write-Host "Creating SSH key: $KeyPath" -ForegroundColor Yellow
  ssh-keygen -t ed25519 -f $KeyPath -C "MicroStarPlatform@sotarocraft" -N '""'
} else {
  Write-Host "SSH key already exists: $KeyPath" -ForegroundColor DarkGray
}

# 2. GitHub host key (append if missing)
$KnownHosts = Join-Path $SshDir "known_hosts"
$HostKeyLine = ssh-keyscan -t ed25519 github.com 2>$null
if ($HostKeyLine -and (Test-Path $KnownHosts)) {
  $hasKey = Get-Content $KnownHosts | Select-String "github.com"
  if (-not $hasKey) { Add-Content -Path $KnownHosts -Value $HostKeyLine }
} elseif ($HostKeyLine) {
  Set-Content -Path $KnownHosts -Value $HostKeyLine
}

# 3. SSH config entry
$Block = @"

Host $HostAlias
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_sotarocraft
  IdentitiesOnly yes
"@

if (Test-Path $ConfigPath) {
  $existing = Get-Content $ConfigPath -Raw
  if ($existing -notmatch "Host $HostAlias") {
    Add-Content -Path $ConfigPath -Value "`n$Block"
    Write-Host "Added Host $HostAlias to $ConfigPath" -ForegroundColor Green
  } else {
    Write-Host "Host $HostAlias already in $ConfigPath" -ForegroundColor DarkGray
  }
} else {
  Set-Content -Path $ConfigPath -Value $Block.TrimStart()
  Write-Host "Created $ConfigPath" -ForegroundColor Green
}

# 4. Local git config (this repo only — not global)
Push-Location $RepoRoot
git config --local user.name "Sotaro Egashira"
git config --local user.email "sotaro.egashira@outlook.com"
git remote set-url origin $Remote
Pop-Location

Write-Host "`nLocal remote:" -ForegroundColor Cyan
git -C $RepoRoot remote -v

Write-Host "`n=== Add this public key to SotaroCraft GitHub ===" -ForegroundColor Yellow
Write-Host "https://github.com/settings/keys  ->  New SSH key`n" -ForegroundColor Yellow
Get-Content "$KeyPath.pub"

Write-Host "`nTest (after adding key):" -ForegroundColor Cyan
Write-Host "  ssh -T $HostAlias"
Write-Host "  git -C `"$RepoRoot`" push -u origin main"
