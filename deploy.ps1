# deploy.ps1
# Builds Digitech Nexus and packages it as deploy.zip for the cPanel host.
# Run from the project root (the folder that contains package.json):
#   powershell -ExecutionPolicy Bypass -File ./deploy.ps1

Set-Location -Path $PSScriptRoot

function Fail([string]$message) {
  Write-Host ""
  Write-Host "STOP: $message" -ForegroundColor Red
  exit 1
}

function Step([string]$message) {
  Write-Host ""
  Write-Host "== $message" -ForegroundColor Cyan
}

if (-not (Test-Path "package.json")) {
  Fail "package.json not found. Put deploy.ps1 in the project root and run it from there."
}

# ---------------------------------------------------------------- 1. config
Step "1/6 Checking next.config"

# Next.js reads only ONE config file, in this order. Check the one it will really use.
$configOrder = @("next.config.js", "next.config.mjs", "next.config.cjs", "next.config.ts")
$present = @($configOrder | Where-Object { Test-Path $_ })
if ($present.Count -eq 0) {
  Fail "No next.config.ts / .js / .mjs file found in this folder."
}
$active = $present[0]
if ($present.Count -gt 1) {
  Write-Host ("Warning: found more than one config file (" + ($present -join ", ") + "). Next.js reads only " + $active + " and ignores the rest. Delete the extras so there is no confusion.") -ForegroundColor Yellow
}

$hasStandalone = ((Get-Content $active -Raw) -match 'output\s*:\s*["'']standalone["'']')

if (-not $hasStandalone) {
  Write-Host ""
  Write-Host ("Next.js is reading " + $active + ", and it does not turn on standalone output. That is why .next/standalone never appears.") -ForegroundColor Yellow
  Write-Host ("Replace the contents of " + $active + " with exactly this, then run the script again:")
  Write-Host ""
  Write-Host 'const nextConfig = {'
  Write-Host '  images: { unoptimized: true },'
  Write-Host '  output: "standalone",'
  Write-Host '  outputFileTracingRoot: process.cwd(),'
  Write-Host '};'
  Write-Host 'export default nextConfig;'
  Fail "next.config needs output: standalone."
}

try {
  $pkg = Get-Content "package.json" -Raw | ConvertFrom-Json
} catch {
  Fail "package.json could not be read."
}
$buildScript = [string]$pkg.scripts.build
if ($buildScript -match 'RAYON_NUM_THREADS') {
  Fail ("The build script in package.json is set up for the host ('" + $buildScript + "') and will not run on Windows. Change it back to: next build")
}
Write-Host ("Using " + $active + " - standalone output is on.")

# ---------------------------------------------------------------- 2. live address
Step "2/6 Checking the live site address"

$envFile = ".env.production.local"
$needUrl = $true

if (Test-Path $envFile) {
  $line = Select-String -Path $envFile -Pattern '^\s*NEXT_PUBLIC_SITE_URL\s*=\s*(.+)$' | Select-Object -First 1
  if ($line) {
    $current = $line.Matches[0].Groups[1].Value.Trim()
    if (($current -match '^https://') -and ($current -notmatch 'localhost')) {
      $needUrl = $false
      Write-Host ("Building for " + $current)
    }
  }
}

if ($needUrl) {
  Write-Host "The build bakes your live address into the site, so it must be right."
  $url = (Read-Host "Enter your live site address (example: https://yourdomain.com)").Trim().TrimEnd('/')
  if ($url -notmatch '^https://[^/\s]+$') {
    Fail "That is not a valid https:// address. Run the script again and type it like https://yourdomain.com"
  }
  $lines = @()
  if (Test-Path $envFile) {
    $lines = @(Get-Content $envFile | Where-Object { $_ -notmatch '^\s*NEXT_PUBLIC_SITE_URL\s*=' })
  }
  $lines += ("NEXT_PUBLIC_SITE_URL=" + $url)
  Set-Content -Path $envFile -Value $lines -Encoding ASCII
  Write-Host ("Saved to " + $envFile)
}

# ---------------------------------------------------------------- 3. build
Step "3/6 Cleaning old files and building (a few minutes)"

if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "deploy.zip") { Remove-Item -Force "deploy.zip" }

npm run build
if ($LASTEXITCODE -ne 0) {
  Fail "The build failed. Read the errors above, fix them, then run this script again."
}

# ---------------------------------------------------------------- 4. locate standalone
Step "4/6 Locating the standalone output"

if (-not (Test-Path ".next/standalone")) {
  Fail "The build finished but .next/standalone was not created. Check next.config has output: standalone and that only one next.config file exists."
}

$serverJs = Get-ChildItem -Path ".next/standalone" -Filter "server.js" -Recurse -Depth 2 -File -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -notmatch '[\\/]node_modules[\\/]' } |
  Sort-Object { $_.FullName.Length } |
  Select-Object -First 1

if (-not $serverJs) {
  Fail "Could not find server.js inside .next/standalone."
}

$dest = $serverJs.DirectoryName
Write-Host ("Deploy source: " + $dest)

# ---------------------------------------------------------------- 5. copy static + public
Step "5/6 Copying static files and the public folder"

$staticDest = Join-Path $dest ".next/static"
New-Item -ItemType Directory -Force $staticDest | Out-Null
Copy-Item -Recurse -Force ".next/static/*" $staticDest

if (Test-Path "public") {
  $publicDest = Join-Path $dest "public"
  New-Item -ItemType Directory -Force $publicDest | Out-Null
  Copy-Item -Recurse -Force "public/*" $publicDest
}

if (-not (Test-Path (Join-Path $dest ".next/BUILD_ID"))) {
  Fail "BUILD_ID is missing from the standalone output, so the build is incomplete."
}

# ---------------------------------------------------------------- 6. zip
Step "6/6 Creating deploy.zip"

$zip = Join-Path (Get-Location).Path "deploy.zip"
$names = @(Get-ChildItem -Path $dest -Force | ForEach-Object { $_.Name })
$made = $false

# tar writes a proper zip (forward slashes) and is built into Windows 10 and 11
$tar = Join-Path $env:SystemRoot "System32/tar.exe"
if (Test-Path $tar) {
  & $tar -a -cf $zip -C $dest $names
  if (($LASTEXITCODE -eq 0) -and (Test-Path $zip)) { $made = $true }
}

if (-not $made) {
  Write-Host "tar was not available, using Compress-Archive instead."
  if (Test-Path $zip) { Remove-Item $zip -Force }
  $items = @(Get-ChildItem -Path $dest -Force | ForEach-Object { $_.FullName })
  Compress-Archive -Path $items -DestinationPath $zip -Force
}

if (-not (Test-Path $zip)) {
  Fail "deploy.zip could not be created."
}

$sizeMB = [math]::Round((Get-Item $zip).Length / 1MB, 1)
Write-Host ""
Write-Host ("deploy.zip is ready (" + $sizeMB + " MB)") -ForegroundColor Green

if (Test-Path $tar) {
  Write-Host ""
  Write-Host "First entries in the zip:"
  & $tar -tf $zip | Select-Object -First 8
}

Write-Host ""
Write-Host "Next:" -ForegroundColor Cyan
Write-Host "  1. Upload deploy.zip into ~/digitechapp on the server (cPanel File Manager)."
Write-Host "  2. In the cPanel Terminal run:  bash ~/update.sh"
Write-Host "  3. Hard refresh the site and run the smoke test from the runbook."
