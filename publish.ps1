$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

function Stop-Publish([string]$Message) {
  Write-Host "`n$Message" -ForegroundColor Red
  Read-Host 'Press Enter to close'
  exit 1
}

try {
  git --version 2>$null | Out-Null
  if ($LASTEXITCODE -ne 0) { Stop-Publish 'Install Git first: https://git-scm.com/download/win' }

  git rev-parse --is-inside-work-tree 2>$null | Out-Null
  if ($LASTEXITCODE -ne 0) { Stop-Publish 'This folder is not a Git repository. Follow the first-setup steps in README.md.' }

  $branch = (git branch --show-current).Trim()
  if ($branch -ne 'main') { Stop-Publish "Current branch is '$branch'. Switch to main before publishing." }

  git remote get-url origin 2>$null | Out-Null
  if ($LASTEXITCODE -ne 0) { Stop-Publish 'The origin remote is missing. Follow the first-setup steps in README.md.' }

  git add --all
  if ($LASTEXITCODE -ne 0) { Stop-Publish 'Could not stage the project files.' }

  git diff --cached --quiet
  if ($LASTEXITCODE -eq 0) {
    Write-Host "`nNo changes to publish. nodetrace.ru is already up to date." -ForegroundColor Yellow
    Read-Host 'Press Enter to close'
    exit 0
  }

  $message = "Update NodeTrace $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
  git commit -m $message
  if ($LASTEXITCODE -ne 0) { Stop-Publish 'Could not create a commit.' }

  Write-Host "`nUploading to GitHub..." -ForegroundColor Cyan
  git push origin main
  if ($LASTEXITCODE -ne 0) { Stop-Publish 'Push failed. Check your GitHub access and internet connection.' }

  Write-Host "`nDone. GitHub Actions will build and update nodetrace.ru automatically." -ForegroundColor Green
  Write-Host 'Check progress on the Actions tab in your GitHub repository.'
  Read-Host 'Press Enter to close'
} catch {
  Stop-Publish $_.Exception.Message
}
