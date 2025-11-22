# Server API - Duan1

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Cấu hình MongoDB:
   - Tạo file `.env` trong thư mục `sever` (nếu chưa có)
   - Thêm dòng: `MONGODB_URI=mongodb://localhost:27017/duan1`
   - Hoặc sử dụng MongoDB Atlas: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/duan1`

## Chạy Server

### Development mode:
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

## Kiểm tra Server

Sau khi chạy server, mở trình duyệt và truy cập:
- http://localhost:3000

Bạn sẽ thấy thông báo server đang chạy.

## API Endpoints

- **Users**: `/api/users`
  - POST `/api/users/register` - Đăng ký
  - POST `/api/users/login` - Đăng nhập
  - GET `/api/users` - Danh sách users
  - GET `/api/users/:id` - Chi tiết user

- **Products**: `/api/products`
- **Categories**: `/api/categories`
- **Orders**: `/api/orders`
- **Reviews**: `/api/reviews`
- **Favorites**: `/api/favorites`
- **Vouchers**: `/api/vouchers`
- **Upload**: `/api/upload`

## Lưu ý

- Server mặc định chạy trên port **3000**
- Android emulator kết nối qua: `http://10.0.2.2:3000`
- Thiết bị thật: sử dụng IP máy tính của bạn (ví dụ: `http://192.168.1.100:3000`)

