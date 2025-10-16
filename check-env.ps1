#!/usr/bin/env powershell

# Environment Check Script
# Run this to quickly detect if your development environment has changed

Write-Host "Checking Development Environment..." -ForegroundColor Cyan
Write-Host ""

# Check Node.js version
$currentNode = node --version
$expectedNode = "v25.0.0"  # Update this when you expect changes

if ($currentNode -eq $expectedNode) {
    Write-Host "Node.js: $currentNode (GOOD)" -ForegroundColor Green
} else {
    Write-Host "WARNING: Node.js VERSION CHANGED!" -ForegroundColor Red
    Write-Host "Current:  $currentNode" -ForegroundColor Yellow
    Write-Host "Expected: $expectedNode" -ForegroundColor Yellow
    Write-Host "This might break localStorage in Next.js!" -ForegroundColor Red
}

# Check npm version
$currentNpm = npm --version
Write-Host "npm: v$currentNpm" -ForegroundColor Blue

# Check if localStorage flags are present in package.json
$packageJson = Get-Content "package.json" -Raw
if ($packageJson -match "--experimental-webstorage") {
    Write-Host "localStorage flags: Present in package.json (GOOD)" -ForegroundColor Green
} else {
    Write-Host "localStorage flags: MISSING from package.json (BAD)" -ForegroundColor Red
    Write-Host "Add flags to dev script if localStorage errors occur" -ForegroundColor Yellow
}

# Check if localStorage files exist
if (Test-Path "localStorage.json") {
    Write-Host "localStorage files: Present (normal for development)" -ForegroundColor Blue
} else {
    Write-Host "localStorage files: Not found (will be created on first run)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "If anything looks wrong above, that's likely the cause of issues!" -ForegroundColor Cyan
Write-Host "Run this script daily or when things start breaking unexpectedly." -ForegroundColor Gray