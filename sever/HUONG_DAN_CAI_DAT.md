# Hướng dẫn cài đặt và chạy Server

## Bước 1: Cài đặt Node.js

### Cách 1: Tải từ trang chính thức (Khuyến nghị)

1. Truy cập: https://nodejs.org/
2. Tải bản **LTS (Long Term Support)** - phiên bản ổn định
3. Chạy file cài đặt và làm theo hướng dẫn
4. **Quan trọng**: Đảm bảo tích chọn "Add to PATH" trong quá trình cài đặt
5. Khởi động lại PowerShell/Command Prompt sau khi cài đặt

### Cách 2: Sử dụng Chocolatey (nếu đã cài)

```powershell
choco install nodejs
```

### Cách 3: Sử dụng winget (Windows 10/11)

```powershell
winget install OpenJS.NodeJS.LTS
```

## Bước 2: Kiểm tra cài đặt

Mở PowerShell mới và chạy:

```powershell
node --version
npm --version
```

Nếu hiển thị số phiên bản (ví dụ: v20.10.0) thì đã cài đặt thành công!

## Bước 3: Cài đặt dependencies cho project

Mở PowerShell trong thư mục `sever` và chạy:

```powershell
cd C:\Users\Administrator\StudioProjects\Duan_1\sever
npm install
```

## Bước 4: Cấu hình MongoDB

### Nếu dùng MongoDB Local:

1. Đảm bảo MongoDB đang chạy trên máy
2. Tạo file `.env` trong thư mục `sever`:
```
MONGODB_URI=mongodb://localhost:27017/duan1
```

### Nếu dùng MongoDB Atlas (Cloud):

1. Tạo file `.env` trong thư mục `sever`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/duan1
```

## Bước 5: Chạy Server

```powershell
npm start
```

Hoặc chạy ở chế độ development (tự động restart khi có thay đổi):

```powershell
npm run dev
```

## Bước 6: Kiểm tra Server

Mở trình duyệt và truy cập: http://localhost:3000

Bạn sẽ thấy thông báo server đang chạy.

## Lưu ý quan trọng

- **Android Emulator**: Sử dụng `http://10.0.2.2:3000` (đã cấu hình sẵn)
- **Thiết bị thật**: Cần thay đổi IP trong `ApiClient.java` thành IP máy tính của bạn
- **Firewall**: Có thể cần cho phép Node.js qua Windows Firewall

## Khắc phục lỗi

### Lỗi "npm is not recognized"
- Đảm bảo đã cài Node.js
- Khởi động lại PowerShell/Command Prompt
- Kiểm tra PATH: `$env:PATH` (PowerShell) hoặc `echo %PATH%` (CMD)

### Lỗi "Cannot find module"
- Chạy lại: `npm install`

### Lỗi kết nối MongoDB
- Kiểm tra MongoDB đang chạy: `mongod --version`
- Kiểm tra file `.env` có đúng format không

