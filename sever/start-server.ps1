# Script tự động kiểm tra và chạy server
Write-Host "=== Khởi động Server Duan1 ===" -ForegroundColor Cyan

# Kiểm tra Node.js
Write-Host "`n[1/4] Kiểm tra Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Node.js chưa được cài đặt!" -ForegroundColor Red
        Write-Host "Vui lòng cài đặt Node.js từ: https://nodejs.org/" -ForegroundColor Yellow
        Write-Host "Sau đó khởi động lại PowerShell và chạy lại script này." -ForegroundColor Yellow
        pause
        exit 1
    }
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js chưa được cài đặt!" -ForegroundColor Red
    Write-Host "Vui lòng cài đặt Node.js từ: https://nodejs.org/" -ForegroundColor Yellow
    pause
    exit 1
}

# Kiểm tra dependencies
Write-Host "`n[2/4] Kiểm tra dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  Dependencies chưa được cài đặt. Đang cài đặt..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Lỗi khi cài đặt dependencies!" -ForegroundColor Red
        pause
        exit 1
    }
    Write-Host "✅ Đã cài đặt dependencies" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies đã sẵn sàng" -ForegroundColor Green
}

# Kiểm tra file .env
Write-Host "`n[3/4] Kiểm tra file .env..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  File .env chưa tồn tại. Đang tạo file mặc định..." -ForegroundColor Yellow
    $envContent = "MONGODB_URI=mongodb://localhost:27017/duan1`nPORT=3000"
    $envContent | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✅ Đã tạo file .env với cấu hình mặc định" -ForegroundColor Green
    Write-Host "⚠️  Lưu ý: Đảm bảo MongoDB đang chạy!" -ForegroundColor Yellow
} else {
    Write-Host "✅ File .env đã tồn tại" -ForegroundColor Green
}

# Chạy server
Write-Host "`n[4/4] Khởi động server..." -ForegroundColor Yellow
Write-Host "`n=== Server đang chạy ===" -ForegroundColor Cyan
Write-Host "Nhấn Ctrl+C để dừng server`n" -ForegroundColor Yellow

npm start

