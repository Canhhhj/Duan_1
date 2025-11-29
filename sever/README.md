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

## Hướng dẫn test API Products

Các endpoint liên quan nằm ở `routes/products.js`:
- Danh sách: `GET /api/products` (routes/products.js:12)
- Chi tiết: `GET /api/products/:id` (routes/products.js:24)
- Thêm: `POST /api/products` (routes/products.js:37)
- Cập nhật: `PUT /api/products/:id` (routes/products.js:47)
- Xóa: `DELETE /api/products/:id` (routes/products.js:66)

### 1) Lấy danh sách sản phẩm

PowerShell:
```powershell
iwr -UseBasicParsing http://localhost:3000/api/products
```

curl:
```bash
curl http://localhost:3000/api/products
```

### 2) Lấy chi tiết sản phẩm

PowerShell:
```powershell
iwr -UseBasicParsing http://localhost:3000/api/products/<productId>
```

curl:
```bash
curl http://localhost:3000/api/products/<productId>
```

### 3) Thêm sản phẩm

Lưu ý: Trường `category` cần một `ObjectId` của danh mục có sẵn. Có thể lấy ID danh mục bằng:
```powershell
iwr -UseBasicParsing http://localhost:3000/api/categories
```

Ví dụ payload:
```json
{
  "name": "Áo phông",
  "description": "Áo phông cotton",
  "price": 99000,
  "category": "<categoryId>",
  "stock": 100,
  "image": "https://example.com/aophong.jpg"
}
```

PowerShell:
```powershell
$body = {
  name = "Áo phông"
  description = "Áo phông cotton"
  price = 99000
  category = "<categoryId>"
  stock = 100
  image = "https://example.com/aophong.jpg"
} | ConvertTo-Json
iwr -UseBasicParsing http://localhost:3000/api/products -Method Post -ContentType 'application/json' -Body $body
```

curl:
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Áo phông",
    "description": "Áo phông cotton",
    "price": 99000,
    "category": "<categoryId>",
    "stock": 100,
    "image": "https://example.com/aophong.jpg"
  }'
```

### 4) Cập nhật sản phẩm

Ví dụ cập nhật giá và tồn kho:
```json
{
  "price": 109000,
  "stock": 120
}
```

PowerShell:
```powershell
$update = @{ price = 109000; stock = 120 } | ConvertTo-Json
iwr -UseBasicParsing http://localhost:3000/api/products/<productId> -Method Put -ContentType 'application/json' -Body $update
```

curl:
```bash
curl -X PUT http://localhost:3000/api/products/<productId> \
  -H "Content-Type: application/json" \
  -d '{ "price": 109000, "stock": 120 }'
```

### 5) Xóa sản phẩm

PowerShell:
```powershell
iwr -UseBasicParsing http://localhost:3000/api/products/<productId> -Method Delete
```

curl:
```bash
curl -X DELETE http://localhost:3000/api/products/<productId>
```

### Định dạng phản hồi

Tất cả endpoint trả về theo cấu trúc:
```json
{
  "success": true,
  "message": "...",
  "data": { }
}
```

## Hướng dẫn test API Giỏ Hàng (Postman)

Các API được triển khai tại `routes/cart.js` và đăng ký ở `server.js:39–45` (mount `'/api/v1/cart'`).

### 1) Lấy Giỏ hàng hiện tại

- Method: `GET`
- URL: `http://localhost:3000/api/v1/cart?userId=<userId>`
- Headers: không bắt buộc
- Kết quả: thông tin `GioHang` và mảng `items` đã populate `Product`
- Tham chiếu code: `routes/cart.js:34`

### 2) Thêm/Tạo Item vào Giỏ hàng

- Method: `POST`
- URL: `http://localhost:3000/api/v1/cart/items`
- Headers: `Content-Type: application/json`
- Body (JSON example):
```json
{
  "userId": "<userId>",
  "productId": "<productId>",
  "soLuong": 2
}
```
- Lưu ý: backend tự tạo `GioHang` nếu chưa tồn tại; nếu item đã có thì tăng `soLuong`
- Tham chiếu code: `routes/cart.js:60`

### 3) Cập nhật Item (đổi số lượng)

- Method: `PUT`
- URL: `http://localhost:3000/api/v1/cart/items/<productId>`
- Headers: `Content-Type: application/json`
- Body (JSON example):
```json
{
  "userId": "<userId>",
  "soLuong": 5
}
```
- Lưu ý: nếu `soLuong = 0` hệ thống sẽ xóa item khỏi giỏ
- Tham chiếu code: `routes/cart.js:88`

### 4) Xóa Item khỏi Giỏ hàng

- Method: `DELETE`
- URL: `http://localhost:3000/api/v1/cart/items/<productId>?userId=<userId>`
- Headers: không bắt buộc
- Tham chiếu code: `routes/cart.js:110`

### 5) Xóa toàn bộ Giỏ hàng

- Method: `DELETE`
- URL: `http://localhost:3000/api/v1/cart?userId=<userId>`
- Headers: không bắt buộc
- Tham chiếu code: `routes/cart.js:46`

### Mẹo khi test

- `<userId>` cần là `ObjectId` hợp lệ của `User`
- `<productId>` lấy từ `GET http://localhost:3000/api/products` hoặc từ dữ liệu bạn đã tạo
- Luôn đặt `Content-Type: application/json` cho `POST/PUT`
- Sau mỗi thao tác, `tongGia` được tính lại tự động dựa trên `soLuong * donGia`

## Hướng dẫn test API Thống Kê (Top) trên Postman

Các endpoint nằm trong `routes/orders.js`:
- Top sản phẩm: `GET /api/orders/top-products` (routes/orders.js:89)
- Top khách hàng: `GET /api/orders/top-customers` (routes/orders.js:148)

### 1) Top sản phẩm bán chạy

- Method: `GET`
- URL cơ bản: `http://localhost:3000/api/orders/top-products`
- Query hỗ trợ:
  - `limit`: số lượng kết quả, ví dụ `5`
  - `status`: trạng thái đơn, ví dụ `delivered` (mặc định)
  - `start`, `end`: lọc theo thời gian `createdAt` (ISO 8601)
- Ví dụ URL hoàn chỉnh:
  - `http://localhost:3000/api/orders/top-products?limit=5&status=delivered&start=2025-01-01T00:00:00.000Z&end=2025-12-31T23:59:59.999Z`
- Kết quả: mảng `items` gồm `{ product, totalQty, revenue, orderCount }`

### 2) Top khách hàng

- Method: `GET`
- URL cơ bản: `http://localhost:3000/api/orders/top-customers`
- Query hỗ trợ:
  - `limit`: số lượng kết quả, ví dụ `5`
  - `status`: trạng thái đơn, ví dụ `delivered`
  - `start`, `end`: lọc theo thời gian `createdAt`
- Ví dụ URL hoàn chỉnh:
  - `http://localhost:3000/api/orders/top-customers?limit=5&status=delivered&start=2025-01-01T00:00:00.000Z&end=2025-12-31T23:59:59.999Z`
- Kết quả: mảng `items` gồm `{ user, totalItems, revenue, orderCount }`

### Lưu ý khi test

- Nếu dữ liệu chưa có đơn ở trạng thái `delivered`, kết quả có thể rỗng. Bạn có thể bỏ `status` hoặc dùng `pending` để kiểm tra.
- Thời gian `start`/`end` nên dùng định dạng ISO 8601 hợp lệ (ví dụ `2025-11-01T00:00:00.000Z`).

## Hướng dẫn test API Tạo Đơn Hàng (Postman)

- Endpoint: `POST /api/orders` (routes/orders.js:207)
- Headers: `Content-Type: application/json`

### Chuẩn bị ID cần thiết

- Lấy `userId`:
  - `GET http://localhost:3000/api/users/list?limit=1` hoặc `GET http://localhost:3000/api/users`
- Lấy `productId`:
  - `GET http://localhost:3000/api/products`

### Body mẫu (JSON)

```json
{
  "user": "<userId>",
  "items": [
    { "product": "<productId1>", "quantity": 2, "price": 16000000 },
    { "product": "<productId2>", "quantity": 1, "price": 500000 }
  ],
  "shippingAddress": "Số 1 Đường ABC, Quận XYZ",
  "status": "pending"
}
```

### Các bước trong Postman

- Chọn method `POST`
- URL: `http://localhost:3000/api/orders`
- Tab Headers: thêm `Content-Type: application/json`
- Tab Body: chọn `raw` và `JSON`, dán nội dung JSON ở trên
- Nhấn `Send`

### Xác minh kết quả

- Phản hồi trả về `success=true` cùng đơn hàng vừa tạo (đã populate ở các API khác).
- Ghi lại `id` đơn hàng, gọi: `GET http://localhost:3000/api/orders/detail/<orderId>` để xem chi tiết.

### Lỗi thường gặp

- `400 Thiếu thông tin đơn hàng`: thiếu `user`, `items`, hoặc `shippingAddress`.
- `404 Không tìm thấy sản phẩm`: một `productId` trong `items` không tồn tại.
- `quantity` phải ≥ 1, `price` ≥ 0.
