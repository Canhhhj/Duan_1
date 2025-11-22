# Script kiểm tra Node.js và npm
Write-Host "=== Kiểm tra Node.js và npm ===" -ForegroundColor Cyan

# Kiểm tra Node.js
Write-Host "`nĐang kiểm tra Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Node.js đã được cài đặt: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ Node.js chưa được cài đặt!" -ForegroundColor Red
        Write-Host "Vui lòng cài đặt Node.js từ: https://nodejs.org/" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Node.js chưa được cài đặt!" -ForegroundColor Red
    Write-Host "Vui lòng cài đặt Node.js từ: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Kiểm tra npm
Write-Host "`nĐang kiểm tra npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ npm đã được cài đặt: v$npmVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ npm chưa được cài đặt!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ npm chưa được cài đặt!" -ForegroundColor Red
    exit 1
}

# Kiểm tra dependencies
Write-Host "`nĐang kiểm tra dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ Dependencies đã được cài đặt" -ForegroundColor Green
} else {
    Write-Host "⚠️  Dependencies chưa được cài đặt" -ForegroundColor Yellow
    Write-Host "Chạy lệnh: npm install" -ForegroundColor Cyan
}

# Kiểm tra file .env
Write-Host "`nĐang kiểm tra file .env..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✅ File .env đã tồn tại" -ForegroundColor Green
} else {
    Write-Host "⚠️  File .env chưa tồn tại" -ForegroundColor Yellow
    Write-Host "Tạo file .env với nội dung: MONGODB_URI=mongodb://localhost:27017/duan1" -ForegroundColor Cyan
}

Write-Host "`n=== Hoàn tất kiểm tra ===" -ForegroundColor Cyan
Write-Host "`nĐể chạy server, sử dụng lệnh: npm start" -ForegroundColor Green

